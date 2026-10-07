import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../nsunext-admin/src/data/seed.js';
import { transition } from '../nsunext-admin/src/lib/model.js';
import { migratePhase3 } from '../nsunext-admin/src/data/phase3.js';
import { campaignStatus, evidenceAvailable, validateEvent } from '../nsunext-admin/src/lib/operations.js';
import { aggregateCSV, auditVisible, metrics } from '../nsunext-admin/src/lib/reporting.js';
import { ADMIN_KEY, SUBMISSIONS_KEY, authorSeekingAction, ownSeekingPosts, recordParticipation, mergeSubmissions, publicRows, publicPerson, donorListed } from '../src/shared/adminBridge.js';
const now = Date.parse('2026-10-07T10:00:00Z');
const seed = () => createSeed(now);
const command = (s, collection, id, action, extra = {}, actor = 'admin-owner') => transition(s, actor, { collection, id, action, revision: s[collection]?.find(r => r.id === id)?.revision, reason: 'Reviewed supporting evidence.', ...extra }, now);

test('version-one migration preserves saved core decisions, revisions and audit', () => {
  const s = seed(); s.version = 1; s.members[0].name = 'Saved correction'; s.audit.push({ id: 'saved' });
  for (const k of ['events', 'moderation', 'requests', 'donors', 'campaigns', 'settings', 'restrictions']) delete s[k];
  const next = migratePhase3(s);
  assert.equal(next.version, 2); assert.equal(next.members[0].name, 'Saved correction'); assert.deepEqual(next.audit, s.audit); assert.ok(next.events.length); assert.deepEqual(migratePhase3(next), next);
});
test('event validation preserves organizer separation, dates, schedule bounds and capacity', () => {
  const e = seed().events[0]; validateEvent(e);
  assert.throws(() => validateEvent({ ...e, endDate: '2026-09-01' }), /31 days/);
  assert.throws(() => validateEvent({ ...e, schedule: [{ date: '2027-01-01', time: '10:00', title: 'Outside range' }] }), /activity/);
  assert.throws(() => validateEvent({ ...e, capacity: -1 }), /Capacity/);
  const next = command(seed(), 'events', e.id, 'edit', { values: { title: 'Edited campus event' } });
  assert.equal(next.events[0].postedBy.name, e.postedBy.name); assert.deepEqual(next.events[0].organizer, e.organizer);
});
test('cancellation updates public registration without deleting historical event', () => {
  const s = command(seed(), 'events', 'event-career-fair', 'cancel');
  const event = publicRows('events', [], s, now).find(e => e.id === 'event-career-fair');
  assert.equal(event.registrationStatus, 'Cancelled');
  assert.throws(() => command(s, 'events', event.id, 'feature'), /published/);
});
test('moderation requires live evidence, separates removal from resolution, prevents duplicate removals', () => {
  const s = seed(); assert.equal(evidenceAvailable(s.moderation.find(r => r.id === 'case-moment'), now), false);
  assert.throws(() => command(s, 'moderation', 'case-moment', 'remove'), /evidence/);
  const removed = command(s, 'moderation', 'case-hiring', 'remove', {}, 'admin-moderator');
  assert.equal(removed.moderation[0].status, 'open'); assert.equal(removed.hiring.find(r => r.id === '2').status, 'removed');
  assert.equal(publicRows('hiring', [], removed, now).some(r => String(r.id) === '2'), false);
  assert.throws(() => command(removed, 'moderation', 'case-hiring', 'remove'), /already/);
  const resolved = command(removed, 'moderation', 'case-hiring', 'resolve'); assert.equal(resolved.moderation[0].status, 'resolved');
  assert.throws(() => command(resolved, 'moderation', 'case-hiring', 'note'), /Reopen/);
});
test('moderators cannot edit emergency data or platform access and audit is case scoped', () => {
  const s = seed(); assert.throws(() => command(s, 'requests', '1', 'resolve', {}, 'admin-moderator'), /permission/);
  assert.throws(() => command(s, 'admins', 'admin-analyst', 'revoke', {}, 'admin-operations'), /permission/);
  const next = command(s, 'moderation', 'case-message', 'start', {}, 'admin-moderator');
  assert.equal(auditVisible(next.audit[0], next.admins[2], next), true);
  assert.equal(auditVisible({ collection: 'members', actorId: 'admin-owner' }, next.admins[2], next), false);
});
test('emergency resolution removes public request; expired request cannot reopen', () => {
  const s = command(seed(), 'requests', '1', 'resolve');
  assert.equal(publicRows('requests', [], s, now).some(r => String(r.id) === '1'), false);
  s.requests[0].expiresAt = new Date(now - 1).toISOString();
  assert.throws(() => command(s, 'requests', '1', 'reopen'), /eligible/);
});
test('donor listing changes never override stated unavailability', () => {
  const s = seed(); assert.ok(s.donors.length); s.donors[0].available = false;
  const next = command(s, 'donors', s.donors[0].id, 'remove');
  assert.equal(donorListed({ id: next.donors[0].id }, next), false);
  const restored = command(next, 'donors', next.donors[0].id, 'reinstate'); assert.equal(restored.donors[0].available, false);
});
test('campaign schedule, pause, resume and safe destinations govern public availability', () => {
  const s = seed(); const campaign = s.campaigns[1];
  assert.equal(campaignStatus(campaign, now), 'draft');
  const published = command(s, 'campaigns', campaign.id, 'publish');
  assert.equal(campaignStatus(published.campaigns[1], now), 'scheduled');
  assert.equal(publicRows('campaigns', [], published, now).length, 1);
  const paused = command(published, 'campaigns', 'campus-careers', 'pause'); assert.equal(publicRows('campaigns', [], paused, now).length, 0);
  s.campaigns[1].destination = 'javascript:alert(1)'; assert.throws(() => command(s, 'campaigns', campaign.id, 'publish'), /destination/);
});
test('last owner and self protection also cover team demotion and revocation', () => {
  const s = seed(); assert.throws(() => command(s, 'admins', 'admin-owner', 'revoke'), /own/);
  const added = command(s, 'admins', 'new-owner', 'create', { values: { name: 'Second owner', email: 'second@example.test', role: 'owner' } });
  assert.equal(added.admins.at(-1).active, false);
  assert.throws(() => command(added, 'admins', 'admin-owner', 'revoke', {}, 'new-owner'), /permission/);
  const activated = command(added, 'admins', 'new-owner', 'activate');
  const revoked = command(activated, 'admins', 'admin-owner', 'revoke', {}, 'new-owner');
  assert.equal(revoked.admins.filter(a => a.active && a.role === 'owner').length, 1);
});
test('analytics uses department and period filters and CSV neutralizes formulas', () => {
  const s = command(seed(), 'verification', 'verify-005', 'approve', { values: { reviewed: true } });
  const filters = { from: '2026-10-07', to: '2026-10-07', department: 'cse' };
  assert.equal(metrics(s, filters, now).find(m => m.name === 'Verification approvals').value, 1);
  assert.equal(metrics(s, { ...filters, department: 'architecture' }, now).find(m => m.name === 'Verification approvals').value, 0);
  const csv = aggregateCSV([{ name: '=HYPERLINK("bad")', value: 1, definition: '+unsafe' }], filters);
  assert.ok(csv.includes("'=HYPERLINK")); assert.ok(csv.includes("'+unsafe")); assert.ok(csv.includes('Asia/Dhaka')); assert.equal(csv.includes('@northsouth.edu'), false);
});
test('public submissions import idempotently without reverting subsequent decisions', () => {
  const input = [{ collection: 'hiring', at: new Date(now).toISOString(), row: { ...seed().hiring[0], id: 'public-job', status: 'pending' } }];
  const s = mergeSubmissions(seed(), input); const n = s.hiring.find(r => r.id === 'public-job');
  assert.equal(mergeSubmissions(s, input), s);
  const approved = command(s, 'hiring', n.id, 'approve');
  assert.equal(mergeSubmissions(approved, input).hiring.find(r => r.id === n.id).status, 'published');
  assert.ok(publicRows('hiring', [], approved, now).some(r => r.id === 'public-job'));
  assert.throws(() => transition(approved, 'admin-owner', { collection: 'hiring', id: n.id, action: 'reject', revision: n.revision, reason: 'Stale decision' }, now), /changed/);
});
test('verification and restrictions use canonical member IDs; public content hides suspended authors', () => {
  const s = seed(); s.members.find(m => m.id === '2').status = 'suspended';
  assert.equal(publicPerson({ id: 2 }, s).accountStatus, 'suspended'); assert.equal(publicRows('hiring', [], s, now).length, 0);
});

function withLocalStorage(state, run) {
  const values = new Map(state ? [[ADMIN_KEY, JSON.stringify(state)]] : []);
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) } });
  try { run(values); } finally { if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage; }
}
test('author pause preserves approval, withdrawal stays hidden, and rejection cannot resume', () => {
  const s = seed(); const p = s.seeking[0]; p.status = 'active'; delete p.approvedAt; p.expiresAt = new Date(Date.now() + 86400000).toISOString();
  withLocalStorage(s, values => {
    authorSeekingAction({ id:p.id, status:'active' }, 'pause');
    authorSeekingAction({ id:p.id, status:'paused' }, 'resume');
    let row = JSON.parse(values.get(SUBMISSIONS_KEY)).records[0].row; assert.equal(row.status, 'active'); assert.ok(row.approvedAt);
    authorSeekingAction({ id:p.id, status:'active' }, 'withdraw');
    row = JSON.parse(values.get(SUBMISSIONS_KEY)).records[0].row;
    assert.deepEqual(ownSeekingPosts([{ id:p.id }], { seeking:[row] }), []);
  });
  p.status = 'rejected';
  withLocalStorage(s, () => assert.throws(() => authorSeekingAction({ id:p.id }, 'resume'), /review/));
});
test('participation is idempotent and counts never become negative', () => {
  const s = seed(); const e = s.events[0]; e.goingCount = 0;
  withLocalStorage(s, values => {
    recordParticipation(e, '203', 'going', true); recordParticipation(e, '203', 'going', true);
    assert.equal(JSON.parse(values.get(SUBMISSIONS_KEY)).records[0].row.goingCount, 1);
    recordParticipation(e, '203', 'going', false); recordParticipation(e, '203', 'going', false);
    assert.equal(JSON.parse(values.get(SUBMISSIONS_KEY)).records[0].row.goingCount, 0);
  });
});
test('new emergency submissions appear before an admin workspace is initialized', () => {
  withLocalStorage(null, values => {
    values.set(SUBMISSIONS_KEY, JSON.stringify({version:1,records:[{collection:'requests',row:{id:'new',status:'open',expiresAt:new Date(Date.now()+86400000).toISOString()}}]}));
    assert.equal(publicRows('requests', []).at(-1).id, 'new');
  });
});

test('new events preserve publisher and organizer and appear in the public read model', () => {
  const event = { ...seed().events[0], date:'2026-10-20', endDate:'2026-10-20', schedule:[], registrationDeadline:'' };
  const next = command(seed(), 'events', 'qa-created', 'create', {values:event});
  const created = next.events.find(e => e.id === 'qa-created');
  assert.equal(created.postedBy.name, next.admins[0].name); assert.deepEqual(created.organizer, event.organizer);
  assert.ok(publicRows('events', [], next, now).some(e => e.id === 'qa-created'));
});
test('registration blocks full capacity as well as closed events', () => {
  const s = seed(); const e = s.events[0]; e.endDate = '2099-01-01'; e.registrationDeadline = ''; e.registrationOverride='open'; e.capacity=1; e.registrations=[{memberId:'1'}];
  withLocalStorage(s, () => assert.throws(() => recordParticipation(e,'203','registered',true), /capacity/));
  e.capacity=0; e.registrationOverride='closed';
  withLocalStorage(s, () => assert.throws(() => recordParticipation(e,'203','registered',true), /no longer/));
});

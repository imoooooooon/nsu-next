import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../nsunext-admin/src/data/seed.js';
import { can, effectiveStatus, queueItems, transition } from '../nsunext-admin/src/lib/model.js';
import { createRepository, STORE_KEY } from '../nsunext-admin/src/data/repository.js';
const now = Date.parse('2026-10-07T10:00:00Z');
const seed = () => createSeed(now);
const decide = (s, collection, id, action, more = {}, actor = 'admin-owner') => transition(s, actor, { collection, id, revision: s[collection].find(r => r.id === id)?.revision, action, ...more }, now);

test('academic identities and restricted platform roles cannot mutate core records', () => {
  const s = seed();
  assert.equal(can({ role: 'Faculty', active: true }, 'members'), false);
  for (const actor of ['admin-moderator', 'admin-analyst', 'not-an-admin']) assert.throws(() => decide(s, 'verification', 'verify-005', 'approve', { values: { reviewed: true } }, actor), /permission/);
  assert.equal(s.members.find(m => m.id === '5').verified, false);
});
test('verification requires evidence review and updates identity independently of account status', () => {
  const s = seed(); s.members.find(m => m.id === '5').status = 'suspended';
  assert.throws(() => decide(s, 'verification', 'verify-005', 'approve'), /evidence/);
  assert.throws(() => decide(s, 'verification', 'verify-006', 'approve', { values: { reviewed: true } }), /evidence/);
  const next = decide(s, 'verification', 'verify-005', 'approve', { values: { reviewed: true } });
  assert.equal(next.members.find(m => m.id === '5').verified, true);
  assert.equal(next.members.find(m => m.id === '5').status, 'suspended');
  assert.equal(next.audit[0].actorId, 'admin-owner');
  assert.throws(() => decide(next, 'verification', 'verify-005', 'approve', { values: { reviewed: true } }), /pending/);
});
test('negative decisions require reasons and stale revisions cannot overwrite decisions', () => {
  const s = seed();
  assert.throws(() => decide(s, 'verification', 'verify-005', 'reject'), /reason/);
  const next = decide(s, 'verification', 'verify-005', 'information', { reason: 'Please submit a clear certificate.' });
  assert.equal(next.verification[0].status, 'needs_information');
  assert.throws(() => transition(next, 'admin-owner', { collection: 'verification', id: 'verify-005', action: 'reject', revision: 1, reason: 'Duplicate submission' }, now), /changed/);
});
test('ownership approval assigns one owner and atomically closes competing claims', () => {
  const next = decide(seed(), 'claims', 'claim-109', 'approve');
  assert.equal(next.departments.find(d => d.id === 'architecture').ownerId, '109');
  assert.equal(next.claims.find(c => c.id === 'claim-113').status, 'closed');
  assert.equal(next.departments.find(d => d.id === 'architecture').revision, 2);
  assert.throws(() => decide(next, 'claims', 'claim-113', 'approve'), /awaiting/);
});
test('ownership rechecks current eligibility and department state at decision time', () => {
  for (const mutate of [s => { s.members.find(m => m.id === '109').verified = false; }, s => { s.departments.find(d => d.id === 'architecture').ownerId = '113'; }, s => { s.departments.find(d => d.id === 'architecture').status = 'archived'; }]) {
    const s = seed(); mutate(s); assert.throws(() => decide(s, 'claims', 'claim-109', 'approve'));
  }
});
test('department recovery is owner-only and preserves the former owner as Primary Admin', () => {
  const s = seed(); const options = { reason: 'Official ownership recovery request.', values: { memberId: '105' } };
  assert.throws(() => decide(s, 'departments', 'cse', 'recover', options, 'admin-operations'), /Platform Owner/);
  const next = decide(s, 'departments', 'cse', 'recover', options);
  assert.equal(next.departments[0].ownerId, '105'); assert.equal(next.departments[0].assignments['101'], 'primary');
  assert.throws(() => decide(s, 'departments', 'cse', 'access', { reason: 'Remove owner privileges', values: { memberId: '101', permission: 'remove' } }), /other than the owner/);
});
test('last-owner restriction cannot be bypassed by account suspension', () => {
  const s = seed(); assert.throws(() => decide(s, 'members', '1', 'suspend', { reason: 'Restriction requested' }), /own administrator/);
  s.admins.push({ id: 'other-owner', role: 'owner', active: true, name: 'Second operator', memberId: '2' });
  s.admins[0].active = false;
  assert.throws(() => decide(s, 'members', '2', 'suspend', { reason: 'Restriction requested' }, 'admin-operations'), /Platform Owner/);
  // An owner without a linked member may not remove the last member-linked owner either when only one remains active.
  s.admins[0].active = true; s.admins[0].memberId = null;
  const next = decide(s, 'members', '2', 'suspend', { reason: 'Restriction requested' });
  assert.equal(next.admins.find(a => a.id === 'other-owner').active, false);
});
test('career reviews preserve paused/expired states and block unverified authors', () => {
  const s = seed();
  assert.throws(() => decide(s, 'seeking', s.seeking[2].id, 'approve'), /verified/);
  assert.throws(() => decide(s, 'seeking', s.seeking[4].id, 'approve'), /pending/);
  assert.equal(effectiveStatus(s.seeking[5], 'seeking', now), 'expired');
  const next = decide(s, 'seeking', s.seeking[0].id, 'approve');
  assert.equal(next.seeking[0].status, 'active'); assert.equal(next.seeking[0].expiresAt, s.seeking[0].expiresAt);
  assert.equal(queueItems(next, now).length, queueItems(s, now).length - 1);
  s.hiring[0].deadline = new Date(now).toISOString();
  assert.throws(() => decide(s, 'hiring', '1', 'approve'), /unexpired/);
});
test('department edits validate unique identifiers and safe links', () => {
  const s = seed();
  assert.throws(() => decide(s, 'departments', 'cse', 'edit', { values: { ...s.departments[0], code: 'ECE' } }), /already exists/);
  assert.throws(() => decide(s, 'departments', 'cse', 'edit', { values: { ...s.departments[0], website: 'javascript:alert(1)' } }), /http/);
  const next = transition(s, 'admin-owner', { collection: 'departments', action: 'create', values: { name: 'Economics', code: 'ECO', school: 'Business & Economics' } }, now);
  assert.equal(next.departments.at(-1).ownerId, null); assert.equal(next.audit[0].action, 'create');
});
test('repository persists atomically and refuses incompatible data rather than resetting it', () => {
  const memory = new Map(); let fail = false;
  const storage = { getItem: k => memory.get(k) || null, setItem(k, value) { if (fail) throw new Error('storage full'); memory.set(k, value); } };
  const repo = createRepository(storage, seed); repo.load(); const before = memory.get(STORE_KEY);
  fail = true;
  assert.throws(() => repo.commit('admin-owner', { collection: 'verification', id: 'verify-005', revision: 1, action: 'reject', reason: 'Document mismatch' }), /storage full/);
  assert.equal(memory.get(STORE_KEY), before);
  fail = false; memory.set(STORE_KEY, '{"version":999}');
  assert.throws(() => repo.load(), /incompatible/); assert.equal(memory.get(STORE_KEY), '{"version":999}');
});

// Local, same-origin prototype transport. Contains no authentication or private media.
export const ADMIN_KEY = 'ugrads-admin-data-v1';
export const SUBMISSIONS_KEY = 'ugrads-public-submissions-v1';
const listeners = new Set();
let tick = Date.now();
export const bridgeSnapshot = () => tick;
export function bridgeNotify() { tick = Math.max(Date.now(), tick + 1); listeners.forEach(fn => fn()); }
export function subscribeBridge(fn) { listeners.add(fn); return () => listeners.delete(fn); }
if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => { if ([ADMIN_KEY, SUBMISSIONS_KEY, null].includes(e.key)) bridgeNotify(); });
  // Time-derived availability refreshes while an app is open; no background service.
  setInterval(bridgeNotify, 60000);
}
export function readBridge(storage = globalThis.localStorage) {
  try { const value = JSON.parse(storage?.getItem(ADMIN_KEY) || 'null'); return value && [1, 2].includes(value.version) ? value : null; } catch { return null; }
}
export function readSubmissions(storage = globalThis.localStorage) {
  const raw = storage?.getItem(SUBMISSIONS_KEY);
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (value.version !== 1 || !Array.isArray(value.records)) throw new Error('Local submission data is incompatible.');
  return value.records;
}
export function mergeSubmissions(state, submissions) {
  let next = state;
  for (const item of submissions) {
    if (!['hiring', 'seeking', 'events', 'requests', 'claims', 'departments'].includes(item.collection)) continue;
    const before = next[item.collection]?.find(r => r.id === item.row.id);
    if (before?.publicImportedAt >= item.at) continue;
    if (next === state) next = structuredClone(state);
    const row = { ...before, ...item.row, revision: (before?.revision || 0) + 1, publicImportedAt: item.at };
    // Public updates cannot erase a moderation restriction.
    if (before?.status === 'removed' && item.collection !== 'claims') row.status = 'removed';
    const index = next[item.collection].findIndex(r => r.id === row.id);
    if (index < 0) next[item.collection].push(row); else next[item.collection][index] = row;
    next.revision += 1;
  }
  return next;
}
export function submitPublic(collection, row, storage = globalThis.localStorage) {
  if (!['hiring', 'seeking', 'events', 'requests', 'claims', 'departments'].includes(collection)) throw new Error('Unsupported public submission.');
  const current = readBridge(storage);
  const member = current?.members.find(m => m.id === String(row.memberId));
  if (member?.status === 'suspended') throw new Error('This account is restricted. Contact campus support.');
  const before = current?.[collection]?.find(r => r.id === String(row.id));
  if (before?.status === 'removed') throw new Error('This content has been removed by moderation.');
  const records = readSubmissions(storage);
  const previousTime = records.find(r => r.collection === collection && r.row.id === String(row.id))?.at;
  const at = new Date(Math.max(Date.now(), (Date.parse(previousTime) || 0) + 1)).toISOString();
  const record = { collection, at, row: { ...row, id: String(row.id), memberId: String(row.memberId || ''), submittedAt: at } };
  storage.setItem(SUBMISSIONS_KEY, JSON.stringify({ version: 1, records: [...records.filter(r => !(r.collection === collection && r.row.id === record.row.id)), record] }));
  bridgeNotify();
  return record.row;
}
export function publicState(storage = globalThis.localStorage) {
  const state = readBridge(storage);
  if (!state) return null;
  try { return mergeSubmissions(state, readSubmissions(storage)); } catch { return state; }
}
export const restricted = (state, type, id) => state?.restrictions?.some(r => r.type === type && r.entityId === String(id)) || false;
export function publicRows(kind, base, state = publicState(), now = Date.now()) {
  if (!state) {
    let incoming = []; try { incoming = readSubmissions().filter(r => r.collection === kind).map(r => r.row); } catch { /* retain the fixtures */ }
    if (!incoming.length) return base;
    state = { members: [], restrictions: [], [kind]: incoming };
  }
  const records = state[kind] || [];
  if (!records.length && !['hiring', 'seeking', 'events', 'requests', 'campaigns'].includes(kind)) return base;
  const ids = new Set(records.map(r => r.id));
  const retained = base.filter(b => !ids.has(String(b.id)));
  return [...retained, ...records.flatMap(r => {
    const original = base.find(b => String(b.id) === r.id) || r.publicData || {};
    const author = state.members.find(m => m.id === r.memberId);
    if (author?.status === 'suspended' && ['hiring', 'seeking'].includes(kind)) return [];
    if (kind === 'hiring') return r.status === 'published' && Date.parse(r.deadline) > now && !restricted(state, 'hiring', r.id) ? [{ ...original, id: /^\d+$/.test(r.id) ? Number(r.id) : r.id, title: r.title, company: r.company, type: r.category, location: r.location, salary: r.compensation, deadline: new Date(r.deadline).toLocaleDateString('en-GB'), preview: r.description, reqs: r.skills || [], departmentId: r.departmentId, deptId: r.departmentId, posted: 'Reviewed', postedBy: { userId: Number(r.memberId), name: author?.name || 'Campus member', role: author?.designation || author?.identity, type: author?.identity, verified: author?.verified } }] : [];
    if (kind === 'seeking') return r.status === 'active' && Date.parse(r.expiresAt) > now && !restricted(state, 'seeking', r.id) ? [{ ...original, id: r.id, headline: r.title, category: r.category, fullBio: r.description, bioPreview: r.description, skills: r.skills || [], workMode: String(r.workMode || '').split(', '), availability: r.availability, commitment: r.commitment, compensation: r.compensation, location: r.location, visibility: r.visibility, preferredDuration: r.preferredDuration, portfolioUrl: r.portfolioUrl, resumeUrl: r.resumeUrl, linkedInUrl: r.linkedInUrl, githubUrl: r.githubUrl, status: 'active', expiresIn: `${Math.ceil((Date.parse(r.expiresAt) - now) / 86400000)} days`, student: { ...original.student, id: Number(r.memberId), name: author?.name || 'Student', department: author?.department || r.department, verified: author?.verified, avatar: original.student?.avatar || '', batch: author?.batch || '' } }] : [];
    if (kind === 'events') return r.status !== 'removed' && !restricted(state, 'event', r.id) ? [{ ...original, ...r, deptId: r.departmentId || r.deptId, registrationStatus: r.status === 'cancelled' ? 'Cancelled' : r.registrationOverride === 'closed' || Date.parse(r.registrationDeadline) < now || Date.parse(`${r.endDate}T23:59:59+06:00`) < now ? 'Closed' : 'Open', organizer: r.organizer, tags: r.tags || [r.category], schedule: r.schedule || [] }] : [];
    if (kind === 'requests') return r.status === 'open' && Date.parse(r.expiresAt) > now && !restricted(state, 'request', r.id) ? [{ ...original, ...r, id: /^\d+$/.test(r.id) ? Number(r.id) : r.id }] : [];
    if (kind === 'campaigns') return r.status === 'published' && Date.parse(r.startsAt) <= now && Date.parse(r.endsAt) > now ? [r] : [];
    return [];
  })];
}
export function publicPerson(person, state = publicState()) {
  const record = state?.members.find(m => m.id === String(person.id));
  return record ? { ...person, name: record.name, dept: record.department, role: record.designation || person.role, office: record.office, verified: record.verified, accountStatus: record.status } : person;
}
export function donorListed(person, state = publicState()) { return state?.donors?.find(d => d.id === String(person.id))?.status !== 'removed'; }
export function seekingSubmission(post) {
  const duration = Number.parseInt(post.durationDays || post.duration, 10) || 30;
  if (![14, 30, 60].includes(duration) || !post.headline?.trim() || post.headline.length > 60 || (post.fullBio || post.bioPreview || '').length > 400 || !post.skills?.length || post.skills.length > 8) throw new Error('Check the headline, introduction, skills and 14/30/60-day duration.');
  return { id: post.id, publicData: post, memberId: String(post.student?.id && post.student.id !== 'me' ? post.student.id : '203'), title: post.headline, category: post.category, description: post.fullBio || post.bioPreview, skills: post.skills || [], workMode: (post.workMode || []).join(', '), location: post.location, availability: post.availability, commitment: post.commitment, compensation: post.compensation, visibility: post.visibility, preferredDuration: post.preferredDuration, portfolioUrl: post.portfolioUrl, resumeUrl: post.resumeUrl, linkedInUrl: post.linkedInUrl, githubUrl: post.githubUrl, status: post.status === 'draft' ? 'draft' : 'pending', approvedAt: null, durationDays: duration, expiresAt: new Date(Date.now() + duration * 86400000).toISOString() };
}

export function authorSeekingAction(post, action) {
  if (action === 'duplicate' || post.status === 'draft') return;
  const row = publicState()?.seeking.find(p => p.id === post.id) || seekingSubmission(post);
  if (row.status === 'removed') throw new Error('This listing was removed by moderation.');
  let status = row.status;
  const approvedAt = row.approvedAt || (row.status === 'active' ? new Date().toISOString() : null);
  if (action === 'resume') {
    if (!(row.approvedAt || row.status === 'active') || Date.parse(row.expiresAt) <= Date.now()) throw new Error('Submit this listing for review before making it active.');
    status = 'active';
  } else if (action === 'renew') status = 'pending';
  else if (['pause', 'unavailable'].includes(action)) {
    if (!['active', 'paused'].includes(row.status)) throw new Error('Only approved listings can be paused.');
    status = 'paused';
  } else if (['withdraw', 'delete'].includes(action)) status = 'withdrawn';
  submitPublic('seeking', { ...row, status, approvedAt, ...(action === 'renew' ? { approvedAt: null, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() } : {}), ...(action === 'unavailable' ? { availability: 'Not available' } : {}) });
}

export function publicDepartments(base, state = publicState()) {
  if (!state) return base;
  const mapped = state.departments.map(d => ({
    ...(base.find(b => b.id === d.id) || { short: d.code, verified: true, established: '—', stats: { students: 0, alumni: 0, faculty: 0 }, memberCount: 0, emailReach: 0, broadcastChannelId: `dept-${d.id}-broadcast`, helpDeskId: `dept-${d.id}-helpdesk` }),
    id: d.id, code: d.code, name: d.name, school: d.school, about: d.description, office: d.office, officeHours: d.hours, email: d.email, phone: d.phone,
    website: String(d.website || '').replace(/^https?:\/\//, ''), officialId: d.ownerId ? Number(d.ownerId) : null, assignments: d.assignments, adminIds: Object.keys(d.assignments).map(Number), status: d.status,
  }));
  return [...base.filter(b => !mapped.some(d => d.id === b.id)), ...mapped];
}

export function ownSeekingPosts(posts, state = publicState(), now = Date.now()) {
  return posts.filter(p => state?.seeking.find(x => x.id === p.id)?.status !== 'withdrawn').map(p => { const r = state?.seeking.find(x => x.id === p.id); return r ? { ...p, status:['active','pending','paused','draft'].includes(r.status) ? (Date.parse(r.expiresAt) <= now ? 'expired' : r.status) : 'paused', reviewStatus:r.status, reviewReason:r.reason } : p; });
}
export function recordParticipation(event, memberId, kind, enabled) {
  const state = publicState();
  const current = state?.events.find(e => e.id === event.id) || event;
  if (enabled && (['cancelled','removed'].includes(current.status) || kind === 'registered' && (current.registrationOverride === 'closed' || Date.parse(current.registrationDeadline) < Date.now() || Date.parse(`${current.endDate}T23:59:59+06:00`) < Date.now()))) throw new Error('This event is no longer accepting participation.');
  const wasEnabled = (current.participation || []).some(r => r.memberId === String(memberId) && r.kind === kind);
  if (enabled === wasEnabled) return;
  if (enabled && kind === 'registered' && Number(current.capacity) > 0 && (current.registrations || []).length >= Number(current.capacity)) throw new Error('This event has reached its registration capacity.');
  const entries = (current.participation || []).filter(r => !(r.memberId === String(memberId) && r.kind === kind));
  if (enabled) entries.push({ memberId:String(memberId), kind, at:new Date().toISOString() });
  submitPublic('events', { ...current, status:current.status || 'published', participation:entries, registrations:entries.filter(r => r.kind === 'registered'), goingCount:Math.max(0, (current.goingCount || 0) + (kind === 'going' ? enabled ? 1 : -1 : 0)), interestedCount:Math.max(0, (current.interestedCount || 0) + (kind === 'interested' ? enabled ? 1 : -1 : 0)) });
}

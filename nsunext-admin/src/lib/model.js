import { OPERATIONS, operate } from './operations.js';
import { officialEmail, PERMISSIONS } from '../../../src/shared/departmentModel.js';

export const ROLES = { owner: 'Platform Owner', operations: 'Operations Admin', moderator: 'Moderator', analyst: 'Analyst' };
const grants = {
  owner: ['overview', 'members', 'verification', 'departments', 'claims', 'hiring', 'seeking', 'recovery', ...OPERATIONS, 'analytics', 'audit', 'preferences'],
  operations: ['overview', 'members', 'verification', 'departments', 'claims', 'hiring', 'seeking', ...OPERATIONS.filter(c => c !== 'admins'), 'analytics', 'audit', 'preferences'],
  moderator: ['overview', 'moderation', 'audit', 'preferences'], analyst: ['overview', 'analytics', 'preferences'],
};
export const can = (actor, capability) => !!actor?.active && !!grants[actor.role]?.includes(capability);
export const labels = { pending: 'Pending review', needs_information: 'Needs information', changes_requested: 'Changes requested', active: 'Active', published: 'Published', approved: 'Approved', rejected: 'Rejected', suspended: 'Suspended', closed: 'Closed', archived: 'Archived', removed: 'Removed', paused: 'Paused', expired: 'Expired', approve: 'Approved', reject: 'Rejected', information: 'Requested information', edit: 'Updated', create: 'Created', recover: 'Ownership recovered', access: 'Access updated', suspend: 'Suspended', reactivate: 'Reactivated', archive: 'Archived', close: 'Closed', changes: 'Changes requested', remove: 'Removed' };
export const label = value => labels[value] || String(value || '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
export const getById = (state, collection, id) => state[collection]?.find(record => record.id === String(id));
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
export function effectiveStatus(record, collection, now = Date.now()) {
  if (collection === 'seeking' && ['active', 'pending', 'paused'].includes(record.status) && Date.parse(record.expiresAt) <= now) return 'expired';
  if (collection === 'hiring' && ['published', 'pending'].includes(record.status) && Date.parse(record.deadline) <= now) return 'expired';
  return record.status;
}
export function safeUrl(value) {
  if (!value) return true;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}
export function validateDepartment(values, state, currentId) {
  requireValue(values.name?.trim() && values.code?.trim() && values.school?.trim(), 'Name, code and school are required.');
  requireValue(/^[a-z0-9 -]{2,24}$/i.test(values.code), 'Use 2–24 letters, numbers, spaces or hyphens for the code.');
  requireValue(!state.departments.some(d => d.id !== currentId && d.code.toLowerCase() === values.code.trim().toLowerCase()), 'That department code already exists.');
  requireValue(!values.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email), 'Enter a valid contact email.');
  requireValue(safeUrl(values.website) && safeUrl(values.cover), 'Website and cover must use a valid http or https URL.');
  requireValue((values.description || '').length <= 2000, 'Description must be 2,000 characters or fewer.');
}
const pick = (source, keys) => Object.fromEntries(keys.map(key => [key, String(source[key] || '').trim()]));

// Pure transition boundary. UI visibility is never the only permission check.
export function transition(state, actorId, command, now = Date.now()) {
  const actor = state.admins.find(a => a.id === actorId && a.active);
  const { collection, id, action, revision, values = {}, reason = '' } = command;
  requireValue(can(actor, collection), 'You do not have permission to perform this action.');
  const before = getById(state, collection, id);
  requireValue(action === 'create' && ['departments', 'events', 'campaigns', 'admins'].includes(collection) || before, 'This record no longer exists.');
  if (before) requireValue(before.revision === revision, 'This record changed since you opened it. Close this dialog, review the latest details and try again.');
  const s = structuredClone(state);
  let row = getById(s, collection, id);
  const timestamp = new Date(now).toISOString();
  const needReason = !['approve', 'edit', 'create'].includes(action);
  if (needReason) requireValue(reason.trim().length >= 5, 'Add a reason of at least 5 characters.');
  const decide = status => { row.status = status; row.reason = reason.trim(); row.decidedAt = timestamp; row.reviewerName = actor.name; };

  if (OPERATIONS.includes(collection)) {
    row = operate(s, actor, command, row, now);
  } else if (collection === 'members') {
    if (action === 'edit') {
      const fields = pick(values, ['name', 'department', 'designation', 'office', 'phone']);
      requireValue(fields.name.length >= 2, 'Enter the member’s full name.');
      requireValue(fields.department.length > 0, 'Department or office affiliation is required.');
      Object.assign(row, fields);
    } else {
      requireValue(['suspend', 'reactivate'].includes(action), 'Unsupported member action.');
      requireValue(row.status === (action === 'suspend' ? 'active' : 'suspended'), 'Account status has already changed.');
      const linkedAdmin = s.admins.find(a => a.memberId === row.id && a.active);
      if (action === 'suspend' && linkedAdmin) {
        requireValue(actor.role === 'owner', 'Only a Platform Owner can restrict a platform administrator.');
        requireValue(linkedAdmin.id !== actor.id, 'You cannot suspend your own administrator account.');
        requireValue(linkedAdmin.role !== 'owner' || s.admins.filter(a => a.active && a.role === 'owner').length > 1, 'The last active Platform Owner cannot be suspended.');
        linkedAdmin.active = false; linkedAdmin.status = 'revoked'; linkedAdmin.revision = (linkedAdmin.revision || 1) + 1;
      }
      decide(action === 'suspend' ? 'suspended' : 'active');
    }
  } else if (collection === 'verification') {
    requireValue(row.status === 'pending', 'Only a pending request can be reviewed. A new applicant revision is needed.');
    requireValue(['approve', 'reject', 'information'].includes(action), 'Unsupported verification decision.');
    const member = getById(s, 'members', row.memberId);
    requireValue(member, 'Applicant not found.');
    if (action === 'approve') {
      requireValue(row.evidence === 'available' && values.reviewed === true, 'Review the available evidence before approving.');
      if (member.identity === 'Staff') requireValue(officialEmail(member.email), 'Staff verification requires the exact northsouth.edu email domain.');
      member.verified = true; member.revision += 1;
    }
    decide(({ approve: 'approved', reject: 'rejected', information: 'needs_information' })[action]);
  } else if (collection === 'claims') {
    requireValue(row.status === 'pending', 'This claim is no longer awaiting a decision.');
    requireValue(['approve', 'reject', 'information'].includes(action), 'Unsupported ownership decision.');
    const department = getById(s, 'departments', row.departmentId);
    const applicant = getById(s, 'members', row.memberId);
    requireValue(department, 'Department not found.');
    if (action === 'approve') {
      requireValue(department.status === 'active' && !department.ownerId, 'The department is archived or already has an owner. Use the recovery workflow if needed.');
      requireValue(applicant?.identity === 'Faculty' && applicant.verified && applicant.status === 'active', 'Only an active, verified faculty applicant can own an unclaimed department.');
      department.ownerId = applicant.id; delete department.assignments[applicant.id]; department.revision += 1;
      for (const other of s.claims.filter(c => c.departmentId === department.id && c.id !== id && c.status === 'pending')) {
        Object.assign(other, { status: 'closed', reason: 'Department assigned through another approved claim.', decidedAt: timestamp, reviewerName: actor.name, revision: other.revision + 1 });
      }
    }
    decide(({ approve: 'approved', reject: 'rejected', information: 'needs_information' })[action]);
  } else if (collection === 'departments') {
    if (['create', 'edit'].includes(action)) {
      const fields = pick(values, ['name', 'code', 'school', 'description', 'office', 'hours', 'email', 'phone', 'website', 'cover']);
      validateDepartment(fields, s, id);
      if (action === 'create') {
        const newId = fields.code.toLowerCase().replaceAll(' ', '-');
        requireValue(!s.departments.some(d => d.id === newId), 'A department with this identifier already exists.');
        row = { id: newId, ...fields, ownerId: null, assignments: {}, status: 'active', createdAt: timestamp, revision: 0 }; s.departments.push(row);
      } else Object.assign(row, fields);
    } else if (action === 'access') {
      requireValue(row.status === 'active', 'Reactivate this department before changing access.');
      const person = getById(s, 'members', values.memberId);
      requireValue(person && person.id !== row.ownerId, 'Select a member other than the owner.');
      requireValue(values.permission === 'remove' || (person.verified && person.status === 'active' && PERMISSIONS[values.permission]), 'Assignments require an active verified member and a valid permission.');
      if (values.permission === 'remove') { requireValue(row.assignments[person.id], 'This member has no delegated access.'); delete row.assignments[person.id]; }
      else row.assignments[person.id] = values.permission;
    } else if (action === 'recover') {
      requireValue(can(actor, 'recovery'), 'Only a Platform Owner can recover department ownership.');
      const person = getById(s, 'members', values.memberId);
      requireValue(row.status === 'active' && person?.verified && person.status === 'active' && person.id !== row.ownerId, 'Choose another active verified member for an active department.');
      if (row.ownerId) row.assignments[row.ownerId] = 'primary';
      row.ownerId = person.id; delete row.assignments[person.id];
    } else {
      requireValue(['archive', 'reactivate'].includes(action), 'Unsupported department action.');
      requireValue(row.status === (action === 'archive' ? 'active' : 'archived'), 'Department status has already changed.');
      decide(action === 'archive' ? 'archived' : 'active');
    }
  } else if (['hiring', 'seeking'].includes(collection)) {
    const status = effectiveStatus(row, collection, now);
    requireValue(['approve', 'reject', 'changes', 'close', 'remove'].includes(action), 'Unsupported career action.');
    if (['approve', 'reject', 'changes'].includes(action)) requireValue(status === 'pending', 'Only an unexpired pending submission can be reviewed.');
    if (action === 'approve') {
      const author = getById(s, 'members', row.memberId);
      requireValue(author?.verified && author.status === 'active', 'The author must be active and verified before publishing.');
      if (collection === 'seeking') requireValue(author.identity === 'Student', 'Seeking posts must belong to students.');
      if (collection === 'hiring' && !row.departmentId) requireValue(['Alumni', 'Faculty'].includes(author.identity), 'Hiring posts require an eligible alumni or faculty author.');
      if (row.departmentId) {
        const department = getById(s, 'departments', row.departmentId);
        requireValue(department?.status === 'active' && (department.ownerId === author.id || department.assignments[author.id] === 'primary'), 'The posting account no longer has department publishing access.');
      }
    }
    if (action === 'close') requireValue(collection === 'hiring' && status === 'published', 'Only published hiring posts can be closed.');
    if (action === 'remove') requireValue(['published', 'active', 'paused'].includes(status), 'This listing cannot be removed in its current state.');
    if (action === 'approve') row.approvedAt = timestamp;
    decide(({ approve: collection === 'hiring' ? 'published' : 'active', reject: 'rejected', changes: 'changes_requested', close: 'closed', remove: 'removed' })[action]);
  } else throw new Error('Unsupported collection.');

  row.revision += 1;
  s.revision += 1;
  s.audit.unshift({
    id: `audit-${s.revision}`, actorId: actor.id, actorName: actor.name, actorRole: actor.role,
    collection, entityId: row.id, action, reason: reason.trim(), at: timestamp, revision: row.revision,
    subject: row.name || row.title || getById(s, 'members', row.memberId)?.name || row.id,
    before: before ? { status: before.status, revision: before.revision, ownerId: before.ownerId || null } : null,
    after: { status: row.status, revision: row.revision, ownerId: row.ownerId || null },
    changes: collection === 'departments' && action === 'access' ? { memberId: values.memberId, permission: values.permission } : undefined,
    changedFields: action === 'edit' && before ? Object.keys(values).filter(key => !['id', 'revision'].includes(key) && Object.hasOwn(row, key) && JSON.stringify(before[key]) !== JSON.stringify(row[key])) : undefined,
  });
  return s;
}

export function queueItems(state, now = Date.now()) {
  const urgent = ['requests', 'moderation'].flatMap(collection => (state[collection] || []).filter(r => collection === 'requests' ? r.status === 'open' : r.status !== 'resolved').map(r => ({ ...r, collection, href: collection === 'requests' ? `/emergency/requests/${r.id}` : `/moderation/${r.id}`, urgencyRank: r.urgency === 'Critical' ? 0 : r.severity === 'high' ? 1 : 2 }))).sort((a, b) => a.urgencyRank - b.urgencyRank || Date.parse(a.submittedAt) - Date.parse(b.submittedAt));
  return urgent.concat(['verification', 'claims', 'hiring', 'seeking'].flatMap(collection => state[collection]
    .filter(r => effectiveStatus(r, collection, now) === 'pending')
    .map(r => ({ ...r, collection, title: r.title || getById(state, 'members', r.memberId)?.name || r.id,
      href: collection === 'claims' ? `/departments/claims/${r.id}` : ['hiring', 'seeking'].includes(collection) ? `/jobs/${collection}/${r.id}` : `/verification/${r.id}`,
    }))).sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt)));
}

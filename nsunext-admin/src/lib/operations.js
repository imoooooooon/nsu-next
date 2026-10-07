const assert = (value, message) => { if (!value) throw new Error(message); };
const text = value => String(value || '').trim();
const url = value => { try { return ['http:', 'https:'].includes(new URL(value, 'https://ugrads.local').protocol) && !String(value).startsWith('//'); } catch { return false; } };
export const eventStatus = (r, now = Date.now()) => r.status !== 'published' ? r.status : Date.parse(`${r.endDate || r.date}T23:59:59+06:00`) < now ? 'past' : Date.parse(`${r.date}T00:00:00+06:00`) <= now ? 'live' : 'scheduled';
export const campaignStatus = (r, now = Date.now()) => r.status !== 'published' ? r.status : Date.parse(r.endsAt) <= now ? 'ended' : Date.parse(r.startsAt) > now ? 'scheduled' : 'active';
export const evidenceAvailable = (r, now = Date.now()) => r.evidenceState === 'available' && (r.contentType !== 'moment' || Date.parse(r.expiresAt) > now);
export const OPERATIONS = ['events', 'moderation', 'requests', 'donors', 'campaigns', 'settings', 'admins'];
export function validateEvent(v) {
  assert(text(v.title) && text(v.venue) && text(v.description), 'Title, description and venue are required.');
  const start = Date.parse(`${v.date}T00:00:00+06:00`), end = Date.parse(`${v.endDate}T00:00:00+06:00`);
  assert(Number.isFinite(start) && Number.isFinite(end) && end >= start && end - start <= 30 * 86400000, 'Choose valid dates spanning at most 31 days.');
  assert(v.organizer?.name && ['Club', 'Department', 'University Office', 'External Partner', 'Individual'].includes(v.organizer.type), 'Add a named organizer with a valid type.');
  assert((v.coOrganizers || []).every(o => text(o.name) && ['Club', 'Department', 'University Office', 'External Partner', 'Individual'].includes(o.type)), 'Every co-organizer needs a name and valid type.');
  assert(!v.registrationDeadline || Number.isFinite(Date.parse(v.registrationDeadline)) && Date.parse(v.registrationDeadline) <= end + 86400000, 'Registration deadline must be valid and no later than the event end.');
  assert(Number.isInteger(Number(v.capacity)) && Number(v.capacity) >= 0, 'Capacity must be a non-negative whole number.');
  assert(Array.isArray(v.schedule) && v.schedule.every(s => text(s.title) && text(s.time) && (!s.date || s.date >= v.date && s.date <= v.endDate)), 'Each activity needs a time and title, with its date inside the event range.');
  assert(!v.image || /^https?:\/\//.test(v.image) && url(v.image), 'Use an http or https image URL.');
}
export function validateCampaign(v, publish = false) {
  assert(text(v.title), 'Campaign title is required.');
  assert(v.placement === 'home' && ['all', 'student', 'alumni', 'faculty', 'staff'].includes(v.audience), 'Choose a supported audience and placement.');
  assert(Number.isInteger(Number(v.priority)) && Number(v.priority) >= 0, 'Priority must be a non-negative whole number.');
  if (publish) {
    assert(text(v.alt) && /^https?:\/\//.test(v.image) && url(v.image), 'Publishing requires an image URL and descriptive alt text.');
    assert(text(v.destination) && url(v.destination), 'Use a valid http, https or site-relative destination.');
    assert(Number.isFinite(Date.parse(v.startsAt)) && Date.parse(v.endsAt) > Date.parse(v.startsAt), 'End time must be after the start time.');
  }
}

// Invoked inside the same atomic, revision-checked transaction as core operations.
export function operate(s, actor, command, row, now) {
  const { collection, action, values: v = {}, reason = '' } = command;
  const at = new Date(now).toISOString();
  const decide = status => Object.assign(row, { status, decidedAt: at, reason: reason.trim(), reviewerName: actor.name });
  if (action === 'create') { row = { id: command.id, revision: 0, createdAt: at }; assert(row.id && !s[collection].some(r => r.id === row.id), 'Choose a unique record identifier.'); }
  if (collection === 'events') {
    if (['edit', 'create'].includes(action)) {
      const next = { ...row, ...v }; validateEvent(next);
      assert(!next.departmentId || s.departments.some(d => d.id === next.departmentId && d.status === 'active'), 'Choose an active department.');
      const keys = ['title', 'description', 'category', 'date', 'endDate', 'time', 'endTime', 'venue', 'venueDetails', 'capacity', 'image', 'organizer', 'coOrganizers', 'schedule', 'registrationDeadline', 'registrationInfo', 'departmentId'];
      for (const k of keys) if (Object.hasOwn(v, k)) row[k] = v[k];
      row.shortDescription = row.description; row.deptId = row.departmentId; row.capacity = Number(row.capacity);
      if (action === 'create') Object.assign(row, { status: 'published', postedBy: { name: actor.name, role: 'Platform administration' }, registrations: [], goingCount: 0, interestedCount: 0, registrationOverride: 'open', tags: [row.category] });
    } else {
      assert(row.status === 'published', 'Only published events can be changed.');
      assert(['feature', 'unfeature', 'cancel', 'remove', 'registration'].includes(action), 'Unsupported event action.');
      if (action === 'feature' || action === 'unfeature') row.featured = action === 'feature';
      else if (action === 'registration') { assert(['open', 'closed'].includes(v.registrationOverride), 'Choose a registration state.'); row.registrationOverride = v.registrationOverride; }
      else { decide(action === 'cancel' ? 'cancelled' : 'removed'); row.featured = false; }
    }
  } else if (collection === 'moderation') {
    assert(['assign', 'start', 'dismiss', 'remove', 'escalate', 'resolve', 'reopen', 'note'].includes(action), 'Unsupported case action.');
    if (action === 'reopen') { assert(row.status === 'resolved', 'Only resolved cases can reopen.'); decide('in_review'); }
    else {
      assert(row.status !== 'resolved', 'Reopen this case before making changes.');
      if (action === 'assign') { assert(s.admins.some(a => a.id === v.assigneeId && a.active && ['owner', 'operations', 'moderator'].includes(a.role)), 'Choose an active reviewer.'); row.assigneeId = v.assigneeId; }
      if (action === 'start') { assert(row.status === 'open' || row.status === 'escalated', 'This case is already in review.'); decide('in_review'); row.assigneeId ||= actor.id; }
      if (action === 'note') row.notes.push({ text: reason, actorName: actor.name, at });
      if (action === 'escalate') { decide('escalated'); row.assigneeId = s.admins.find(a => a.active && a.role === 'owner')?.id || ''; }
      if (['dismiss', 'resolve'].includes(action)) { decide('resolved'); row.outcome = action === 'dismiss' ? 'dismissed' : 'resolved'; }
      if (action === 'remove') {
        assert(row.contentType !== 'profile', 'Escalate account restrictions to Operations.');
        assert(!row.contentRemoved && !s.restrictions.some(r => r.type === row.contentType && r.entityId === row.contentId), 'This content has already been removed.');
        assert(evidenceAvailable(row, now), 'Available submitted evidence is required for content removal.');
        row.contentRemoved = true;
        s.restrictions.push({ type: row.contentType, entityId: row.contentId, caseId: row.id, at });
        const targetCollection = ({ event: 'events', hiring: 'hiring', seeking: 'seeking', request: 'requests' })[row.contentType];
        const target = s[targetCollection]?.find(r => r.id === row.contentId);
        if (target) { target.status = 'removed'; target.revision += 1; }
      }
    }
  } else if (collection === 'requests') {
    if (action === 'edit') {
      assert(text(v.hospital) && text(v.location) && /^[+\d ()-]{7,20}$/.test(v.contact || ''), 'Hospital, location and a valid contact number are required.');
      assert(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].includes(v.bg) && Number(v.units) > 0 && Number.isInteger(Number(v.units)), 'Choose a blood group and positive whole number of units.');
      for (const k of ['hospital', 'location', 'contact', 'bg', 'units', 'urgency', 'description', 'patientName']) if (Object.hasOwn(v, k)) row[k] = v[k];
      row.title = `${row.bg} · ${row.hospital}`;
    } else {
      assert(['resolve', 'reopen', 'remove'].includes(action), 'Unsupported request action.');
      assert(action === 'reopen' ? row.status === 'resolved' && Date.parse(row.expiresAt) > now : row.status === 'open', 'This request is no longer eligible for that action.');
      decide(({ resolve: 'resolved', reopen: 'open', remove: 'removed' })[action]);
    }
  } else if (collection === 'donors') {
    assert(['remove', 'reinstate'].includes(action) && row.status === (action === 'remove' ? 'listed' : 'removed'), 'This entry is no longer eligible for that action.');
    decide(action === 'remove' ? 'removed' : 'listed'); // Never change donor-supplied availability.
  } else if (collection === 'campaigns') {
    if (['create', 'edit'].includes(action)) {
      const next = { ...row, ...v }; validateCampaign(next, row.status === 'published');
      for (const k of ['title', 'copy', 'alt', 'image', 'destination', 'audience', 'startsAt', 'endsAt', 'priority', 'placement', 'internalNotes']) if (Object.hasOwn(v, k)) row[k] = v[k];
      if (action === 'create') row.status = 'draft';
    } else {
      assert(['publish', 'pause', 'resume', 'archive'].includes(action), 'Unsupported campaign action.');
      assert(action === 'publish' ? row.status === 'draft' : action === 'pause' ? row.status === 'published' : action === 'resume' ? row.status === 'paused' : row.status !== 'archived', 'Campaign status has already changed.');
      if (['publish', 'resume'].includes(action)) { validateCampaign(row, true); assert(Date.parse(row.endsAt) > now, 'Update the ended schedule before publishing.'); }
      decide(action === 'pause' ? 'paused' : action === 'archive' ? 'archived' : 'published');
    }
  } else if (collection === 'settings') {
    assert(action === 'edit' && text(v.name) && text(v.institution) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.supportEmail || ''), 'Name, institution and a valid support email are required.');
    Object.assign(row, { name: text(v.name), institution: text(v.institution), supportEmail: text(v.supportEmail) });
  } else if (collection === 'admins') {
    assert(actor.role === 'owner', 'Only a Platform Owner can manage platform access.');
    if (action === 'create') {
      assert(text(v.name) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || '') && ['owner', 'operations', 'moderator', 'analyst'].includes(v.role), 'Name, email and a valid role are required.');
      assert(!s.admins.some(a => a.email?.toLowerCase() === v.email.toLowerCase()), 'An invitation or account already uses this email.');
      Object.assign(row, { name: text(v.name), email: text(v.email), role: v.role, status: 'invited', active: false, memberId: null });
    } else {
      assert(['role', 'revoke', 'activate'].includes(action), 'Unsupported team action.');
      assert(row.id !== actor.id || action === 'role' && v.role === row.role, 'You cannot revoke or change your own platform role.');
      const losingOwner = row.active && row.role === 'owner' && (action === 'revoke' || action === 'role' && v.role !== 'owner');
      assert(!losingOwner || s.admins.filter(a => a.active && a.role === 'owner').length > 1, 'The last active Platform Owner must be retained.');
      if (action === 'role') { assert(['owner', 'operations', 'moderator', 'analyst'].includes(v.role), 'Choose a valid role.'); row.role = v.role; }
      else { assert(row.active !== (action === 'activate'), 'Access state has already changed.'); assert(action !== 'activate' || !s.members.some(m => m.id === row.memberId && m.status === 'suspended'), 'Reactivate the linked member before granting access.'); row.active = action === 'activate'; row.status = row.active ? 'active' : 'revoked'; }
    }
  }
  if (action === 'create') s[collection].push(row);
  return row;
}

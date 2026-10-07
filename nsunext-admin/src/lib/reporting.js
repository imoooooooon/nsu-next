import { campaignStatus, eventStatus } from './operations.js';

export function metrics(state, { from, to, department = '' }, now = Date.now()) {
  const start = from ? Date.parse(`${from}T00:00:00+06:00`) : 0;
  const end = to ? Date.parse(`${to}T23:59:59+06:00`) : now;
  const inPeriod = value => Date.parse(value) >= start && Date.parse(value) <= end;
  const matches = r => !department || r.departmentId === department || state.departments.find(d => d.id === department)?.code === state.members.find(m => m.id === (r.memberId || r.id))?.department;
  const scoped = key => state[key].filter(matches);
  const reviewed = ['verification', 'claims', 'hiring', 'seeking'].flatMap(scoped).filter(r => inPeriod(r.decidedAt));
  const durations = reviewed.map(r => (Date.parse(r.decidedAt) - Date.parse(r.submittedAt)) / 3600000).filter(n => Number.isFinite(n) && n >= 0).sort((a, b) => a - b);
  const middle = Math.floor(durations.length / 2);
  const median = !durations.length ? null : durations.length % 2 ? durations[middle] : (durations[middle - 1] + durations[middle]) / 2;
  return [
    ['New members', scoped('members').filter(r => inPeriod(r.joinedAt)).length, 'Joined during the selected period'],
    ['Verification approvals', scoped('verification').filter(r => r.status === 'approved' && inPeriod(r.decidedAt)).length, 'Approved decisions in the selected period'],
    ['Owned departments', state.departments.filter(r => (!department || r.id === department) && r.ownerId).length, 'Current snapshot; not a historical total'],
    ['Career approvals', ['hiring', 'seeking'].flatMap(scoped).filter(r => r.decidedAt && inPeriod(r.decidedAt) && ['active', 'published'].includes(r.status)).length, 'Currently approved posts decided in period'],
    ['Median review hours', median === null ? 'Unavailable' : Math.round(median * 10) / 10, 'Median submission-to-decision hours for decisions in period'],
    ['Events in period', scoped('events').filter(r => inPeriod(`${r.date}T00:00:00+06:00`) && !['removed', 'cancelled'].includes(eventStatus(r, now))).length, 'Events starting in period, excluding cancellation/removal'],
    ['Recorded registrations', scoped('events').reduce((sum, r) => sum + (r.registrations || []).filter(x => inPeriod(x.at)).length, 0), 'Registration records in period; not attendance'],
    ['Cases resolved', scoped('moderation').filter(r => r.status === 'resolved' && inPeriod(r.decidedAt)).length, 'Currently resolved cases decided in period'],
    ['Blood requests resolved', scoped('requests').filter(r => r.status === 'resolved' && inPeriod(r.decidedAt)).length, 'Recorded resolutions in period; not donations'],
    ['Active campaigns', department ? 'Not department-scoped' : state.campaigns.filter(r => campaignStatus(r, now) === 'active').length, 'Current eligible schedule; no impression or click data'],
  ].map(([name, value, definition]) => ({ name, value, definition }));
}
export const csvCell = value => `"${String(value).replace(/^[\s]*[=+@-]/, match => `'${match}`).replaceAll('"', '""')}"`;
export function aggregateCSV(rows, filters) {
  return [['Metric', 'Value', 'Definition', 'From', 'To', 'Department', 'Timezone'], ...rows.map(r => [r.name, r.value, r.definition, filters.from, filters.to, filters.department || 'All', 'Asia/Dhaka'])].map(row => row.map(csvCell).join(',')).join('\r\n');
}
export const auditVisible = (entry, actor, state) => actor.role === 'owner' || actor.role === 'operations' && !['admins'].includes(entry.collection) || actor.role === 'moderator' && entry.collection === 'moderation' && (entry.actorId === actor.id || state.moderation.find(c => c.id === entry.entityId)?.assigneeId === actor.id);
export const entityPath = e => ({ claims: `/departments/claims/${e.entityId}`, hiring: `/jobs/hiring/${e.entityId}`, seeking: `/jobs/seeking/${e.entityId}`, requests: `/emergency/requests/${e.entityId}`, donors: `/emergency/donors/${e.entityId}`, admins: '/settings/team', settings: '/settings/general' })[e.collection] || `/${e.collection}/${e.entityId}`;

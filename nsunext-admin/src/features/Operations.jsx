import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowUpRight, CalendarDays, ShieldCheck, HeartPulse, Megaphone } from 'lucide-react';
import { useAdmin } from '../app/context';
import { campaignStatus, eventStatus, evidenceAvailable } from '../lib/operations';
import { Badge, BackLink, Button, ButtonLink, DateText, DecisionDialog, Descriptions, Empty, History, Note, PageHeader, Panel, Register } from '../components/ui';
import EditDialog from '../components/ui/EditDialog';

const groups = {
  events: { title: 'Events', singular: 'Event', path: '/events', description: 'One campus calendar. Clear organizers, publication and registration controls.', icon: CalendarDays, statuses: ['scheduled', 'live', 'past', 'cancelled', 'removed'] },
  moderation: { title: 'Moderation', singular: 'Case', path: '/moderation', description: 'Review submitted evidence, take a proportionate action and record the outcome.', icon: ShieldCheck, statuses: ['open', 'in_review', 'escalated', 'resolved'] },
  requests: { title: 'Blood requests', singular: 'Request', path: '/emergency/requests', description: 'Prioritize urgent requests and keep public availability accurate.', icon: HeartPulse, statuses: ['open', 'resolved', 'removed'] },
  donors: { title: 'Donor directory', singular: 'Donor', path: '/emergency/donors', description: 'Manage listing integrity while respecting donor-supplied availability.', icon: HeartPulse, statuses: ['listed', 'removed'] },
  campaigns: { title: 'Campaigns', singular: 'Campaign', path: '/campaigns', description: 'Manage the promotions people see in the Home carousel.', icon: Megaphone, statuses: ['draft', 'scheduled', 'active', 'paused', 'ended', 'archived'] },
};
const operationalStatus = (kind, row) => kind === 'events' ? eventStatus(row) : kind === 'campaigns' ? campaignStatus(row) : row.status;
const titleOf = r => r.title || r.name || r.id;
const eventFields = [
  { key: 'title', label: 'Event title', required: true }, { key: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 5000 },
  { key: 'category', label: 'Category', options: ['Academic', 'Workshop', 'Competition', 'Career', 'Recruitment', 'Networking', 'Research', 'Cultural', 'Sports', 'Volunteer', 'Other'], required: true },
  { key: 'organizerName', label: 'Lead organizer', required: true }, { key: 'organizerType', label: 'Organizer type', options: ['Club', 'Department', 'University Office', 'External Partner', 'Individual'], required: true },
  { key: 'coOrganizerLines', label: 'Co-organizers', type: 'textarea', hint: 'One per line: Type | Name. Types match the lead organizer options.' },
  { key: 'date', label: 'Start date · Dhaka', type: 'date', required: true }, { key: 'endDate', label: 'End date · Dhaka', type: 'date', required: true },
  { key: 'time', label: 'Start time', required: true }, { key: 'endTime', label: 'End time' },
  { key: 'scheduleLines', label: 'Daily activities', type: 'textarea', hint: 'One per line: YYYY-MM-DD | time | activity. Changing dates requires reviewing every activity.' },
  { key: 'venue', label: 'Venue', required: true }, { key: 'venueDetails', label: 'Venue details' }, { key: 'capacity', label: 'Capacity (0 = unspecified)', type: 'number', required: true },
  { key: 'registrationDeadline', label: 'Registration deadline · Dhaka', type: 'datetime-local' }, { key: 'registrationInfo', label: 'Registration instructions', type: 'textarea' }, { key: 'image', label: 'Cover image URL', type: 'url' },
];
const campaignFields = [
  { key: 'title', label: 'Campaign title', required: true }, { key: 'copy', label: 'Supporting copy', type: 'textarea', maxLength: 240 }, { key: 'image', label: 'Creative image URL', type: 'url', hint: 'Use a hosted image cropped to 3:1. Check the preview before publishing.' }, { key: 'alt', label: 'Image alternative text' },
  { key: 'destination', label: 'Destination', hint: 'An https URL or a path such as /webapp/jobs.' }, { key: 'audience', label: 'Audience', options: ['all', 'student', 'alumni', 'faculty', 'staff'], required: true },
  { key: 'startsAt', label: 'Starts · Dhaka', type: 'datetime-local', required: true }, { key: 'endsAt', label: 'Ends · Dhaka', type: 'datetime-local', required: true }, { key: 'priority', label: 'Priority (lower appears first)', type: 'number', required: true }, { key: 'internalNotes', label: 'Internal notes', type: 'textarea' },
];
const requestFields = [
  { key: 'hospital', label: 'Hospital', required: true }, { key: 'location', label: 'Location', required: true }, { key: 'bg', label: 'Blood group', options: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'], required: true },
  { key: 'units', label: 'Units', type: 'number', required: true }, { key: 'urgency', label: 'Urgency', options: ['Critical', 'Needed Today', 'Scheduled'], required: true }, { key: 'patientName', label: 'Patient name' }, { key: 'contact', label: 'Request contact', required: true }, { key: 'description', label: 'Request context', type: 'textarea' },
];
const dhakaInput = value => value ? new Date(Date.parse(value) + 6 * 3600000).toISOString().slice(0, 16) : '';
const toISO = value => value ? new Date(`${value}:00+06:00`).toISOString() : '';

function Editor({ kind, row, onClose, onSaved }) {
  const { data, commit } = useAdmin();
  const [openedAt] = useState(Date.now);
  const isNew = !row;
  const [id] = useState(() => row?.id || `${kind}-${crypto.randomUUID()}`);
  let initial, fields;
  if (kind === 'events') {
    initial = { category: 'Academic', capacity: 0, departmentId: '', ...row, organizerName: row?.organizer?.name || '', organizerType: row?.organizer?.type || 'Department', coOrganizerLines: row?.coOrganizers?.map(o => `${o.type} | ${o.name}`).join('\n') || '', scheduleLines: row?.schedule?.map(s => `${s.date || row.date} | ${s.time} | ${s.title}`).join('\n') || '', registrationDeadline: dhakaInput(row?.registrationDeadline) };
    fields = [...eventFields, { key: 'departmentId', label: 'Associated department', options: [{ value: 'none', label: 'Campus-wide' }, ...data.departments.filter(d => d.status === 'active').map(d => ({ value: d.id, label: d.name }))] }];
  } else if (kind === 'campaigns') { initial = { placement: 'home', audience: 'all', priority: 1, ...row, startsAt: dhakaInput(row?.startsAt || new Date(openedAt).toISOString()), endsAt: dhakaInput(row?.endsAt || new Date(openedAt + 30 * 86400000).toISOString()) }; fields = campaignFields; }
  else { initial = row; fields = requestFields; }
  return <EditDialog title={`${isNew ? 'Create' : 'Edit'} ${groups[kind].singular.toLowerCase()}`} initial={initial} fields={fields} onClose={onClose} onSave={async values => {
    let v = { ...values };
    if (kind === 'events') {
      const parse = (input, size) => (input || '').split('\n').filter(l => l.trim()).map(l => { const parts = l.split('|').map(p => p.trim()); if (parts.length !== size) throw new Error(`Each line needs ${size} fields separated by |.`); return parts; });
      v = { ...v, departmentId: v.departmentId === 'none' ? '' : v.departmentId, organizer: { ...row?.organizer, name: v.organizerName, type: v.organizerType }, coOrganizers: parse(v.coOrganizerLines, 2).map(([type, name]) => ({ type, name })), schedule: parse(v.scheduleLines, 3).map(([date, time, title]) => ({ date, time, title })), registrationDeadline: toISO(v.registrationDeadline) };
    }
    if (kind === 'campaigns') v = { ...v, startsAt: toISO(v.startsAt), endsAt: toISO(v.endsAt) };
    await commit({ collection: kind, id, revision: row?.revision, action: isNew ? 'create' : 'edit', values: v }); onSaved?.(id);
  }} />;
}

export function OperationList({ kind }) {
  const { data } = useAdmin(); const g = groups[kind];
  const rows = data[kind].map(r => ({ ...r, displayStatus: operationalStatus(kind, r), title: titleOf(r) }));
  const columns = [{ key: 'title', label: g.singular, sortable: true, render: (r, from) => <Link className="record-link" to={`${g.path}/${r.id}`} state={from}><strong>{r.title}</strong><small className="muted">{kind === 'events' ? `Organized by ${r.organizer.name}` : kind === 'moderation' ? `${r.contentType} · ${r.category}` : kind === 'campaigns' ? 'Home carousel · 3:1' : r.location}</small></Link> }];
  if (kind === 'events') columns.push({ key: 'date', label: 'Dates', sortable: true, render: r => <><DateText value={r.date} /> – <DateText value={r.endDate} /></> }, { key: 'postedBy', label: 'Posted by', render: r => r.postedBy?.name }, { key: 'featured', label: 'Featured', render: r => r.featured ? 'Yes' : 'No' });
  if (kind === 'moderation') columns.push({ key: 'severity', label: 'Severity', sortable: true, render: r => <Badge status={r.severity === 'high' ? 'rejected' : 'neutral'}>{r.severity}</Badge> }, { key: 'assigneeId', label: 'Assignee', render: r => data.admins.find(a => a.id === r.assigneeId)?.name || 'Unassigned' });
  if (['requests', 'donors'].includes(kind)) columns.push({ key: 'bg', label: 'Blood group', sortable: true }, kind === 'requests' ? { key: 'urgency', label: 'Urgency', sortable: true } : { key: 'available', label: 'Donor availability', render: r => r.available ? 'Available' : 'Unavailable' });
  if (kind === 'campaigns') columns.push({ key: 'audience', label: 'Audience', sortable: true }, { key: 'startsAt', label: 'Starts', sortable: true, render: r => <DateText value={r.startsAt} full /> }, { key: 'priority', label: 'Priority', sortable: true });
  columns.push({ key: 'displayStatus', label: 'Status', sortable: true, render: r => <Badge status={r.displayStatus} /> });
  return <><PageHeader title={g.title} description={g.description} actions={['events', 'campaigns'].includes(kind) && <ButtonLink variant="primary" to={`${g.path}/new`}><Plus size={16} />Create {g.singular.toLowerCase()}</ButtonLink>} />
    {['requests', 'donors'].includes(kind) && <nav className="tabs"><Link to="/emergency/requests">Requests</Link><Link to="/emergency/donors">Donors</Link></nav>}
    <div className="module-summary"><g.icon size={20} /><strong>{rows.filter(r => kind === 'moderation' ? r.status !== 'resolved' : ['open', 'active', 'scheduled', 'listed'].includes(r.displayStatus)).length}</strong><span>{kind === 'moderation' ? 'cases awaiting an outcome' : 'currently available or upcoming'}</span><span className="muted">{rows.length} total records</span></div>
    <Panel><Register rows={rows} columns={columns} noun={g.title.toLowerCase()} searchLabel={`Search ${g.title.toLowerCase()}`} searchText={r => `${r.title} ${r.id} ${r.contentType || ''} ${r.hospital || ''} ${r.location || ''}`} defaultSort={kind === 'requests' ? 'urgency' : kind === 'events' ? 'date' : '-submittedAt'} filters={[{ key: 'status', label: 'Statuses', value: r => r.displayStatus, options: g.statuses }, ...(kind === 'moderation' ? [{ key: 'severity', label: 'Severities', options: ['high', 'normal'] }, { key: 'contentType', label: 'Content types', options: ['profile', 'hiring', 'seeking', 'event', 'note', 'moment', 'message', 'broadcast'] }, { key: 'assigneeId', label: 'Reviewers', options: data.admins.filter(a => a.active).map(a => ({ value: a.id, label: a.name })) }] : []), ...(kind === 'donors' ? [{ key: 'bg', label: 'Blood groups', options: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'] }] : [])]} /></Panel>
  </>;
}
export function OperationCreate({ kind }) { const navigate = useNavigate(); const savedId = useRef(null); return <><PageHeader title={`Create ${groups[kind].singular.toLowerCase()}`} /><Editor kind={kind} onClose={() => navigate(savedId.current ? `${groups[kind].path}/${savedId.current}` : groups[kind].path)} onSaved={id => { savedId.current = id; }} /></>; }

export function OperationDetail({ kind }) {
  const { id } = useParams(); const { data, actor, commit, now } = useAdmin(); const [dialog, setDialog] = useState(null); const g = groups[kind];
  const row = data[kind].find(r => r.id === id);
  if (!row) return <Empty level={1} title={`${g.singular} unavailable`} description="This record may have been removed or the link is out of date." action={<ButtonLink to={g.path}>Back to register</ButtonLink>} />;
  const actions = [];
  const add = (action, text, destructive = false, fields) => actions.push({ action, text, destructive, fields });
  if (kind === 'events' && row.status === 'published') { add('edit', 'Edit event'); add(row.featured ? 'unfeature' : 'feature', row.featured ? 'Unfeature' : 'Feature'); add('registration', 'Registration', false, [{ key: 'registrationOverride', label: 'Registration state', options: ['open', 'closed'], required: true }]); add('cancel', 'Cancel event', true); add('remove', 'Remove event', true); }
  if (kind === 'moderation') {
    if (row.status === 'resolved') add('reopen', 'Reopen case');
    else { add('assign', 'Assign reviewer', false, [{ key: 'assigneeId', label: 'Reviewer', options: data.admins.filter(a => a.active && a.role !== 'analyst').map(a => ({ value: a.id, label: a.name })), required: true }]); if (['open', 'escalated'].includes(row.status)) add('start', 'Start review'); add('note', 'Add internal note'); if (!row.contentRemoved && evidenceAvailable(row) && row.contentType !== 'profile') add('remove', 'Remove content', true); add('escalate', 'Escalate restriction'); add('dismiss', 'Dismiss report'); add('resolve', 'Resolve case'); }
  }
  if (kind === 'requests' && row.status !== 'removed') { add('edit', 'Correct request'); if (row.status === 'open') { add('resolve', 'Mark resolved'); add('remove', 'Remove request', true); } else if (Date.parse(row.expiresAt) > now) add('reopen', 'Reopen request'); }
  if (kind === 'donors') add(row.status === 'listed' ? 'remove' : 'reinstate', row.status === 'listed' ? 'Remove listing' : 'Reinstate listing', row.status === 'listed');
  if (kind === 'campaigns' && row.status !== 'archived') { add('edit', 'Edit campaign'); if (row.status === 'draft') add('publish', 'Publish / schedule'); if (row.status === 'published') add('pause', 'Pause campaign'); if (row.status === 'paused') add('resume', 'Resume campaign'); add('archive', 'Archive campaign', true); }
  return <><BackLink to={g.path}>All {g.title.toLowerCase()}</BackLink><PageHeader eyebrow={`${g.singular} · ${row.id}`} title={titleOf(row)} description={kind === 'events' ? `Posted by ${row.postedBy?.name} · Organized by ${row.organizer.name}` : undefined} actions={<Badge status={operationalStatus(kind, row)} />} />
    <div className="actions operation-actions">{actions.map(a => <Button key={a.action} variant={a.destructive ? 'danger-ghost' : a.action === 'edit' ? 'primary' : 'secondary'} onClick={() => setDialog({ ...a, revision: row.revision, row })}>{a.text}</Button>)}</div>
    <div className="detail-grid"><div className="detail-main">
      {kind === 'events' && <><Panel title="Details & schedule"><div className="panel-body"><p>{row.description}</p><Descriptions items={[["Organizers", [row.organizer, ...(row.coOrganizers || [])].map(o => `${o.name} (${o.type})`).join(', ')], ['Dates · Dhaka', `${row.date} – ${row.endDate}`], ['Time', `${row.time || ''} – ${row.endTime || ''}`], ['Venue', `${row.venue} · ${row.venueDetails || ''}`], ['Capacity', row.capacity || 'Unspecified'], ['Registration', row.registrationOverride === 'closed' || Date.parse(row.registrationDeadline) < now || eventStatus(row) === 'past' || row.status !== 'published' ? 'Closed' : 'Open'], ['Deadline', <DateText value={row.registrationDeadline} full />], ['Department', data.departments.find(d => d.id === row.departmentId)?.name || 'Campus-wide']]} />{row.schedule.length ? <ol className="schedule-list">{row.schedule.map((s, i) => <li key={i}><span>{s.date || row.date} · {s.time}</span><strong>{s.title}</strong></li>)}</ol> : <p className="muted">No daily activities provided.</p>}</div></Panel><Panel title="Participation" description="Recorded interest and registrations are not attendance."><Descriptions items={[["Registered", row.registrations?.length || 'No registration records'], ['Going', row.goingCount || 0], ['Interested', row.interestedCount || 0]]} /></Panel></>}
      {kind === 'moderation' && <><Note>Review only the evidence submitted with this report. Account restrictions require an Operations Admin or Platform Owner.</Note><Panel title="Submitted evidence" action={<Badge status={evidenceAvailable(row) ? 'active' : 'expired'}>{evidenceAvailable(row) ? 'Available' : row.evidenceState === 'available' ? 'Expired' : row.evidenceState}</Badge>}><div className="panel-body">{evidenceAvailable(row) ? <blockquote className="evidence-excerpt">{row.evidence}</blockquote> : <Empty title="Evidence unavailable" description="Missing, deleted or expired media cannot be recovered through this workspace. You can still record a review outcome." />}{row.contentRemoved && <Note tone="warning">The reported content is restricted. Resolve the case separately after recording your outcome.</Note>}</div></Panel><Panel title="Case context"><Descriptions items={[["Content reference", `${row.contentType} / ${row.contentId}`], ['Reporter', data.members.find(m => m.id === row.reporterId)?.name || row.reporterId], ['Reported account', data.members.find(m => m.id === row.memberId)?.name || row.memberId], ['Reason category', row.category], ['Severity', row.severity], ['Assignee', data.admins.find(a => a.id === row.assigneeId)?.name || 'Unassigned']]} />{actor.role !== 'moderator' && <div className="panel-body"><ButtonLink to={`/members/${row.memberId}`}>Review member access<ArrowUpRight size={14} /></ButtonLink></div>}</Panel><Panel title="Internal notes"><div className="panel-body">{row.notes.length ? row.notes.map((n, i) => <blockquote key={i}><p>{n.text}</p><small>{n.actorName} · <DateText value={n.at} full /></small></blockquote>) : <p className="muted">No notes yet.</p>}</div></Panel><Panel title="Related cases"><div className="panel-body">{data.moderation.filter(r => r.id !== row.id && r.memberId === row.memberId).map(r => <p key={r.id}><Link to={`/moderation/${r.id}`}>{r.title}</Link></p>)}{!data.moderation.some(r => r.id !== row.id && r.memberId === row.memberId) && <p className="muted">No related reports.</p>}</div></Panel></>}
      {kind === 'requests' && <Panel title="Request context"><div className="panel-body"><p>{row.description}</p><Descriptions items={[["Hospital", row.hospital], ['Location', row.location], ['Blood group / units', `${row.bg} · ${row.units} units`], ['Urgency', row.urgency], ['Patient', row.patientName], ['Request owner', data.members.find(m => m.id === row.memberId)?.name || row.memberId], ['Contact', <a href={`tel:${row.contact}`}>{row.contact}</a>], ['Valid until', <DateText value={row.expiresAt} full />]]} /></div></Panel>}
      {kind === 'donors' && <><Note>Listing status is separate from donor availability. Ugrads does not determine clinical eligibility.</Note><Panel title="Donor entry"><Descriptions items={[["Member", row.name], ['Blood group', row.bg], ['Location', row.location], ['Availability', row.available ? 'Available (donor supplied)' : 'Unavailable (donor supplied)'], ['Last donation', row.lastDonation || 'Not recorded'], ['Contact', <a href={`tel:${row.phone}`}>{row.phone}</a>]]} /></Panel></>}
      {kind === 'campaigns' && <><Panel title="Home carousel preview" description="3:1 creative slot · responsive desktop and mobile crop"><div className="panel-body"><CampaignPreview row={row} /><div className="campaign-mobile"><CampaignPreview row={row} /></div></div></Panel><Panel title="Placement & schedule"><Descriptions items={[["Placement", 'Home carousel'], ['Audience', row.audience], ['Priority', row.priority], ['Starts', <DateText value={row.startsAt} full />], ['Ends', <DateText value={row.endsAt} full />], ['Destination', row.destination], ['Internal notes', row.internalNotes]]} /></Panel><Note>Availability follows the schedule when the app is open. Impressions, clicks and background delivery are not collected.</Note></>}
    </div><aside className="detail-rail"><Panel title="Decision history"><History entries={data.audit.filter(e => e.collection === kind && e.entityId === id)} /></Panel>{row.reason && <Panel title="Latest decision"><div className="panel-body"><p>{row.reason}</p><small>{row.reviewerName} · <DateText value={row.decidedAt} full /></small></div></Panel>}</aside></div>
    {dialog?.action === 'edit' && <Editor kind={kind} row={dialog.row} onClose={() => setDialog(null)} />}
    {dialog?.fields && <EditDialog title={dialog.text} fields={[...dialog.fields, { key: 'reason', label: 'Decision reason', type: 'textarea', required: true }]} initial={dialog.row} onClose={() => setDialog(null)} onSave={v => commit({ collection: kind, id, revision: dialog.revision, action: dialog.action, values: v, reason: v.reason })} />}
    {dialog && dialog.action !== 'edit' && !dialog.fields && <DecisionDialog title={dialog.text} subject={titleOf(row)} destructive={dialog.destructive} onClose={() => setDialog(null)} onSubmit={({ reason }) => commit({ collection: kind, id, revision: dialog.revision, action: dialog.action, reason })} />}
  </>;
}
function CampaignPreview({ row }) { const [broken, setBroken] = useState(false); return <div className="campaign-preview">{row.image && !broken ? <img src={row.image} alt={row.alt} onError={() => setBroken(true)} /> : <span className="creative-unavailable">Creative unavailable · update the image URL</span>}<div><small>UGRADS · CAMPUS HIGHLIGHT</small><strong>{row.title}</strong><span>{row.copy}</span></div></div>; }

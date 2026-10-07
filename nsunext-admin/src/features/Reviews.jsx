import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, FileCheck2 } from 'lucide-react';
import { useAdmin } from '../app/context';
import { getById } from '../lib/model';
import { NotFound } from '../App';
import { BackLink, Badge, Button, DateText, DecisionDialog, Descriptions, History, Note, PageHeader, Panel, Person, Register } from '../components/ui';

function ReviewList({ kind }) {
  const { data } = useAdmin(); const claim = kind === 'claims';
  const rows = data[kind].map(r => ({ ...r, name: getById(data, 'members', r.memberId)?.name, identity: getById(data, 'members', r.memberId)?.identity, department: claim ? getById(data, 'departments', r.departmentId)?.code : getById(data, 'members', r.memberId)?.department }));
  const path = claim ? '/departments/claims' : '/verification';
  return <>{claim && <BackLink to="/departments">All departments</BackLink>}<PageHeader eyebrow="COMMUNITY / REVIEW" title={claim ? 'Ownership claims' : 'Verification'} description={claim ? 'Assign a trusted owner to each official department hub.' : 'Help the right people become part of your campus community.'} actions={<span className="count-chip">{rows.filter(r => r.status === 'pending').length} pending</span>} /><Panel><Register rows={rows} defaultStatus="pending" noun="requests" searchLabel="Search applicant or request ID…" searchText={r => `${r.name} ${r.id}`} filters={[{ key: 'status', label: 'Statuses', options: ['pending', 'needs_information', 'approved', 'rejected', ...(claim ? ['closed'] : [])] }, { key: 'department', label: 'Departments', options: [...new Set(rows.map(r => r.department))] }]} columns={[
    { key: 'name', label: 'Applicant', sortable: true, render: (r, state) => <Link state={state} to={`${path}/${r.id}`}><Person name={r.name} secondary={r.identity} /></Link> }, { key: 'department', label: 'Department', sortable: true },
    { key: claim ? 'id' : 'method', label: claim ? 'Request ID' : 'Evidence type', render: r => claim ? <span className="mono">{r.id}</span> : r.method },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: r => <DateText value={r.submittedAt} full /> }, { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
    { key: 'action', label: '', render: (r, state) => <Link state={state} className="text-link" to={`${path}/${r.id}`}>Review<ArrowUpRight size={14} /></Link> },
  ]} /></Panel></>;
}
export function VerificationList() { return <ReviewList kind="verification" />; }
export function ClaimList() { return <ReviewList kind="claims" />; }
function ReviewDetail({ kind }) {
  const { id } = useParams(); const { data, commit } = useAdmin(); const [decision, setDecision] = useState(null);
  const row = getById(data, kind, id); if (!row) return <NotFound />;
  const person = getById(data, 'members', row.memberId); const claim = kind === 'claims'; const dept = claim ? getById(data, 'departments', row.departmentId) : null;
  const title = claim ? 'Ownership request' : 'Identity review';
  const actions = [{ id: 'approve', title: claim ? 'Approve ownership' : 'Approve verification', variant: 'primary' }, { id: 'information', title: 'Request information' }, { id: 'reject', title: claim ? 'Reject claim' : 'Reject verification' }];
  const approvalBlocked = claim ? !!dept?.ownerId || dept?.status !== 'active' || !person?.verified || person.status !== 'active' : row.evidence !== 'available';
  return <><BackLink to={claim ? '/departments/claims' : '/verification'}>Back to {claim ? 'ownership claims' : 'verification'}</BackLink><PageHeader eyebrow={row.id.toUpperCase()} title={title} description={`${person.name} · ${claim ? dept.name : row.method}`} actions={<Badge status={row.status} />} />
    <div className="detail-grid"><div className="form-stack"><Panel title="Applicant"><div className="panel-body"><Link to={`/members/${person.id}`}><Person name={person.name} secondary={person.email} /></Link></div><Descriptions items={[[ 'Academic identity', person.identity ], ['Department', person.department], ['Account', <Badge status={person.status} />], ['Verification', person.verified ? 'Verified' : 'Not yet verified'], ['Submitted', <DateText value={row.submittedAt} full />]]} /></Panel>
    <Panel title={claim ? 'Request context' : 'Verification evidence'}>{claim ? <><div className="panel-body"><blockquote>{row.message}</blockquote></div><Descriptions items={[[ 'Department', <Link className="text-link" to={`/departments/${dept.id}`}>{dept.name}<ArrowUpRight size={14} /></Link> ], ['Current owner', dept.ownerId ? getById(data, 'members', dept.ownerId)?.name : 'Unowned'], ['Other pending claims', String(data.claims.filter(c => c.departmentId === dept.id && c.id !== id && c.status === 'pending').length)]]} /><div className="panel-body"><Note>Approval assigns one owner and closes competing claims. It does not grant platform administrator access.</Note></div></> : <div className="panel-body"><div className={`evidence-preview ${row.evidence === 'missing' ? 'unavailable' : ''}`}><FileCheck2 size={30} /><span className="eyebrow">{row.evidence === 'available' ? 'REVIEW FIXTURE · EVIDENCE SUMMARY' : 'EVIDENCE UNAVAILABLE'}</span><h3>{row.method}</h3><p>{row.summary}</p><span className="mono">{row.id} / {person.id}</span></div><p className="help-text">Evidence here is a synthetic review summary. No actual identity documents are stored in this prototype.</p></div>}</Panel>
    <Panel title="Review history"><History entries={data.audit.filter(a => a.collection === kind && a.entityId === id)} /></Panel></div>
    <aside><Panel title={row.status === 'pending' ? 'Make a decision' : 'Decision recorded'}><div className="panel-body form-stack">{row.status === 'pending' ? <><p className="muted">Check identity and supporting context before deciding. Every action is recorded.</p>{approvalBlocked && <Note tone="warning">{claim ? 'Ownership approval requires an active, unowned department and an active verified faculty applicant.' : 'Evidence is unavailable. Request information or reject this submission.'}</Note>}{actions.map(a => <Button key={a.id} variant={a.variant} disabled={a.id === 'approve' && approvalBlocked} onClick={() => setDecision({ ...a, revision: row.revision })}>{a.id === 'approve' && <Check size={16} />}{a.title}</Button>)}</> : <><Badge status={row.status} /><p>{row.reason || 'The decision has been saved.'}</p><small className="muted">{row.reviewerName || 'Previous review'} · <DateText value={row.decidedAt || row.submittedAt} full /></small><p className="help-text">Further review requires a new applicant submission; a completed request is not silently reopened.</p></>}</div></Panel></aside></div>
    {decision && <DecisionDialog title={decision.title} subject={person.name} evidence={!claim && decision.id === 'approve'} reasonRequired={decision.id !== 'approve'} onClose={() => setDecision(null)} onSubmit={({ reason, reviewed }) => commit({ collection: kind, id, revision: decision.revision, action: decision.id, reason, values: { reviewed } }, `${decision.title} — decision saved.`)} />}
  </>;
}
export function VerificationDetail() { return <ReviewDetail kind="verification" />; }
export function ClaimDetail() { return <ReviewDetail kind="claims" />; }

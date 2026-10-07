import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpDown, Check, ChevronLeft, ChevronRight, Search, X, Inbox, CircleAlert } from 'lucide-react';
import { label } from '../../lib/model';

export function Button({ variant = 'secondary', children, className = '', ...props }) { return <button type="button" className={`btn ${variant} ${className}`} {...props}>{children}</button>; }
export function Brand() { const [failed, setFailed] = useState(false); return <>{failed ? <span className="brand-mark" aria-hidden="true">u</span> : <img className="brand-icon" alt="" width="30" height="30" src="https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041954/Icon_300x-8_l1gnkq.png" onError={() => setFailed(true)} />}<strong>Ugrads<span>Admin</span></strong></>; }
export function ButtonLink({ to, children, variant = 'secondary', ...props }) { return <Link className={`btn ${variant}`} to={to} {...props}>{children}</Link>; }
export function Badge({ status, children }) { return <span className={`badge status-${status || 'neutral'}`}><span className="status-dot" />{children || label(status)}</span>; }
export function Avatar({ name = '', square = false }) { return <span aria-hidden="true" className={`avatar ${square ? 'square' : ''}`}>{name.replace(/^(Dr\.|Mr\.|Ms\.|Ar\.)\s*/, '').split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('')}</span>; }
export function Person({ name, secondary, square }) { return <span className="person"><Avatar name={name} square={square} /><span><strong>{name}</strong>{secondary && <small>{secondary}</small>}</span></span>; }
export function PageHeader({ eyebrow, title, description, actions }) { return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1 tabIndex={-1}>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="actions">{actions}</div>}</div>; }
export function Panel({ title, description, action, children, className = '' }) { return <section className={`panel ${className}`}>{title && <header className="panel-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</header>}{children}</section>; }
export function Empty({ title = 'No records found', description = 'Try a different search or clear your filters.', action, icon = Inbox, level = 2 }) { const Icon = icon; const Heading = level === 1 ? 'h1' : 'h2'; return <div className="empty"><span className="empty-icon"><Icon size={24} /></span><Heading tabIndex={level === 1 ? -1 : undefined}>{title}</Heading><p>{description}</p>{action}</div>; }
export function Note({ children, tone = 'info' }) { return <div className={`note ${tone}`}><CircleAlert size={16} aria-hidden="true" /><div>{children}</div></div>; }
export function Field({ label: text, children, hint }) { const id = useId(); return <div className="field"><label htmlFor={id}>{text}</label>{typeof children === 'function' ? children({ id, 'aria-describedby': hint ? `${id}-hint` : undefined }) : children}{hint && <small id={`${id}-hint`}>{hint}</small>}</div>; }
export function Descriptions({ items }) { return <dl className="descriptions">{items.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value || '—'}</dd></div>)}</dl>; }
export function DateText({ value, full = false }) { if (!value) return '—'; return <time dateTime={value} title={new Date(value).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) + ' · Asia/Dhaka'}>{new Date(value).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', ...(full ? { hour: '2-digit', minute: '2-digit' } : {}) })}</time>; }
export function BackLink({ to, children }) { const location = useLocation(); const saved = location.state?.from; return <Link className="back-link" to={saved?.split('?')[0] === to ? saved : to}><ArrowLeft size={15} />{children || 'Back to list'}</Link>; }
export function Tabs({ items }) {
  const [params, setParams] = useSearchParams(); const current = items.some(item => item.id === params.get('tab')) ? params.get('tab') : items[0].id;
  return <nav className="tabs" aria-label="Detail sections">{items.map(item => <button key={item.id} className={current === item.id ? 'selected' : ''} aria-current={current === item.id ? 'page' : undefined} onClick={() => { const next = new URLSearchParams(params); next.set('tab', item.id); setParams(next, { preventScrollReset: true }); }}>{item.label}</button>)}</nav>;
}
export function Modal({ title, description, children, onClose, busy = false }) {
  const ref = useRef(); const titleId = useId(); const descId = useId();
  useEffect(() => { const dialog = ref.current; const trigger = document.activeElement; dialog.showModal(); return () => { dialog.close(); if (trigger?.isConnected) trigger.focus(); }; }, []);
  return <dialog ref={ref} className="modal" aria-labelledby={titleId} aria-describedby={description ? descId : undefined} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target === ref.current && !busy) { const r = ref.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <header><div><h2 id={titleId}>{title}</h2>{description && <p id={descId}>{description}</p>}</div><Button className="icon" aria-label="Close dialog" disabled={busy} onClick={onClose}><X size={18} /></Button></header>{children}
  </dialog>;
}
export function DecisionDialog({ title, subject, description, onClose, onSubmit, destructive = false, reasonRequired = true, evidence = false, children }) {
  const [reason, setReason] = useState(''); const [phrase, setPhrase] = useState(''); const [reviewed, setReviewed] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  return <Modal title={title} description={description || `This decision will be recorded for ${subject}.`} onClose={onClose} busy={busy}><form onSubmit={async e => { e.preventDefault(); if (busy || destructive && phrase !== subject) return; setError(''); setBusy(true); try { await onSubmit({ reason, reviewed }); onClose(); } catch (err) { setError(err.message); } finally { setBusy(false); } }}>
    <div className="modal-body">{children}{evidence && <label className="check-row"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} required />I reviewed the applicant’s available evidence and identity.</label>}
      <Field label={reasonRequired ? 'Decision reason' : 'Internal note (optional)'}>{props => <textarea {...props} autoFocus={!destructive && !evidence} value={reason} onChange={e => setReason(e.target.value)} required={reasonRequired} minLength={reasonRequired ? 5 : undefined} rows={3} placeholder="Explain the decision for the next reviewer…" />}</Field>
      {destructive && <Field label={`To confirm, type “${subject}”`}>{props => <input {...props} autoFocus value={phrase} onChange={e => setPhrase(e.target.value)} autoComplete="off" required />}</Field>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div><footer><Button disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" variant={destructive ? 'danger' : 'primary'} disabled={busy || (destructive && phrase !== subject)} aria-busy={busy}>{busy ? 'Saving…' : title}</Button></footer>
  </form></Modal>;
}

export function Register({ rows, columns, filters = [], searchLabel = 'Search records', searchText, defaultSort = 'submittedAt', defaultStatus = '', noun = 'records' }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const change = (key, value) => { const next = new URLSearchParams(params); next.set(key, value); if (key !== 'page') next.delete('page'); setParams(next, { replace: key === 'q', preventScrollReset: true }); };
  const query = params.get('q') || '';
  const sort = params.get('sort') || defaultSort; const descending = sort.startsWith('-'); const sortKey = sort.replace(/^-/, '');
  const activeValue = filter => params.get(filter.key) ?? (filter.key === 'status' ? defaultStatus : '');
  const filtered = rows.filter(row => (!query || searchText(row).toLowerCase().includes(query.toLowerCase())) && filters.every(f => !activeValue(f) || String(f.value ? f.value(row) : row[f.key]) === activeValue(f)))
    .sort((a, b) => String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true }) * (descending ? -1 : 1));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const page = Math.max(1, Math.min(pageCount, Number(params.get('page')) || 1));
  const start = (page - 1) * 10; const visible = filtered.slice(start, start + 10);
  const clear = () => { const next = new URLSearchParams(); if (defaultStatus) next.set('status', ''); setParams(next); };
  return <div className="register"><div className="filter-bar"><div className="search-input"><Search size={16} aria-hidden="true" /><input aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={e => change('q', e.target.value)} />{query && <button aria-label="Clear search" onClick={() => change('q', '')}><X size={14} /></button>}</div><div className="filter-selects">{filters.map(f => <select key={f.key} aria-label={`Filter by ${f.label}`} value={activeValue(f)} onChange={e => change(f.key, e.target.value)}><option value="">All {f.label.toLowerCase()}</option>{f.options.map(o => <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? label(o) : o.label}</option>)}</select>)}</div>{(query || filters.some(activeValue)) && <Button variant="tertiary" onClick={clear}>Clear</Button>}</div>
    {!filtered.length ? <Empty title={`No ${noun} found`} action={<Button onClick={clear}>Clear filters</Button>} /> : <><div className="table-scroll" tabIndex={0} role="region" aria-label={`${noun} table`}><table><thead><tr>{columns.map(c => <th key={c.key} aria-sort={c.key === sortKey ? descending ? 'descending' : 'ascending' : undefined}>{c.sortable ? <button onClick={() => change('sort', sort === c.key ? `-${c.key}` : c.key)}>{c.label}<ArrowUpDown size={12} aria-hidden="true" /></button> : c.label}</th>)}</tr></thead><tbody>{visible.map(row => <tr key={row.id}>{columns.map(c => <td key={c.key}>{c.render ? c.render(row, { from: location.pathname + location.search }) : row[c.key] || '—'}</td>)}</tr>)}</tbody></table></div><div className="pagination"><span>{start + 1}–{Math.min(start + 10, filtered.length)} of {filtered.length} {noun}</span><div><Button className="icon" aria-label="Previous page" disabled={page === 1} onClick={() => change('page', String(page - 1))}><ChevronLeft size={16} /></Button><span>Page {page} of {pageCount}</span><Button className="icon" aria-label="Next page" disabled={page === pageCount} onClick={() => change('page', String(page + 1))}><ChevronRight size={16} /></Button></div></div></>}
  </div>;
}
export function History({ entries }) { return entries.length ? <ol className="history">{entries.map(e => <li key={e.id}><span className="history-icon"><Check size={14} /></span><div><strong>{e.subject} · {label(e.action)}</strong><p>{e.reason || 'Record updated.'}</p><small>{e.actorName} · <DateText value={e.at} full /></small></div></li>)}</ol> : <Empty title="No decisions yet" description="Changes made in this workspace will appear here." />; }

import { useEffect, useState } from 'react';
import { Button, Field, Modal } from './index';

export default function EditDialog({ title, fields, initial = {}, onSave, onClose }) {
  const [values, setValues] = useState(initial); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [discard, setDiscard] = useState(false);
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);
  useEffect(() => { const warn = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  const close = () => dirty ? setDiscard(true) : onClose();
  return <Modal title={discard ? 'Discard changes' : title} description={discard ? 'Your unsaved changes will be lost.' : 'Changes are saved to this local admin workspace.'} onClose={close} busy={busy}>
    {discard ? <footer><Button onClick={() => setDiscard(false)}>Keep editing</Button><Button variant="danger" onClick={onClose}>Discard changes</Button></footer> : <form onSubmit={async e => { e.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await onSave(values); onClose(); } catch (err) { setError(err.message); } finally { setBusy(false); } }}><div className="modal-body form-stack">{fields.map((f, i) => <Field key={f.key} label={f.label} hint={f.hint}>{props => f.type === 'textarea' ? <textarea {...props} required={f.required} maxLength={f.maxLength} value={values[f.key] ?? ''} rows={4} onChange={e => setValues({ ...values, [f.key]: e.target.value })} /> : f.options ? <select {...props} required={f.required} value={values[f.key] ?? ''} onChange={e => setValues({ ...values, [f.key]: e.target.value })}><option value="">Select…</option>{f.options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}</select> : <input {...props} autoFocus={i === 0} type={f.type || 'text'} required={f.required} value={values[f.key] ?? ''} maxLength={f.maxLength || 250} onChange={e => setValues({ ...values, [f.key]: e.target.value })} />}</Field>)}{error && <p className="form-error" role="alert">{error}</p>}</div><footer><Button disabled={busy} onClick={close}>Cancel</Button><Button variant="primary" type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Saving…' : 'Save changes'}</Button></footer></form>}
  </Modal>;
}

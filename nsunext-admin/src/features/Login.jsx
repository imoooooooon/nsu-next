import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../app/context';
import { ROLES } from '../lib/model';
import { Brand, Button, Field } from '../components/ui';
export default function Login() {
  const { actor, data, login } = useAdmin(); const [id, setId] = useState('admin-owner'); const [error, setError] = useState(''); const navigate = useNavigate(); const location = useLocation();
  if (actor) return <Navigate to="/" replace />;
  return <main className="login-page"><div className="login-card"><div className="brand"><Brand /></div><div className="eyebrow">NORTH SOUTH UNIVERSITY</div><h1>Your community.<br />Thoughtfully managed.</h1><p>Review requests, support your campus and keep the Ugrads community moving forward.</p><form onSubmit={e => { e.preventDefault(); try { login(id); const next = location.state?.returnTo; navigate(next?.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : '/', { replace: true }); } catch { setError('Browser storage is unavailable. Enable storage and retry.'); } }}><Field label="Review session">{props => <select {...props} value={id} onChange={e => setId(e.target.value)}>{data.admins.filter(a => a.active).map(a => <option key={a.id} value={a.id}>{a.name} · {ROLES[a.role]}</option>)}</select>}</Field>{error && <p role="alert" className="form-error">{error}</p>}<Button type="submit" variant="primary">Enter workspace<ArrowRight size={17} /></Button></form><div className="login-note"><ShieldCheck size={18} /><p><strong>Prototype access</strong>Changes are saved in this browser. Public previews on this origin reflect local decisions. No live accounts or emails are changed.</p></div></div><span className="login-footer">Ugrads · Campus community, connected.</span></main>;
}

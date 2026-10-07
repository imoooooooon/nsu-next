import { SUBMISSIONS_KEY } from '../../../src/shared/adminBridge.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminContext } from './context';
import { createSeed } from '../data/seed';
import { createRepository, STORE_KEY } from '../data/repository';

const SESSION_KEY = 'ugrads-admin-session-v1';
const THEME_KEY = 'ugrads-admin-theme-v1';
export default function AdminProvider({ children }) {
  const [initial] = useState(() => {
    try {
      const repo = createRepository(localStorage, createSeed);
      return { repo, data: repo.load(), actorId: localStorage.getItem(SESSION_KEY), theme: localStorage.getItem(THEME_KEY) || 'system', error: '' };
    } catch (error) { return { data: null, error: `Workspace could not load: ${error.message}` }; }
  });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const clock = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(clock); }, []);
  const [data, setData] = useState(initial.data);
  const [loadError, setLoadError] = useState(initial.error);
  const [actorId, setActorId] = useState(initial.actorId);
  const [theme, setThemeValue] = useState(initial.theme || 'system');
  const [systemDark, setSystemDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  const [density, setDensityValue] = useState(() => { try { return localStorage.getItem('ugrads-admin-density') || 'comfortable'; } catch { return 'comfortable'; } });
  const setDensity = value => { try { localStorage.setItem('ugrads-admin-density', value); setDensityValue(value); } catch { notify('Display preference could not be saved.'); } };
  const [toast, setToast] = useState('');
  const timer = useRef();
  const actor = data?.admins.find(a => a.id === actorId && a.active) || null;
  const notify = useCallback(message => { clearTimeout(timer.current); setToast(message); timer.current = setTimeout(() => setToast(''), 4500); }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const change = () => setSystemDark(media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const refresh = event => {
      if (event.key !== STORE_KEY && event.key !== SUBMISSIONS_KEY && event.key !== null) return;
      try { setData(initial.repo.load()); setLoadError(''); } catch (error) { setLoadError(error.message); }
    };
    window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh);
  }, [initial]);
  const commit = async (command, message) => {
    const perform = () => {
      const next = initial.repo.commit(actorId, command);
      setData(next); notify(message || 'Changes saved.'); return next;
    };
    try {
      return navigator.locks ? await navigator.locks.request('ugrads-admin-write', perform) : perform();
    } catch (error) {
      // Refresh stale detail data without discarding the open form or its captured revision.
      try { setData(initial.repo.load()); } catch { /* preserve current view; error remains actionable */ }
      throw new Error(error.name === 'QuotaExceededError' ? 'Storage is full. Your change was not saved. Free browser storage and retry.' : error.message);
    }
  };
  const login = id => { localStorage.setItem(SESSION_KEY, id); setActorId(id); };
  const logout = () => { try { localStorage.removeItem(SESSION_KEY); setActorId(null); } catch { notify('Could not clear the stored session.'); } };
  const setTheme = value => { try { localStorage.setItem(THEME_KEY, value); setThemeValue(value); } catch { notify('Theme could not be saved.'); } };
  return <AdminContext value={{ data, now, actor, login, logout, commit, notify, theme, setTheme, density, setDensity }}>
    <div className="ug-admin" data-density={density} data-theme={theme === 'system' ? systemDark ? 'dark' : 'light' : theme}>
      {loadError ? <main className="fatal"><h1>Workspace unavailable</h1><p>{loadError}</p><p>Your stored records have not been reset. Enable browser storage or restore a valid backup, then retry.</p><button className="btn primary" onClick={() => location.reload()}>Retry loading</button></main> : children}
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  </AdminContext>;
}

import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Flag, HeartPulse, Megaphone, ChartNoAxesCombined, ScrollText, Settings, LayoutDashboard, Users, BadgeCheck, Building2, BriefcaseBusiness, ExternalLink, Menu, X, ChevronsUpDown, LogOut, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../../app/context';
import { can, queueItems, ROLES } from '../../lib/model';
import { Avatar, Brand, Button, Modal } from '../ui';
import RoutePosition from '../../app/RoutePosition';
const nav = [
  { to: '/', name: 'Overview', icon: LayoutDashboard, cap: 'overview' },
  { to: '/members', name: 'Members', icon: Users, cap: 'members', group: 'Community' },
  { to: '/verification', name: 'Verification', icon: BadgeCheck, cap: 'verification' },
  { to: '/departments', name: 'Departments', icon: Building2, cap: 'departments' },
  { to: '/jobs/hiring', name: 'Hiring', icon: BriefcaseBusiness, cap: 'hiring', group: 'Career opportunities' },
  { to: '/jobs/seeking', name: 'Seeking work', icon: Users, cap: 'seeking' },
  { to: '/events', name: 'Events', icon: CalendarDays, cap: 'events', group: 'Content & safety' },
  { to: '/moderation', name: 'Moderation', icon: Flag, cap: 'moderation' },
  { to: '/emergency', name: 'Emergency', icon: HeartPulse, cap: 'requests' },
  { to: '/campaigns', name: 'Campaigns', icon: Megaphone, cap: 'campaigns', group: 'Engagement' },
  { to: '/analytics', name: 'Analytics', icon: ChartNoAxesCombined, cap: 'analytics', group: 'Administration' },
  { to: '/audit', name: 'Audit log', icon: ScrollText, cap: 'audit' },
  { to: '/settings', name: 'Settings', icon: Settings, cap: 'preferences' },
];
export default function Shell() {
  const { data, actor, logout, theme, setTheme } = useAdmin();
  const [menu, setMenu] = useState(false); const [account, setAccount] = useState(false);
  const location = useLocation(); const navigate = useNavigate(); const queue = queueItems(data);
  const active = nav.find(n => n.to !== '/' && location.pathname.startsWith(n.to)) || nav[0];
  useEffect(() => { document.title = `${active.name} · Ugrads Admin`; }, [active.name]);
  const links = <><Link to="/" className="brand" onClick={() => setMenu(false)}><Brand /></Link>
    <div className="institution"><span className="institution-icon"><Building2 size={17} /></span><div><strong>{data.settings[0].institution}</strong><small>Campus workspace</small></div></div>
    <nav aria-label="Main navigation">{nav.filter(n => can(actor, n.cap)).map(n => <div key={n.to}>{n.group && <div className="nav-group">{n.group}</div>}<NavLink end={n.to === '/'} to={n.to} onClick={() => setMenu(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><n.icon size={17} strokeWidth={1.65} /><span>{n.name}</span>{['verification', 'hiring', 'seeking'].includes(n.cap) && queue.filter(q => q.collection === n.cap).length > 0 && <span className="nav-count">{queue.filter(q => q.collection === n.cap).length}</span>}</NavLink></div>)}</nav>
    <div className="sidebar-bottom"><a href="/webapp/" target="_blank" rel="noreferrer" className="nav-item"><ExternalLink size={16} /><span>View Ugrads</span><ArrowUpRight size={14} /></a><div className="workspace-note"><span className="live-dot" />Local workspace<span title="Same-origin public app and admin share local decisions.">Local data</span></div><button className="account-button" onClick={() => { setMenu(false); setAccount(true); }}><Avatar name={actor.name} /><span><strong>{actor.name}</strong><small>{ROLES[actor.role]}</small></span><ChevronsUpDown size={14} /></button></div></>;
  return <div className="app-layout"><a href="#main-content" className="skip-link">Skip to content</a><aside className="sidebar">{links}</aside>{menu && <Modal title="Navigation" onClose={() => setMenu(false)}><div className="mobile-nav">{links}</div></Modal>}
    <div className="workspace"><header className="topbar"><div className="breadcrumbs"><Button className="icon mobile-menu" aria-label="Open navigation" onClick={() => setMenu(true)}><Menu size={19} /></Button><span>Workspace</span><span className="slash">/</span><Link to={active.to}>{active.name}</Link>{location.pathname.split('/').length > (active.to === '/' ? 2 : active.to.split('/').length) && <><span className="slash">/</span><span className="breadcrumb-detail">Details</span></>}</div><div className="topbar-actions"><span className="timezone">Asia/Dhaka</span><select className="theme-select" aria-label="Color theme" value={theme} onChange={e => setTheme(e.target.value)}><option value="system">System theme</option><option value="light">Light theme</option><option value="dark">Dark theme</option></select><button className="topbar-avatar" aria-label="Open admin account" onClick={() => setAccount(true)}><Avatar name={actor.name} /></button></div></header>
    <main id="main-content" key={location.pathname} className="main-content"><Outlet /></main><RoutePosition /><footer className="workspace-footer"><span>{data.settings[0].name} administration · <a href={`mailto:${data.settings[0].supportEmail}`}>Support</a></span><span><ShieldCheck size={13} /> Decisions are recorded in your workspace</span></footer></div>
    {account && <Modal title="Admin account" description="This review session uses local prototype data. It is separate from your Ugrads member account." onClose={() => setAccount(false)}><div className="modal-body"><div className="account-summary"><Avatar name={actor.name} /><div><strong>{actor.name}</strong><p>{ROLES[actor.role]}</p></div></div><p className="muted">To review another permission level, sign out and choose a different prototype session. Local decisions are retained.</p></div><footer><Button onClick={() => setAccount(false)}><X size={15} />Close</Button><Button onClick={() => { logout(); setAccount(false); navigate('/login'); }}><LogOut size={15} />Sign out</Button></footer></Modal>}
  </div>;
}

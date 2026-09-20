import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, Briefcase, UserSearch, MessageSquare, User, CalendarDays,
  Building2, Droplet, Bell, Settings, LogOut,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { getViewerIdentity } from '../../data/people';
import { Verified } from '../ui';

/* ---------------------------------------------------------------------------
   Desktop sidebar — the mobile liquid-glass capsule nav, stood upright and
   parked beneath the top bar.

   Width has two inputs: the viewport (lg → xl is an icon rail because there is
   no room for labels) and the user's own choice (`isSidebarCollapsed`), which
   persists. Collapsed wins at every breakpoint, so "show me icons only" stays
   true on a 4K screen.
--------------------------------------------------------------------------- */

/* Active state is computed rather than left to NavLink: `/jobs` would claim
   `/jobs/seeking`, and Departments lives at a *query* on /network, which
   NavLink cannot see. One matcher per item keeps exactly one row lit. */
const isSeeking = ({ pathname }) => pathname.startsWith('/jobs/seeking');
const isDepartments = ({ pathname, search }) =>
  pathname.startsWith('/departments') ||
  (pathname === '/network' && new URLSearchParams(search).get('segment') === 'Departments');

const NAV_MAIN = [
  { to: '/home', icon: Home, label: 'Home', match: (l) => l.pathname.startsWith('/home') },
  { to: '/network', icon: Compass, label: 'Explore', match: (l) => l.pathname.startsWith('/network') && !isDepartments(l) },
  { to: '/jobs', icon: Briefcase, label: 'Jobs', badge: 3, match: (l) => l.pathname.startsWith('/jobs') && !isSeeking(l) },
  { to: '/jobs/seeking', icon: UserSearch, label: 'Seeking', match: isSeeking },
  { to: '/messages', icon: MessageSquare, label: 'Messages', match: (l) => l.pathname.startsWith('/messages') },
];

const NAV_CAMPUS = [
  { to: '/events', icon: CalendarDays, label: 'Events', match: (l) => l.pathname.startsWith('/events') },
  { to: '/network?segment=Departments', icon: Building2, label: 'Departments', match: isDepartments },
  { to: '/emergency', icon: Droplet, label: 'Emergency', accent: 'text-red-500', match: (l) => l.pathname.startsWith('/emergency') },
  { to: '/notifications', icon: Bell, label: 'Notifications', dot: true, match: (l) => l.pathname.startsWith('/notifications') },
];

const NavItem = ({ item, isDark, collapsed, active }) => (
  <Link
    to={item.to}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? item.label : undefined}
    className={`relative flex items-center h-[48px] rounded-xl transition-all duration-300 ease-out overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? `${isDark ? 'nav-active-dark text-white' : 'nav-active-light text-black'}`
        : `bg-transparent ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`
    }`}
  >
    <div className="w-[52px] h-[48px] shrink-0 flex items-center justify-center relative">
      <item.icon
        className={`w-[22px] h-[22px] transition-colors duration-300 ${!active && item.accent ? item.accent : ''}`}
        strokeWidth={active ? 2.5 : 2}
        fill={active && !item.dot && item.icon !== Compass && item.icon !== UserSearch && item.icon !== Building2 ? 'currentColor' : 'none'}
      />
      {item.badge && !active && (
        <div className={`absolute top-[8px] right-[10px] w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center border-[1.5px] ${isDark ? 'border-[#1c1c1e]' : 'border-white'}`}>
          <span className="text-white text-[7px] font-bold">{item.badge}</span>
        </div>
      )}
      {item.dot && !active && (
        <span className={`absolute top-[10px] right-[13px] w-2 h-2 bg-[#1D9BF0] rounded-full border ${isDark ? 'border-[#1c1c1e]' : 'border-white'}`}></span>
      )}
    </div>
    <span
      className={`${collapsed ? 'hidden' : 'hidden xl:block'} flex-1 whitespace-nowrap text-left text-[14px] font-extrabold pr-4 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-80'
      }`}
    >
      {item.label}
    </span>
  </Link>
);

const GroupLabel = ({ children, collapsed, t }) => (
  <span className={`${collapsed ? 'hidden' : 'hidden xl:block'} px-3 pb-2 text-[9px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>
    {children}
  </span>
);

export const Sidebar = () => {
  const { isDark, t, isSidebarCollapsed } = useTheme();
  const { authRole, logout } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const viewer = getViewerIdentity(authRole);

  const collapsed = isSidebarCollapsed;

  return (
    <aside
      className={`hidden lg:flex fixed top-[72px] bottom-4 left-4 z-40 flex-col px-3 py-4 rounded-2xl transition-[width] duration-300 ${
        isDark ? 'nav-capsule-dark' : 'nav-capsule-light'
      } ${collapsed ? 'w-[76px]' : 'w-[76px] xl:w-[248px]'}`}
    >
      <nav className="flex-1 flex flex-col space-y-1 overflow-y-auto hide-scrollbar">
        <GroupLabel collapsed={collapsed} t={t}>Menu</GroupLabel>
        {NAV_MAIN.map(item => (
          <NavItem key={item.label} item={item} isDark={isDark} collapsed={collapsed} active={item.match(location)} />
        ))}

        <GroupLabel collapsed={collapsed} t={t}><span className="block pt-4">Campus</span></GroupLabel>
        <div className={`${collapsed ? 'block' : 'xl:hidden'} my-3 mx-2 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}></div>
        {NAV_CAMPUS.map(item => (
          <NavItem key={item.label} item={item} isDark={isDark} collapsed={collapsed} active={item.match(location)} />
        ))}
      </nav>

      {/* Footer: settings + profile */}
      <div className="shrink-0 pt-3 space-y-1">
        <NavItem
          item={{ to: '/profile?tab=Settings', icon: Settings, label: 'Settings', match: () => false }}
          isDark={isDark}
          collapsed={collapsed}
          active={location.pathname.startsWith('/profile/settings')}
        />

        <Link
          to="/profile"
          title={collapsed ? viewer.fullName : undefined}
          className={`flex items-center rounded-xl p-2 transition-colors border outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
            location.pathname === '/profile'
              ? `${isDark ? 'nav-active-dark border-white/10' : 'nav-active-light border-black/5'}`
              : `border-transparent ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
          }`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shadow-sm border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-200 border-gray-300'} shrink-0 ${collapsed ? 'mx-auto' : 'mx-auto xl:mx-0'}`}>
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
          </div>
          <div className={`${collapsed ? 'hidden' : 'hidden xl:flex'} flex-col ml-2.5 flex-1 min-w-0`}>
            <span className={`text-[12px] font-extrabold ${t.text} truncate flex items-center`}>
              {viewer.fullName} <Verified size="w-3 h-3" className="ml-1" />
            </span>
            <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{viewer.roleSub}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); navigate('/welcome'); }}
            aria-label="Log out"
            title="Log out"
            className={`${collapsed ? 'hidden' : 'hidden xl:flex'} w-8 h-8 rounded-lg items-center justify-center ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-white/5' : 'text-gray-400 hover:text-red-500 hover:bg-black/5'} transition-colors shrink-0`}
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </Link>
      </div>
    </aside>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldCheck } from 'lucide-react';
import { useOwnedDepartment } from '../../lib/useOwnedDepartment';
import { useTheme } from '../../theme/ThemeContext';

export function DepartmentOwnerNav({ collapsed = false, sidebar = false }) {
  const dept = useOwnedDepartment();
  const location = useLocation();
  const { t, isDark } = useTheme();
  if (!dept) return null;
  const admin = location.pathname === `/departments/${dept.id}/manage`;
  const directory = location.pathname === '/network' && new URLSearchParams(location.search).get('segment') === 'Departments';
  const home = directory || location.pathname === `/departments/${dept.id}`;
  return (
    <nav aria-label="Department owner navigation" className={sidebar ? `mb-2 ${collapsed ? '' : 'xl:ml-6'} space-y-1` : 'lg:hidden flex gap-2 mb-4 pt-4'}>
      {[
        { label: 'Home', to: '/network?segment=Departments', icon: Home, active: home },
        { label: 'Admin', to: `/departments/${dept.id}/manage`, icon: ShieldCheck, active: admin },
      ].map(({ label, to, icon: Icon, active }) => (
        <Link key={label} to={to} aria-label={`Department ${label}`} aria-current={active ? 'page' : undefined} title={`Department ${label}`}
          className={`flex items-center gap-2 rounded-lg text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${sidebar ? 'h-9 px-3 justify-center xl:justify-start' : 'px-4 py-2'} ${active ? 'bg-[#1D9BF0]/10 text-[#1D9BF0]' : `${t.textMuted} ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}`}>
          <Icon size={15} className="shrink-0" />
          <span className={sidebar ? (collapsed ? 'hidden' : 'hidden xl:block') : ''}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

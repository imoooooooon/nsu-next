import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { AmbientBackground } from './AmbientBackground';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ArrowLeft } from 'lucide-react';
import { Toast, IconButton } from '../ui';

/* ---------------------------------------------------------------------------
   AppShell — the authenticated frame.
   Desktop:  pinned edge-to-edge topbar + floating glass sidebar beneath it.
   Mobile:   full-bleed pages + the floating bottom capsule (mobile parity).
--------------------------------------------------------------------------- */

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
};

export const AppShell = () => {
  const { t, isSidebarCollapsed } = useTheme();
  const { isAuthed } = useAppState();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className={`min-h-screen ${t.bg} font-jakarta antialiased selection:bg-[#1D9BF0]/30 transition-colors duration-500`}>
      <AmbientBackground />
      <ScrollToTop />
      {/* The bar is an edge-to-edge sibling pinned at top-0, so it takes its
          own 64px of flow and the content below simply starts after it — no
          hand-maintained 100vh-minus-bar arithmetic, and nothing scrolls
          through a gap above it. */}
      <TopBar />
      <Sidebar />
      <div
        className={`relative z-10 transition-[padding] duration-300 flex flex-col min-h-[calc(100vh-4rem)] ${
          isSidebarCollapsed ? 'lg:pl-[108px]' : 'lg:pl-[108px] xl:pl-[280px]'
        }`}
      >
        <main className="relative flex-1 pb-32 lg:pb-16">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Toast />
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Page frame.
   Every route shares ONE outer width so the content's left edge never shifts
   as you navigate — the single biggest source of "unpolished" on a multi-page
   app. Pages vary their *internal* composition (grids, form columns) instead
   of their frame.

   `fullHeight` is for routes that own the viewport (the messages split view):
   it cancels the shell's desktop bottom gutter so the page never scrolls and
   the pinned TopBar can't clip the pane headers.
--------------------------------------------------------------------------- */
export const PageContainer = ({ fullHeight = false, className = '', children }) => (
  <div className={`w-full max-w-6xl mx-auto px-5 lg:px-8 ${fullHeight ? 'lg:-mb-16' : ''} ${className}`}>
    {children}
  </div>
);

/* Reading/among-fields column for forms and long prose, centred inside the
   constant frame so the page edge stays put while the text stays readable. */
export const FormColumn = ({ className = '', children }) => (
  <div className={`w-full max-w-2xl mx-auto ${className}`}>{children}</div>
);

/* Page-level header: big title + optional subtitle + actions row.
   Mirrors the mobile per-page headers, adapted for a wide canvas. */
export const PageHeader = ({ title, subtitle, accent = false, children, className = '' }) => {
  const { t, isDark } = useTheme();
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 pt-8 lg:pt-6 pb-5 ${className}`}>
      <div>
        <h2 className={`text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${accent ? (isDark ? 'text-red-400' : 'text-red-600') : t.text}`}>
          {title}
        </h2>
        {subtitle && <p className={`${t.textMuted} text-xs lg:text-sm font-bold tracking-wide mt-1`}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
};

/* Detail-route header: back control, title block, optional actions.
   Left-aligned as one cluster — the mobile centred title spreads apart and
   loses its relationship to the back button at desktop widths. */
export const DetailHeader = ({ title, subtitle, onBack, accent = false, children, className = '' }) => {
  const { t, isDark } = useTheme();
  return (
    <div className={`flex items-center gap-3 pt-8 lg:pt-6 pb-5 ${className}`}>
      {onBack && <IconButton icon={ArrowLeft} label="Go back" onClick={onBack} className="shrink-0" />}
      <div className="min-w-0 flex-1">
        <h2 className={`text-xl lg:text-2xl font-extrabold tracking-tight leading-tight truncate ${accent ? (isDark ? 'text-red-400' : 'text-red-600') : t.text}`}>
          {title}
        </h2>
        {subtitle && <p className={`${t.textMuted} text-[11px] lg:text-xs font-bold tracking-wide mt-0.5 truncate`}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};

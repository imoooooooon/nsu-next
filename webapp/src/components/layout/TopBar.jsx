import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Moon, Sun, CalendarDays, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { getViewerIdentity } from '../../data/people';
import { Verified } from '../ui';

/* ---------------------------------------------------------------------------
   Desktop top bar — brand, global search, quick shortcuts, theme, profile.
   Hidden below lg (mobile pages carry their own headers like the mobile app).

   It is an edge-to-edge band pinned at `top-0`, not a floating card. A card
   floating at `top-4` left a 16px channel above it and translucent glass
   through it, so the page visibly scrolled past and behind the bar. Spanning
   the full viewport also removes the seam the floating version was avoiding:
   there is no gutter for the surface to die in, because the surface runs the
   whole width and the sidebar simply starts beneath it.

   The per-route title that used to sit on the left is gone: every page already
   states its own name in `PageHeader`, so the two stacked headers were saying
   the same word twice. The brand takes that slot instead.
--------------------------------------------------------------------------- */

export const TOPBAR_HEIGHT = 64;

export const TopBar = () => {
  const { isDark, toggleTheme, t, isSidebarCollapsed, toggleSidebar } = useTheme();
  const { authRole } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const viewer = getViewerIdentity(authRole);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/network?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const utility = `w-10 h-10 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
    isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'
  } outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`;

  return (
    <header
      className={`hidden lg:block sticky top-0 z-50 h-16 border-b ${isDark ? 'bg-black border-white/10' : 'bg-[#F2F5F8] border-black/[0.06]'}`}
    >
      <div className="h-full flex items-center gap-5 px-4">
        {/* Brand sits over the sidebar column — the rail below starts straight
            at the nav, so the product name is stated once, not twice. */}
        <div
          className={`flex items-center shrink-0 transition-[width] duration-300 ${
            isSidebarCollapsed ? 'w-[92px]' : 'w-[92px] xl:w-[264px]'
          }`}
        >
          <button
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`${utility} shrink-0`}
          >
            {isSidebarCollapsed
              ? <PanelLeftOpen className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
              : <PanelLeftClose className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />}
          </button>

          <Link to="/home" className="flex items-center ml-1.5 min-w-0 group">
            <img
              src="https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041954/Icon_300x-8_l1gnkq.png"
              alt="NSUNEXT"
              className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className={`hidden ${isSidebarCollapsed ? '' : 'xl:flex'} flex-col ml-2 min-w-0`}>
              <span className={`text-[15px] font-extrabold tracking-tight leading-tight ${t.text}`}>NSUNEXT</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#1D9BF0]">NSU Verified Network</span>
            </div>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 pointer-events-none`} strokeWidth={2.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, jobs, events..."
            aria-label="Search"
            className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-10 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
          />
        </form>

        <div className="flex items-center space-x-1.5 ml-auto">
          <button onClick={() => navigate('/events')} aria-label="Events" title="Events" className={utility}>
            <CalendarDays className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
          <button onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme" className={utility}>
            {isDark ? <Sun className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />}
          </button>
          <button
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            title="Notifications"
            className={`${utility} relative`}
          >
            <Bell className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#1D9BF0] rounded-full"></span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            aria-label="Open your profile"
            className={`flex items-center pl-3 pr-1.5 py-1.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
          >
            <div className="hidden xl:flex flex-col items-end mr-2.5">
              <span className={`text-xs font-extrabold ${t.text} flex items-center`}>
                {viewer.firstName} <Verified size="w-3 h-3" className="ml-1" />
              </span>
              <span className={`text-[9px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{authRole}</span>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-[#1D9BF0] p-0.5 shadow-sm shadow-[#1D9BF0]/30">
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-white/10' : 'bg-white/70'} flex items-center justify-center overflow-hidden`}>
                <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 ${t.text}`} stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

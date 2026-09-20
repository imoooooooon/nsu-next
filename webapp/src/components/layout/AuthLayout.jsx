import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { AmbientBackground } from './AmbientBackground';
import { Toast } from '../ui';

/* ---------------------------------------------------------------------------
   AuthLayout — the unauthenticated frame.
   The mobile auth flow lives in a centered glass panel on desktop
   (max-w 480px, the phone canvas width) so it reads identically on web.
--------------------------------------------------------------------------- */

export const AuthLayout = () => {
  const { t, isDark, toggleTheme } = useTheme();
  const { isAuthed } = useAppState();
  const location = useLocation();

  if (isAuthed) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className={`min-h-screen ${t.bg} font-jakarta antialiased selection:bg-[#1D9BF0]/30 transition-colors duration-500 flex flex-col`}>
      <AmbientBackground />

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`fixed top-5 right-5 z-50 w-10 h-10 rounded-xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white'} border flex items-center justify-center transition-all shadow-sm backdrop-blur-md active:scale-95`}
      >
        {isDark ? <Sun className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />}
      </button>

      <div className="relative z-10 flex-1 flex items-stretch sm:items-center justify-center sm:py-10">
        <div
          key={location.pathname}
          className={`w-full sm:max-w-[480px] h-[100dvh] sm:h-[min(860px,92dvh)] flex flex-col relative overflow-hidden sm:rounded-[2rem] ${t.card} sm:border ${t.border} sm:shadow-2xl sm:shadow-black/10 animate-fade-in`}
        >
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  );
};

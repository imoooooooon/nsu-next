import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';

/* The Hiring | Seeking primary mode pill — routes between /jobs and /jobs/seeking. */
export const JobsModeToggle = ({ mode, className = '' }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`flex p-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`} role="tablist" aria-label="Jobs mode">
      {[
        { id: 'hiring', label: 'Hiring', to: '/jobs' },
        { id: 'seeking', label: 'Seeking', to: '/jobs/seeking' },
      ].map(m => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => navigate(m.to)}
          className={`flex-1 py-2 px-6 rounded-full text-xs font-extrabold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.98] ${
            mode === m.id
              ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border`
              : `text-gray-500 hover:${t.text}`
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

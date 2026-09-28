import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { useSlidingPill } from '../../components/ui';

/* The Hiring | Seeking primary mode pill — routes between /jobs and /jobs/seeking.

   Seeking is a mode of Jobs, not a destination of its own (it left the
   sidebar for that reason), so switching must feel like flipping one
   control, not loading another page:

   · the pill glides on a spring from the mode you left — the two routes
     each render their own toggle, so the page you land on starts its pill
     on the other mode (`enterFrom`) and animates across;
   · the navigation carries `state.jobsModeSwitch`, and both pages skip their
     whole-page fade for it (useArrivedByModeSwitch) — only the feed below
     cross-fades, the header and the toggle stay put. */

const MODES = [
  { id: 'hiring', label: 'Hiring', to: '/jobs' },
  { id: 'seeking', label: 'Seeking', to: '/jobs/seeking' },
];

export const useArrivedByModeSwitch = () => Boolean(useLocation().state?.jobsModeSwitch);

export const JobsModeToggle = ({ mode, className = '' }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const modeSwitch = useArrivedByModeSwitch();
  const { trackRef, pillRef } = useSlidingPill(mode, {
    enterFrom: modeSwitch ? MODES.find(m => m.id !== mode).id : undefined,
  });

  return (
    <div ref={trackRef} className={`relative flex p-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`} role="tablist" aria-label="Jobs mode">
      <span
        ref={pillRef}
        aria-hidden="true"
        className={`sliding-pill rounded-full border ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white shadow-sm border-white'}`}
      />
      {MODES.map(m => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-pill-key={m.id}
            data-pill-active={active}
            onClick={() => { if (!active) navigate(m.to, { state: { jobsModeSwitch: true } }); }}
            className={`relative z-10 flex-1 py-2 px-6 rounded-full border border-transparent text-xs font-extrabold transition-[color,transform] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.97] ${
              active
                ? (isDark ? 'text-white' : 'text-black')
                : `text-gray-500 ${isDark ? 'hover:text-white' : 'hover:text-black'}`
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};

import { LayoutGrid, List } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Selection controls — segmented tabs, chips, toggles.
--------------------------------------------------------------------------- */

/* The rounded-rectangle segmented control (Account/Settings, Alumni/Student/Faculty…). */
export const SegmentedControl = ({ options, value, onChange, rounded = 'rounded-xl', itemRounded = 'rounded-lg', className = '' }) => {
  const { t, isDark } = useTheme();
  return (
    <div className={`flex p-1 ${rounded} ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`} role="tablist">
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { id: opt, label: opt } : opt;
        const active = value === o.id;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={`flex-1 py-2 ${itemRounded} text-xs font-extrabold transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.98] ${
              active
                ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border`
                : `text-gray-500 hover:${t.text}`
            }`}
          >
            {o.label}
            {o.badge != null && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${active ? 'bg-[#1D9BF0] text-white' : 'bg-[#1D9BF0]/20 text-[#1D9BF0]'}`}>
                {o.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* Card ⇄ list switch for growing collections (the Directory). Icon-only,
   so each option names itself for screen readers and on hover. It shares
   the SegmentedControl's track and active pill, one size down, because it
   changes how results look — not which results you see. */
const VIEW_MODES = [
  { id: 'card', label: 'Card view', icon: LayoutGrid },
  { id: 'list', label: 'List view', icon: List },
];

export const ViewModeToggle = ({ value, onChange, className = '' }) => {
  const { t, isDark } = useTheme();
  return (
    <div role="radiogroup" aria-label="View mode" className={`inline-flex p-0.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`}>
      {VIEW_MODES.map((mode) => {
        const active = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={mode.label}
            title={mode.label}
            onClick={() => onChange(mode.id)}
            className={`w-8 h-7 rounded-md flex items-center justify-center border transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-95 ${
              active
                ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'}`
                : `border-transparent ${t.textMuted} ${isDark ? 'hover:text-white' : 'hover:text-black'}`
            }`}
          >
            <mode.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        );
      })}
    </div>
  );
};

/* Solid-accent filter chips row (segments: All Jobs / For You / Saved, event categories…). */
/* `wrap` lets a chip row reflow instead of scrolling once the viewport can
   show every option — a clipped rail reads as broken on a wide canvas. */
export const ChipTabs = ({ options, value, onChange, rounded = 'rounded-lg', wrap = true, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex gap-2 overflow-x-auto hide-scrollbar ${wrap ? 'lg:flex-wrap lg:overflow-visible' : ''} ${className}`}>
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { id: opt, label: opt } : opt;
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={`px-4 py-2 ${rounded} text-xs font-extrabold transition-all border shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              active
                ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
                : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

/* Static tinted pill (dept chips, category chips, meta chips). Pass style classes. */
export const Pill = ({ className = '', children }) => (
  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border inline-flex items-center ${className}`}>
    {children}
  </span>
);

/* iOS-style switch, same geometry as mobile. */
export const Toggle = ({ checked, onChange, color = 'bg-[#1D9BF0]', size = 'md' }) => {
  const { isDark } = useTheme();
  const dims = size === 'lg'
    ? { track: 'w-12 h-7', knob: 'w-5 h-5', move: 'translate-x-5' }
    : { track: 'w-10 h-6', knob: 'w-4 h-4', move: 'translate-x-4' };
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange && onChange(); }}
      className={`${dims.track} rounded-full flex items-center px-1 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${checked ? color : (isDark ? 'bg-white/20' : 'bg-gray-300')}`}
    >
      <div className={`${dims.knob} bg-white rounded-full shadow-sm transform transition-transform ${checked ? dims.move : 'translate-x-0'}`}></div>
    </button>
  );
};

/* Carousel dot indicators. */
export const Dots = ({ count, index, onSelect, activeColor = 'bg-[#1D9BF0]', className = '' }) => (
  <div className={`flex justify-center space-x-1.5 ${className}`}>
    {Array.from({ length: count }).map((_, idx) => (
      <button
        key={idx}
        aria-label={`Go to slide ${idx + 1}`}
        onClick={() => onSelect && onSelect(idx)}
        className={`h-1.5 rounded-full transition-all duration-500 ${index === idx ? `w-4 ${activeColor}` : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
      />
    ))}
  </div>
);

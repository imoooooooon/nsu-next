import { LayoutGrid, List } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useSlidingPill } from './motion';

/* ---------------------------------------------------------------------------
   Selection controls — segmented tabs, chips, toggles.
--------------------------------------------------------------------------- */

/* The rounded-rectangle segmented control (Account/Settings, Alumni/Student/Faculty…).
   One pill travels between options on a spring (useSlidingPill) instead of
   the active option repainting in place. `memoryKey` keeps the glide alive
   across a remount (see motion.js). */
export const SegmentedControl = ({ options, value, onChange, rounded = 'rounded-xl', itemRounded = 'rounded-lg', memoryKey, className = '' }) => {
  const { t, isDark } = useTheme();
  const { trackRef, pillRef } = useSlidingPill(value, { memoryKey });
  return (
    <div ref={trackRef} className={`relative flex p-1 ${rounded} ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`} role="tablist">
      <span
        ref={pillRef}
        aria-hidden="true"
        className={`sliding-pill ${itemRounded} border ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white shadow-sm border-white'}`}
      />
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { id: opt, label: opt } : opt;
        const active = value === o.id;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            data-pill-key={o.id}
            data-pill-active={active}
            onClick={() => onChange(o.id)}
            className={`relative z-10 flex-1 py-2 ${itemRounded} border border-transparent text-xs font-extrabold transition-[color,transform] duration-300 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.97] ${
              active
                ? (isDark ? 'text-white' : 'text-black')
                : `text-gray-500 ${isDark ? 'hover:text-white' : 'hover:text-black'}`
            }`}
          >
            {o.label}
            {o.badge != null && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black transition-colors duration-300 ${active ? 'bg-[#1D9BF0] text-white' : 'bg-[#1D9BF0]/20 text-[#1D9BF0]'}`}>
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

export const ViewModeToggle = ({ value, onChange, memoryKey, className = '' }) => {
  const { t, isDark } = useTheme();
  const { trackRef, pillRef } = useSlidingPill(value, { memoryKey });
  return (
    <div ref={trackRef} role="radiogroup" aria-label="View mode" className={`relative inline-flex p-0.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`}>
      <span
        ref={pillRef}
        aria-hidden="true"
        className={`sliding-pill rounded-md border ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white shadow-sm border-white'}`}
      />
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
            data-pill-key={mode.id}
            data-pill-active={active}
            onClick={() => onChange(mode.id)}
            className={`relative z-10 w-8 h-7 rounded-md flex items-center justify-center border border-transparent transition-[color,transform] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-90 ${
              active
                ? (isDark ? 'text-white' : 'text-black')
                : `${t.textMuted} ${isDark ? 'hover:text-white' : 'hover:text-black'}`
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

/* iOS-style switch, same geometry as mobile. The knob glides on a spring
   and stretches while pressed (the iOS "squish"), growing toward the side
   it is about to leave so it never overflows the track. The squish keys
   off the named group `group/switch`, so a SwitchVisual inside a larger
   pressable (a whole settings strip) squishes when that strip is pressed. */
const SWITCH_SIZES = {
  md: { track: 'w-10 h-6', knob: 'w-4 h-4 group-active/switch:w-5', on: 'translate-x-4 group-active/switch:translate-x-3' },
  lg: { track: 'w-12 h-7', knob: 'w-5 h-5 group-active/switch:w-6', on: 'translate-x-5 group-active/switch:translate-x-4' },
};

export const SwitchVisual = ({ checked, color = 'bg-[#1D9BF0]', size = 'md', className = '' }) => {
  const { isDark } = useTheme();
  const dims = SWITCH_SIZES[size] || SWITCH_SIZES.md;
  return (
    <span
      aria-hidden="true"
      className={`${dims.track} rounded-full flex items-center px-1 shrink-0 transition-colors duration-300 ease-out ${checked ? color : (isDark ? 'bg-white/20' : 'bg-gray-300')} ${className}`}
    >
      <span className={`${dims.knob} switch-knob block bg-white rounded-full shadow-sm ${checked ? dims.on : 'translate-x-0'}`} />
    </span>
  );
};

export const Toggle = ({ checked, onChange, color = 'bg-[#1D9BF0]', size = 'md', label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={(e) => { e.stopPropagation(); onChange && onChange(); }}
    className="group/switch rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
  >
    <SwitchVisual checked={checked} color={color} size={size} />
  </button>
);

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

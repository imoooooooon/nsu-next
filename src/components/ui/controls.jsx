import { LayoutGrid, List } from 'lucide-react';
import { useSlidingPill } from './motion';

/* ---------------------------------------------------------------------------
   Selection controls for the mobile prototype — the same geometry and motion
   as the web app's `components/ui/controls.jsx` (SegmentedControl,
   ViewModeToggle, Toggle), taking `t` / `isDark` as props like every other
   mobile component.
--------------------------------------------------------------------------- */

/* Segmented tabs with one pill that glides to the chosen option.
   `options`: strings or { id, label, badge }. */
export const SegmentedPill = ({
  options, value, onChange, t, isDark,
  rounded = 'rounded-xl', itemRounded = 'rounded-lg', textSize = 'text-xs',
  memoryKey, ariaLabel, className = '',
}) => {
  const { trackRef, pillRef } = useSlidingPill(value, { memoryKey });
  return (
    <div ref={trackRef} role="tablist" aria-label={ariaLabel} className={`relative flex p-1 ${rounded} ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} ${className}`}>
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
            type="button"
            role="tab"
            aria-selected={active}
            data-pill-key={o.id}
            data-pill-active={active}
            onClick={() => onChange(o.id)}
            className={`relative z-10 flex-1 min-w-0 py-2 ${itemRounded} border border-transparent ${textSize} font-extrabold transition-[color,transform] duration-300 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.97] ${
              active ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'
            }`}
          >
            <span className="truncate">{o.label}</span>
            {o.badge > 0 && (
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

/* Card ⇄ list switch for growing collections — icon-only, one size down. */
const VIEW_MODES = [
  { id: 'card', label: 'Card view', icon: LayoutGrid },
  { id: 'list', label: 'List view', icon: List },
];

export const ViewModeSwitch = ({ value, onChange, t, isDark, memoryKey, className = '' }) => {
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
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={mode.label}
            data-pill-key={mode.id}
            data-pill-active={active}
            onClick={() => onChange(mode.id)}
            className={`relative z-10 w-8 h-7 rounded-md flex items-center justify-center border border-transparent transition-[color,transform] duration-300 active:scale-90 ${
              active ? (isDark ? 'text-white' : 'text-black') : t.textMuted
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        );
      })}
    </div>
  );
};

/* iOS switch visual. The knob glides on a spring and stretches while pressed
   (keyed off the named group `group/switch` on whatever element is the real
   control — a row, a strip, or the switch itself). */
const SWITCH_SIZES = {
  md: { track: 'w-10 h-6', knob: 'w-4 h-4 group-active/switch:w-5', on: 'translate-x-4 group-active/switch:translate-x-3' },
  lg: { track: 'w-12 h-7', knob: 'w-5 h-5 group-active/switch:w-6', on: 'translate-x-5 group-active/switch:translate-x-4' },
};

export const SwitchVisual = ({ checked, isDark, color = 'bg-[#1D9BF0]', size = 'md', className = '' }) => {
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

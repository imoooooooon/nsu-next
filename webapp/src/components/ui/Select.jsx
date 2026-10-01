import { Children, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Select — the product's ONE dropdown.

   Native <select> menus are drawn by the operating system: square corners,
   system font, a bright system-blue highlight — they looked like a different
   product (client revision). Every dropdown now opens the same panel as the
   app's filter menus (DropdownPanel / DropdownItem): rounded-xl glass-white
   (or #1A1A1A) panel, p-2, rounded-lg rows, the selected row solid #1D9BF0
   with a check.

   · Trigger keeps the input geometry (h-12 rounded-xl, bold value, chevron
     that turns over while open), so a form row of inputs and selects lines up.
   · The panel renders in a portal with fixed positioning, so a modal's
     overflow or a card's rounded clip can never cut it off, and it opens
     UPWARD when there isn't room below.
   · Keyboard is the native contract: ↑/↓/Home/End move, Enter/Space choose,
     Esc closes, letters jump to the next match; focus stays on the trigger
     (aria-activedescendant), role=listbox/option for screen readers.

   API: `options` ([{ value, label }] or strings), controlled `value` or
   uncontrolled `defaultValue`, `onChange(value)`. `SelectInput` below keeps
   the old <option>-children API for existing call sites.
--------------------------------------------------------------------------- */

const MAX_PANEL = 264; // ~7 rows, then the list scrolls
const ROW = 40;

const normalize = (options) =>
  options.map(o => (o !== null && typeof o === 'object' ? { value: String(o.value), label: o.label ?? String(o.value) } : { value: String(o), label: String(o) }));

export const Select = ({
  options: rawOptions, value, defaultValue, onChange, placeholder = 'Select…',
  id, className = '', disabled = false, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy,
}) => {
  const { t, isDark } = useTheme();
  const options = normalize(rawOptions || []);
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue !== undefined ? String(defaultValue) : options[0]?.value);
  const current = isControlled ? String(value) : inner;
  const selectedIndex = options.findIndex(o => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const typeahead = useRef({ text: '', timer: null });
  const listId = useId();

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const needed = Math.min(MAX_PANEL, options.length * ROW + 16) + 8;
    const below = window.innerHeight - r.bottom;
    const up = below < needed && r.top > below;
    setPos({
      left: r.left,
      width: Math.max(r.width, 176),
      top: up ? undefined : r.bottom + 8,
      bottom: up ? window.innerHeight - r.top + 8 : undefined,
      up,
      font: getComputedStyle(el).fontFamily,
    });
  }, [options.length]);

  const openList = (start) => {
    if (disabled) return;
    place();
    setActive(start ?? (selectedIndex >= 0 ? selectedIndex : 0));
    setOpen(true);
  };
  const closeList = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const commit = (index) => {
    const opt = options[index];
    if (!opt) return;
    if (!isControlled) setInner(opt.value);
    if (opt.value !== current) onChange?.(opt.value);
    closeList();
  };

  /* Outside click closes; scroll/resize re-anchors (the list's own scroll
     included — harmless, it re-measures the same trigger). */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target) || listRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (open && active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const jumpTo = (char) => {
    const ta = typeahead.current;
    clearTimeout(ta.timer);
    ta.text += char.toLowerCase();
    ta.timer = setTimeout(() => { ta.text = ''; }, 600);
    const from = open ? active : selectedIndex;
    const order = [...options.slice(from + 1), ...options.slice(0, from + 1)];
    const hit = order.find(o => o.label.toLowerCase().startsWith(ta.text))
      || order.find(o => o.label.toLowerCase().startsWith(char.toLowerCase()));
    if (!hit) return;
    const idx = options.indexOf(hit);
    if (open) setActive(idx); else openList(idx);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); }
      else if (e.key.length === 1 && /\S/.test(e.key)) jumpTo(e.key);
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive(i => Math.min(options.length - 1, i + 1)); break;
      case 'ArrowUp': e.preventDefault(); setActive(i => Math.max(0, i - 1)); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(options.length - 1); break;
      case 'Enter':
      case ' ': e.preventDefault(); commit(active); break;
      case 'Escape': e.preventDefault(); e.stopPropagation(); closeList(); break;
      case 'Tab': closeList(false); break;
      default: if (e.key.length === 1 && /\S/.test(e.key)) jumpTo(e.key);
    }
  };

  const optionId = (i) => `${listId}-opt-${i}`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onKeyDown}
        className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-4 pr-10 text-left text-sm font-bold ${t.text} outline-none transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1D9BF0]/30 disabled:opacity-50 disabled:cursor-not-allowed ${open ? 'ring-2 ring-[#1D9BF0]/30' : ''} ${className}`}
      >
        <span className={`block truncate ${selectedIndex < 0 ? t.textMuted : ''}`}>{selectedIndex >= 0 ? options[selectedIndex].label : placeholder}</span>
        <ChevronDown
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted} pointer-events-none transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
        />
      </button>

      {open && pos && createPortal(
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: MAX_PANEL, fontFamily: pos.font }}
          className={`fixed z-[300] overflow-y-auto overscroll-contain hide-scrollbar rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border shadow-2xl p-2 space-y-0.5 animate-scale-up ${pos.up ? 'origin-bottom' : 'origin-top'}`}
        >
          {options.map((opt, i) => {
            const isSelected = i === selectedIndex;
            const isActive = i === active;
            return (
              <li
                key={opt.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(i)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1D9BF0] text-white'
                    : `${t.text} ${isActive ? (isDark ? 'bg-white/10' : 'bg-gray-100') : ''}`
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
};

/* The old API: <SelectInput value|defaultValue onChange={(e) => e.target.value}>
   <option value>label</option>…</SelectInput>. Same component underneath. */
export const SelectInput = ({ children, onChange, ...rest }) => {
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map(child => {
      const label = Children.toArray(child.props.children).join('');
      return { value: String(child.props.value ?? label), label };
    });
  return (
    <Select
      options={options}
      onChange={onChange ? (v) => onChange({ target: { value: v } }) : undefined}
      {...rest}
    />
  );
};

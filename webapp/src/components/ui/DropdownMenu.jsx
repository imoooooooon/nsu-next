import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   DropdownMenu — the small anchored popover used for filters and chat menus.
   Wrap the trigger and menu in a relative parent; this component renders the
   floating panel. Closes on outside click / Escape.
--------------------------------------------------------------------------- */

export const DropdownPanel = ({ onClose, align = 'right', width = 'w-44', className = '', children }) => {
  const { isDark } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose && onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute top-full ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} mt-2 ${width} rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border shadow-2xl z-50 p-2 animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
};

export const DropdownHeading = ({ children }) => {
  const { t } = useTheme();
  return (
    <h4 className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 px-2 pt-1`}>{children}</h4>
  );
};

export const DropdownItem = ({ label, icon: Icon, selected = false, destructive = false, onClick }) => {
  const { isDark, t } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
        selected
          ? 'bg-[#1D9BF0] text-white'
          : destructive
            ? `text-red-500 ${isDark ? 'hover:bg-white/10' : 'hover:bg-red-50'}`
            : `${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${t.text}`
      }`}
    >
      <span className="flex items-center">
        {Icon && <Icon className={`w-4 h-4 mr-2.5 ${destructive ? 'text-red-500' : selected ? 'text-white' : t.textMuted}`} strokeWidth={2.5} />}
        {label}
      </span>
      {selected && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />}
    </button>
  );
};

export const DropdownDivider = () => {
  const { t } = useTheme();
  return <div className={`my-1 border-t ${t.borderSoft}`}></div>;
};

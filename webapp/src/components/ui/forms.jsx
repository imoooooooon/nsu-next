import { Search, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Form primitives — labels, inputs, selects, textareas, search.
   Geometry and voice identical to the mobile app (h-12 rounded-xl inputs,
   uppercase micro-labels, bold values).
--------------------------------------------------------------------------- */

export const FieldLabel = ({ children, className = '' }) => {
  const { t } = useTheme();
  return (
    <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block ${className}`}>
      {children}
    </label>
  );
};

export const Field = ({ label, hint, children }) => (
  <div>
    {label && <FieldLabel>{label}</FieldLabel>}
    {children}
    {hint && <FieldHint>{hint}</FieldHint>}
  </div>
);

export const FieldHint = ({ tone = 'warning', children }) => (
  <p className={`text-[10px] font-bold mt-1.5 ml-1 ${tone === 'warning' ? 'text-yellow-500' : 'text-gray-400'}`}>{children}</p>
);

export const TextInput = ({ icon: Icon, className = '', ...rest }) => {
  const { t } = useTheme();
  return (
    <div className="relative group">
      {Icon && <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} group-focus-within:text-[#1D9BF0] w-4 h-4 transition-colors pointer-events-none`} strokeWidth={2.5} />}
      <input
        className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm placeholder:font-bold ${className}`}
        {...rest}
      />
    </div>
  );
};

/* SelectInput lives in ./Select.jsx — the product's one custom dropdown. */

export const TextArea = ({ className = '', ...rest }) => {
  const { t } = useTheme();
  return (
    <textarea
      className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} outline-none transition-all focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm resize-none placeholder:font-bold ${className}`}
      {...rest}
    />
  );
};

export const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', height = 'h-11', rounded = 'rounded-lg', className = '', ...rest }) => {
  const { t, isDark } = useTheme();
  return (
    <div className={`relative w-full ${className}`}>
      <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 pointer-events-none`} strokeWidth={2.5} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${t.inputBg} border ${t.inputBorder} ${rounded} ${height} pl-10 ${value && onClear ? 'pr-10' : 'pr-4'} text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
        {...rest}
      />
      {value && onClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'} ${t.textMuted} active:scale-90 transition-transform`}
        >
          <X className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

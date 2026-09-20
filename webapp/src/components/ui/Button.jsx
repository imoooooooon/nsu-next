import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Buttons — the four voices of the design system.
   primary  → solid #1D9BF0 (main CTAs)
   secondary→ glass card + border (neutral actions)
   danger   → solid red (emergency / destructive CTAs)
   success  → solid emerald (confirmed states)
   ghost    → text-only accent
--------------------------------------------------------------------------- */

const SIZES = {
  sm: 'h-10 px-4 rounded-lg text-[13px]',
  md: 'h-12 px-5 rounded-xl text-sm',
  lg: 'h-14 px-6 rounded-xl text-[15px]',
};

export const Button = ({
  variant = 'primary', size = 'lg', full = false, icon: Icon, disabled = false,
  className = '', children, ...rest
}) => {
  const { t, isDark } = useTheme();

  const variants = {
    primary: 'bg-[#1D9BF0] text-white shadow-sm hover:bg-[#1A8CD8]',
    secondary: `${t.card} border ${t.border} ${t.text} shadow-sm hover:border-[#1D9BF0]/30`,
    soft: `bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 shadow-sm hover:bg-[#1D9BF0]/15`,
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
    success: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
    neutral: `${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} shadow-sm`,
    ghost: `text-[#1D9BF0] hover:underline`,
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-extrabold transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${SIZES[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" strokeWidth={2.5} />}
      {children}
    </button>
  );
};

/* The square glass icon button used in every header of the mobile app. */
export const IconButton = ({ icon: Icon, label, size = 'md', active = false, badge = null, className = '', iconClassName = '', ...rest }) => {
  const { t } = useTheme();
  const sizes = { sm: 'w-9 h-9 rounded-lg', md: 'w-10 h-10 rounded-lg', lg: 'w-11 h-11 rounded-xl' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-5 h-5' };
  return (
    <button
      aria-label={label}
      title={label}
      className={`relative ${sizes[size]} flex items-center justify-center ${t.card} border ${active ? 'border-[#1D9BF0]/50 text-[#1D9BF0]' : `${t.borderSoft} ${t.text}`} shadow-sm transition-all active:scale-95 hover:border-[#1D9BF0]/40 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${className}`}
      {...rest}
    >
      <Icon className={`${iconSizes[size]} ${active ? 'text-[#1D9BF0]' : ''} ${iconClassName}`} strokeWidth={2.5} />
      {badge != null && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1D9BF0] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );
};

/* The round floating action button (bottom-right on mobile, kept for parity). */
export const Fab = ({ icon: Icon, label, className = '', ...rest }) => (
  <button
    aria-label={label}
    title={label}
    className={`w-14 h-14 bg-[#1D9BF0] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1D9BF0]/40 active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    {...rest}
  >
    <Icon className="w-6 h-6" strokeWidth={2.5} />
  </button>
);

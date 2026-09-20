import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   Feedback & structure — section headings, empty states, toast.
--------------------------------------------------------------------------- */

export const SectionHeading = ({ title, action, onAction, size = 'lg', className = '' }) => {
  const { t } = useTheme();
  return (
    <div className={`flex justify-between items-end mb-4 ${className}`}>
      <h3 className={`${size === 'lg' ? 'text-lg' : 'text-base'} font-extrabold ${t.text} tracking-tight`}>{title}</h3>
      {action && (
        <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={onAction}>{action}</button>
      )}
    </div>
  );
};

export const MicroHeading = ({ children, className = '' }) => {
  const { t } = useTheme();
  return (
    <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 ${className}`}>{children}</h3>
  );
};

export const EmptyState = ({ icon: Icon, title, subtitle, action, onAction, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-16 opacity-60 animate-fade-in text-center ${className}`}>
    {Icon && <Icon className="w-12 h-12 mb-3" strokeWidth={1.5} />}
    <p className="text-sm font-bold">{title}</p>
    {subtitle && <p className="text-xs font-medium mt-1 max-w-xs">{subtitle}</p>}
    {action && (
      <button onClick={onAction} className="mt-4 text-[#1D9BF0] font-extrabold text-sm hover:underline opacity-100">
        {action}
      </button>
    )}
  </div>
);

/* Global toast pill — rendered once by the app shell, fed by useAppState. */
export const Toast = () => {
  const { isDark } = useTheme();
  const { toastMsg } = useAppState();
  if (!toastMsg) return null;
  return (
    <div className="fixed bottom-28 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up pointer-events-none">
      <div className={`px-5 py-2.5 rounded-full shadow-xl shadow-black/10 text-xs font-bold transition-colors whitespace-nowrap ${isDark ? 'bg-white text-black' : 'bg-[#1A1A1A] text-white'}`}>
        {toastMsg}
      </div>
    </div>
  );
};

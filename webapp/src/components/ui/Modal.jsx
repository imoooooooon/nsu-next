import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Modal — the web translation of the mobile bottom sheet.
   < sm  → slides up from the bottom (identical feel to the mobile app)
   ≥ sm  → centered dialog with backdrop blur
   Renders in-place with fixed positioning; parent state controls mounting.
--------------------------------------------------------------------------- */

export const Modal = ({ onClose, title, size = 'md', showClose = true, bodyClassName = '', children }) => {
  const { t, isDark } = useTheme();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widths[size]} max-h-[92vh] sm:max-h-[85vh] flex flex-col ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up sm:animate-scale-up border ${t.borderSoft} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-3 shrink-0 sm:hidden`}></div>
        {(title || showClose) && (
          <div className="flex justify-between items-center px-6 pt-4 sm:pt-5 pb-2 shrink-0">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center active:scale-95 transition-transform`}
              >
                <X className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
        <div className={`flex-1 overflow-y-auto px-6 pb-6 pt-2 ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  );
};

/* Action sheet — list of actions; bottom sheet on mobile, compact centered card on desktop. */
export const ActionSheetModal = ({ title, actions, onClose }) => {
  const { t, isDark } = useTheme();
  return (
    <Modal onClose={onClose} size="sm" showClose={false}>
      {title && <p className={`pb-2 text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider truncate`}>{title}</p>}
      <div className="space-y-1 pb-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <action.icon className={`w-5 h-5 ${action.isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
            <span className={`text-sm font-bold ${action.isDestructive ? 'text-red-500' : t.text}`}>{action.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-3.5 mt-2 text-center font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} rounded-xl active:scale-[0.98] transition-transform`}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

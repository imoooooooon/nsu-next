import { ArrowUpRight } from 'lucide-react';
export const SeekingDetailRow = (props) => {
  const { label, value, t, isDark } = props;
  const Icon = props.icon;
  return (
  <div className="flex items-start gap-3">
    <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
      <Icon className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>{label}</p>
      <p className={`text-xs font-extrabold ${t.text} mt-0.5 break-words`}>{value}</p>
    </div>
  </div>
  );
};

export const SeekingLinkRow = (props) => {
  const { label, onClick, t, isDark } = props;
  const Icon = props.icon;
  return (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/[0.03] hover:bg-black/[0.06]'} border ${t.borderSoft} transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
  >
    <Icon className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
    <span className={`text-xs font-extrabold ${t.text} flex-1 text-left`}>{label}</span>
    <ArrowUpRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
  </button>
  );
};

export const SeekingActionSheet = ({ title, actions, onClose, t, isDark }) => (
  <>
    <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
    <div className={`absolute bottom-0 left-0 w-full rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-[61] animate-slide-up border-t ${t.borderSoft} pb-8`}>
      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-3" />
      {title && <p className={`px-5 pb-2 text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider truncate`}>{title}</p>}
      <div className="px-3 pb-2 space-y-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <action.icon className={`w-5 h-5 ${action.isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
            <span className={`text-sm font-bold ${action.isDestructive ? 'text-red-500' : t.text}`}>{action.label}</span>
          </button>
        ))}
      </div>
      <div className="px-3">
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-3.5 text-center font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} rounded-xl active:scale-[0.98] transition-transform`}
        >
          Cancel
        </button>
      </div>
    </div>
  </>
);

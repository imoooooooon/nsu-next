import { ArrowUpRight } from 'lucide-react';

/* ---------------------------------------------------------------------------
   Seeking primitives — ported 1:1 from the mobile prototype.
   (The mobile SeekingActionSheet is intentionally not ported; the web app
   uses the shared ActionSheetModal primitive instead.)
--------------------------------------------------------------------------- */

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

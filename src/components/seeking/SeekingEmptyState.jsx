export const SeekingEmptyState = (props) => {
  const { title, description, actions, t, isDark } = props;
  const Icon = props.icon;
  return (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in">
    <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/[0.04]'} border ${t.borderSoft} flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${t.textMuted}`} strokeWidth={2} />
    </div>
    <h4 className={`text-sm font-extrabold ${t.text} mb-1.5`}>{title}</h4>
    {description && <p className={`text-xs font-bold ${t.textMuted} leading-relaxed max-w-[260px]`}>{description}</p>}
    {actions?.length > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              action.primary
                ? 'bg-[#1D9BF0] text-white shadow-sm'
                : `${t.card} border ${t.border} ${t.text}`
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
  );
};

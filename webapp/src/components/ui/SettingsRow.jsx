import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { Toggle } from './controls';

/* The settings list row (icon + label + value/toggle/chevron) — 1:1 port of
   the mobile SettingsItem. Stack inside a Card with padded={false}. */
export const SettingsRow = ({ icon: Icon, label, value, isToggle, toggleState, onToggle, isDestructive, onClick }) => {
  const { t, isDark } = useTheme();
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 border-b ${t.borderSoft} last:border-0 ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors cursor-pointer group`}
    >
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2} />
        <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : t.text}`}>{label}</span>
      </div>
      <div className="flex items-center">
        {value && <span className={`text-xs font-bold ${t.textMuted} mr-2`}>{value}</span>}
        {isToggle ? (
          <Toggle checked={toggleState} onChange={onToggle} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${t.textMuted} group-hover:${t.text} transition-colors`} strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
};

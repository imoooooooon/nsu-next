import { MessageSquare } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* Index route of /messages — the resting state of the desktop reading pane. */
export default function ChatEmptyState() {
  const { t, isDark } = useTheme();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
      <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white'} border flex items-center justify-center shadow-sm mb-5`}>
        <MessageSquare className={`w-9 h-9 ${t.textMuted}`} strokeWidth={1.5} />
      </div>
      <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-1.5`}>Your Messages</h3>
      <p className={`text-xs font-bold ${t.textMuted} max-w-[260px] leading-relaxed`}>
        Select a conversation to start chatting with your verified NSU network.
      </p>
    </div>
  );
}

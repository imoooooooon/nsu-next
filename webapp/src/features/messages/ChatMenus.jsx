import { Reply, Copy, Edit, Trash2 } from 'lucide-react';

/* ---------------------------------------------------------------------------
   Chat context menus — 1:1 ports of the mobile ChatReactionMenu and
   ChatMessageActionsMenu (../src/App.jsx). Rendered absolutely inside a
   `relative` message bubble wrapper while that message is being long-pressed.
--------------------------------------------------------------------------- */

export const CHAT_REACTION_EMOJI = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export const ChatReactionMenu = ({ align, msgId, reactions, onReact, isDark }) => (
  <div className={`absolute bottom-full mb-2 ${align === 'right' ? 'right-0 origin-bottom-right' : 'left-0 origin-bottom-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-full px-3 py-2 flex items-center space-x-3 z-[60] animate-fade-in-up`}>
    {CHAT_REACTION_EMOJI.map(emoji => (
      <button
        key={emoji}
        type="button"
        aria-label={`React with ${emoji}`}
        className={`text-[24px] hover:scale-125 hover:-translate-y-1 active:scale-95 transition-all drop-shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded-full ${reactions[msgId] === emoji ? 'scale-125 -translate-y-1' : ''}`}
        onClick={(e) => { e.stopPropagation(); onReact(msgId, emoji); }}
      >
        {emoji}
      </button>
    ))}
  </div>
);

export const ChatMessageActionsMenu = ({ align, isOwn, onDismiss, t, isDark }) => {
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const itemClass = `w-full flex items-center space-x-3 px-3 py-2 rounded-xl ${hoverBg} transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`;
  return (
    <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-2xl p-1.5 flex flex-col z-[60] min-w-[140px] animate-fade-in-up`}>
      <button type="button" onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={itemClass}>
        <Reply className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
        <span className={`text-xs font-bold ${t.text}`}>Reply</span>
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={itemClass}>
        <Copy className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
        <span className={`text-xs font-bold ${t.text}`}>Copy</span>
      </button>
      {isOwn && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={itemClass}>
            <Edit className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
            <span className={`text-xs font-bold ${t.text}`}>Edit</span>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'} transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] group`}>
            <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2.5} />
            <span className="text-xs font-bold text-red-500">Unsend</span>
          </button>
        </>
      )}
    </div>
  );
};

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft, MoreVertical, User, Plus, Send, CheckCheck, MessageSquare,
  Camera, Image as ImageIcon, FileText, MapPin, Archive, VolumeX, Pin, Trash2
} from 'lucide-react';
import {
  DropdownPanel, DropdownItem
} from '../../components/ui';
import { ChatReactionMenu, ChatMessageActionsMenu } from '../../features/messages/ChatMenus';
import { findConversationById } from '../../data/conversations';
import DepartmentChannelView from '../../features/messages/DepartmentChannelView';
import { getViewerDepartmentId } from '../../lib/departmentAccess';
import { getRoleStyles } from '../../lib/roleStyles';
import { SEEKING_MESSAGE_PROMPTS } from '../../features/seeking/constants';
import { getSeekingCategoryStyle } from '../../features/seeking/utils';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /messages/:chatId — the mobile ChatOverlay as a route inside the reading
   pane. `:chatId === 'new'` is the Seeking-Work hand-off, driven by chatContext.
--------------------------------------------------------------------------- */

const ATTACHMENTS = [
  { icon: Camera, label: 'Camera' },
  { icon: ImageIcon, label: 'Photo' },
  { icon: FileText, label: 'Document' },
  { icon: MapPin, label: 'Location' },
];

/* The emoji bubble that hangs off a reacted message. Declared at module scope
   so it keeps its identity across renders of the thread. */
const ReactionPill = ({ emoji, side = 'right', isDark, onClick }) => {
  if (!emoji) return null;
  return (
    <div
      onClick={onClick}
      className={`absolute -bottom-3 ${side === 'right' ? 'right-0' : 'left-0'} px-2.5 py-1 min-w-[36px] ${isDark ? 'bg-[#1E1E1E] border-white/20' : 'bg-white border-gray-200'} border rounded-full shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all`}
    >
      <span className="text-[13px] leading-none drop-shadow-sm">{emoji}</span>
    </div>
  );
};

export default function ChatView() {
  const { chatId } = useParams();
  const { t, isDark } = useTheme();
  const { authRole, chatContext, setChatContext, showToast } = useAppState();
  const navigate = useNavigate();

  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reactingTo, setReactingTo] = useState(null);
  const [composerText, setComposerText] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [reactions, setReactions] = useState({ 'msg-1': '👍', 'msg-2': '👍', 'msg-3': '❤️' });

  const pressTimer = useRef(null);
  const attachmentRef = useRef(null);
  const threadEndRef = useRef(null);

  const isHandoff = chatId === 'new';
  const conversation = isHandoff ? null : findConversationById(chatId, getViewerDepartmentId(authRole));
  const seekingHandoff = isHandoff ? chatContext?.seeking : null;
  const emergencyHandoff = isHandoff ? chatContext?.emergency : null;

  useEffect(() => {
    const onDown = (e) => {
      if (attachmentRef.current && !attachmentRef.current.contains(e.target)) setIsAttachmentOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sentMessages.length]);

  /* Long-press (or right-click) opens the reaction menu. The message id rides
     on the element's data attribute so these handlers stay stable and nothing
     reads a ref during render. */
  const handlePressStart = useCallback((e) => {
    const msgId = e.currentTarget.dataset.msgId;
    pressTimer.current = setTimeout(() => setReactingTo(msgId), 500);
  }, []);

  const handlePressEnd = useCallback(() => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setReactingTo(e.currentTarget.dataset.msgId);
  }, []);

  /* Deep links to a thread that no longer exists fall back to the list. */
  if (isHandoff && !chatContext) return <Navigate to="/messages" replace />;
  if (!isHandoff && !conversation) return <Navigate to="/messages" replace />;

  /* Department channels are asymmetric (broadcast down, help desk up), so they
     own their own view rather than bending the symmetric DM thread. */
  if (conversation && conversation.deptId) {
    return <DepartmentChannelView conversation={conversation} />;
  }

  const peerName = isHandoff ? (chatContext.peer?.name || 'NSU Student') : conversation.name;
  const peerRole = isHandoff ? (chatContext.peer?.role || 'Student') : conversation.role;
  const peerSubtitle = isHandoff ? (chatContext.peer?.subtitle || 'NSU') : conversation.subtitle;
  const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles(peerRole, isDark);

  const handleReaction = (msgId, emoji) => {
    setReactions(prev => {
      const next = { ...prev };
      if (next[msgId] === emoji) delete next[msgId];
      else next[msgId] = emoji;
      return next;
    });
    setReactingTo(null);
  };

  const handleSend = () => {
    if (!composerText.trim()) return;
    setSentMessages(prev => [...prev, {
      id: `sent-${Date.now()}`,
      text: composerText.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }]);
    setComposerText('');
  };

  const pressHandlers = {
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onTouchMove: handlePressEnd,
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseLeave: handlePressEnd,
    onContextMenu: handleContextMenu,
  };

  return (
    <div className="flex flex-col h-full min-h-0 animate-fade-in">
      {/* ------------------------------------------------------- header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${t.borderSoft} shrink-0 ${isDark ? 'bg-white/[0.02]' : 'bg-white/40'}`}>
        <div className="flex items-center min-w-0">
          <button
            onClick={() => { setChatContext(null); navigate('/messages'); }}
            aria-label="Back to messages"
            className={`lg:hidden mr-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors hover:opacity-80 shrink-0`}
          >
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className={`w-10 h-10 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center mr-3 relative shrink-0 shadow-sm`}>
            <User className={`w-5 h-5 ${colorClass}`} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 min-w-0">
              <h2 className={`text-base font-extrabold ${t.text} leading-tight truncate`}>{peerName}</h2>
              <RoleIcon className={`w-3.5 h-3.5 ${colorClass} shrink-0`} strokeWidth={2.5} />
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
              <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{peerSubtitle}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></span>
              <span className="text-[10px] font-extrabold text-[#1D9BF0] shrink-0">Active now</span>
            </div>
          </div>
        </div>

        <div className="relative shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            aria-label="Conversation options"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-colors`}
          >
            <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
          {isMenuOpen && (
            <DropdownPanel onClose={() => setIsMenuOpen(false)} width="w-48">
              <DropdownItem icon={Archive} label="Archive Chat" onClick={() => { setIsMenuOpen(false); showToast('Chat archived'); }} />
              <DropdownItem icon={VolumeX} label="Mute Notifications" onClick={() => { setIsMenuOpen(false); showToast('Notifications muted'); }} />
              <DropdownItem icon={Pin} label="Pin Chat" onClick={() => { setIsMenuOpen(false); showToast('Chat pinned'); }} />
              <DropdownItem icon={Trash2} label="Delete Chat" destructive onClick={() => { setIsMenuOpen(false); showToast('Chat deleted'); navigate('/messages'); }} />
            </DropdownPanel>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------ messages */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 relative">
        {reactingTo && (
          <div className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] transition-all" onClick={() => setReactingTo(null)}></div>
        )}

        <div className="max-w-3xl mx-auto flex flex-col space-y-4">
          {emergencyHandoff && (
            <div className={`rounded-2xl p-4 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-500">Emergency support</p>
              <p className={`mt-1 text-sm font-extrabold ${t.text}`}>{emergencyHandoff.headline}</p>
              {emergencyHandoff.phone && <p className={`mt-2 text-xs ${t.textMuted}`}>Contact number: <span className={`select-all font-bold ${t.text}`}>{emergencyHandoff.phone}</span></p>}
              <p className={`mt-3 text-xs leading-relaxed ${t.textMuted}`}>Start your conversation with {peerName} about this blood request.</p>
            </div>
          )}
          {seekingHandoff && (
            <>
              <div className={`shrink-0 rounded-2xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} animate-fade-in`}>
                <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-1`}>Regarding</p>
                <p className={`text-sm font-extrabold ${t.text} leading-tight`}>{seekingHandoff.headline}</p>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(seekingHandoff.category, isDark)}`}>
                  {seekingHandoff.category}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-70">
                <MessageSquare className={`w-10 h-10 ${t.textMuted} mb-3`} strokeWidth={1.5} />
                <p className={`text-xs font-bold ${t.textMuted} max-w-[240px] leading-relaxed`}>
                  This is the start of your conversation with {peerName.split(' ')[0]}.
                </p>
              </div>
            </>
          )}

          {!isHandoff && (
            <>
              <div className="flex items-center justify-center my-2 space-x-4 opacity-70">
                <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Today</span>
                <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
              </div>

              {/* image message */}
              <div className={`self-start max-w-[80%] lg:max-w-[70%] relative group mb-2 select-none ${reactingTo === 'msg-1' ? 'z-50' : ''}`} data-msg-id="msg-1" {...pressHandlers}>
                {reactingTo === 'msg-1' && <ChatReactionMenu align="left" msgId="msg-1" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
                {reactingTo === 'msg-1' && <ChatMessageActionsMenu align="left" isOwn={false} onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
                <div className="relative w-fit">
                  <div className={`relative rounded-[24px] rounded-tl-sm overflow-hidden shadow-sm border ${t.borderSoft} w-[220px] h-[220px] bg-[#F3E5F5] dark:bg-[#2A1B30] flex items-center justify-center`}>
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                      alt="Sent attachment"
                      className="w-full h-full object-cover z-10 relative"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <ImageIcon className="w-8 h-8 opacity-20 absolute" />
                  </div>
                  <ReactionPill emoji={reactions['msg-1']} side="right" isDark={isDark} onClick={(e) => { e.stopPropagation(); setReactingTo('msg-1'); }} />
                </div>
                <span className={`text-[10px] font-bold ${t.textMuted} mt-4 ml-1 block`}>11:30 AM</span>
              </div>

              {/* incoming text */}
              <div className={`self-start max-w-[80%] lg:max-w-[70%] relative group mb-2 select-none ${reactingTo === 'msg-2' ? 'z-50' : ''}`} data-msg-id="msg-2" {...pressHandlers}>
                {reactingTo === 'msg-2' && <ChatReactionMenu align="left" msgId="msg-2" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
                {reactingTo === 'msg-2' && <ChatMessageActionsMenu align="left" isOwn={false} onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
                <div className="relative w-fit">
                  <div className={`p-3.5 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} shadow-sm backdrop-blur-md`}>
                    <p className={`text-sm font-medium ${t.text} leading-relaxed`}>I reviewed the architectural proposals you sent over. Let's sync on the database schema before the sprint starts.</p>
                  </div>
                  <ReactionPill emoji={reactions['msg-2']} side="right" isDark={isDark} onClick={(e) => { e.stopPropagation(); setReactingTo('msg-2'); }} />
                </div>
                <span className={`text-[10px] font-bold ${t.textMuted} mt-4 ml-1 block`}>11:32 AM</span>
              </div>

              {/* outgoing reply */}
              <div className={`self-end max-w-[80%] lg:max-w-[70%] relative mt-4 select-none ${reactingTo === 'msg-3' ? 'z-50' : ''}`} data-msg-id="msg-3" {...pressHandlers}>
                {reactingTo === 'msg-3' && <ChatReactionMenu align="right" msgId="msg-3" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
                {reactingTo === 'msg-3' && <ChatMessageActionsMenu align="right" isOwn onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
                <div className="relative w-fit ml-auto">
                  <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/30 text-left">
                    <div className="bg-black/15 rounded-lg p-2.5 mb-2 border-l-[3px] border-white">
                      <p className="text-[10px] font-extrabold text-white mb-0.5">{peerName}</p>
                      <p className="text-[11px] text-white/90 line-clamp-1 font-medium">I reviewed the architectural proposals you sent...</p>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">Perfect. I'll prepare the diagrams. Are you free at 2 PM?</p>
                  </div>
                  <ReactionPill emoji={reactions['msg-3']} side="left" isDark={isDark} onClick={(e) => { e.stopPropagation(); setReactingTo('msg-3'); }} />
                </div>
                <div className="flex justify-end items-center mt-4 space-x-1 mr-1">
                  <span className={`text-[10px] font-bold ${t.textMuted}`}>11:42 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={2.5} />
                </div>
              </div>

              {sentMessages.length === 0 && (
                <div className="self-start max-w-[80%] mt-2">
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} flex items-center space-x-1 w-fit`}>
                    <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* messages sent in this session */}
          {sentMessages.map(msg => (
            <div key={msg.id} className="self-end max-w-[80%] lg:max-w-[70%] animate-fade-in-up">
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/30 w-fit ml-auto">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
              <div className="flex justify-end items-center mt-2 space-x-1 mr-1">
                <span className={`text-[10px] font-bold ${t.textMuted}`}>{msg.time}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={2.5} />
              </div>
            </div>
          ))}

          <div ref={threadEndRef} />
        </div>
      </div>

      {/* ------------------------------------------------------ composer */}
      <div className={`p-4 border-t ${t.borderSoft} relative z-20 shrink-0 ${isDark ? 'bg-white/[0.02]' : 'bg-white/40'}`} ref={attachmentRef}>
        <div className="max-w-3xl mx-auto">
          {seekingHandoff && !composerText.trim() && (
            <div className="flex space-x-2 overflow-x-auto hide-scrollbar mb-3 -mx-1 px-1">
              {SEEKING_MESSAGE_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setComposerText(prompt)}
                  className={`px-3 py-2 rounded-full text-[11px] font-extrabold border shrink-0 transition-all active:scale-95 ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end space-x-2 relative z-40">
            <div className="relative shrink-0">
              {isAttachmentOpen && (
                <div className={`absolute bottom-full left-0 mb-3 p-2 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95 shadow-black/40' : 'bg-white/95 shadow-black/5'} backdrop-blur-xl border ${t.borderSoft} shadow-xl z-40 flex flex-col space-y-1 animate-fade-in-up origin-bottom-left min-w-[160px]`}>
                  {ATTACHMENTS.map((item) => (
                    <button
                      key={item.label}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-colors w-full text-left active:scale-[0.98]`}
                      onClick={() => { setIsAttachmentOpen(false); showToast(`${item.label} picker (demo)`); }}
                    >
                      <item.icon className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
                      <span className={`text-sm font-bold ${t.text}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setIsAttachmentOpen(o => !o)}
                aria-label="Add attachment"
                className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-sm active:scale-95 transition-all duration-300 ${
                  isAttachmentOpen ? 'bg-[#1D9BF0] text-white border-transparent' : `${t.card} border ${t.border} ${t.text} hover:opacity-80`
                }`}
              >
                <Plus className={`w-5 h-5 transition-transform duration-300 ${isAttachmentOpen ? 'rotate-45' : ''}`} strokeWidth={2.5} />
              </button>
            </div>

            <div className={`flex-1 ${t.card} border ${t.border} rounded-lg flex items-center px-3 min-h-[40px] shadow-inner`}>
              <textarea
                placeholder="Message..."
                rows="1"
                aria-label="Message"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className={`w-full bg-transparent text-sm font-bold ${t.text} focus:outline-none resize-none py-2.5 max-h-24`}
              />
            </div>

            <button
              onClick={handleSend}
              aria-label="Send message"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/40 active:scale-95 transition-transform hover:bg-[#1A8CD8]"
            >
              <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

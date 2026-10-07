import { publicState, restricted } from '../../shared/adminBridge';
import { useAdminBridge } from '../../shared/useAdminBridge';
import { useDepartmentState, updateDepartmentState } from '../../shared/departmentStore';
import { useState } from 'react';
import {
  ArrowLeft, Send, Lock, Megaphone, LifeBuoy, Mail, MailCheck, AlertTriangle,
  Info, VolumeX, Volume2, Building2, User, MoreVertical, Plus,
} from 'lucide-react';
import { EntityAvatar, DepartmentSheet } from './DepartmentPrimitives';
import { getDepartmentAccess, formatCount } from './access';
import { SwitchVisual } from '../ui/controls';
import { departmentBroadcasts } from './data';

/* ---------------------------------------------------------------------------
   The department's two asymmetric channels (brief flows §1 and §2).

   'broadcast'       — read-only for members, composer + Dual-Broadcast for admins
   'helpdesk'        — the member's private 1-on-1 with the department
   'helpdesk-thread' — the same thread from the admin's side

   Broadcast messages are NOT chat bubbles. A notice from the registrar is not
   a remark in a conversation, and styling it like one is what makes students
   scroll past it. They render as full-width announcement cards carrying the
   author, the time and — when it went out by email — an explicit mark, so the
   channel doubles as its own audit trail.
--------------------------------------------------------------------------- */

const AnnouncementCard = ({ notice, isOwn, t, isDark }) => {
  const isUrgent = notice.emailed;
  return (
    <div
      className={`w-full rounded-2xl border p-4 animate-fade-in ${
        isUrgent
          ? (isDark ? 'bg-red-500/[0.07] border-red-500/25' : 'bg-red-50/70 border-red-200')
          : (isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white/70 border-white')
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isUrgent
            ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
            : (isDark ? 'bg-[#1D9BF0]/15 text-[#1D9BF0]' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]')
        }`}>
          <Megaphone className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-extrabold ${t.text} leading-snug`}>{notice.title}</h4>
          <p className={`text-sm font-medium ${t.text} opacity-80 leading-relaxed mt-1.5 whitespace-pre-wrap break-words`}>
            {notice.body}
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-3">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>
              {isOwn ? 'You' : notice.author}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
            <span className={`text-[10px] font-bold ${t.textMuted}`}>{notice.time}</span>
            {notice.emailed && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                  <MailCheck className="w-3 h-3" strokeWidth={3} /> Also emailed
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DepartmentChannelOverlay = ({
  dept, channelKind, thread, authRole, t, isDark,
  sentBroadcasts, onSendBroadcast, isMuted, onToggleMute,
  onBack, onOpenHub, onManage, onToast,
}) => {
  useAdminBridge();
  const [text, setText] = useState('');
  const [emailArmed, setEmailArmed] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sharedState = useDepartmentState();
  const replyKey = thread?.id || `${dept.id}-${channelKind}`;
  const replies = sharedState.replies[replyKey] || [];
  const setReplies = updater => updateDepartmentState(s => ({ ...s, replies: { ...s.replies, [replyKey]: updater(s.replies[replyKey] || []) } }));

  const access = getDepartmentAccess(dept, authRole);
  const isBroadcast = channelKind === 'broadcast';
  const isAdminThread = channelKind === 'helpdesk-thread';
  const canWrite = isBroadcast ? access.canBroadcast : !isAdminThread || access.canHelpDesk;

  const history = (departmentBroadcasts[dept.id] || []).filter(m => !restricted(publicState(), 'broadcast', m.id));
  const sessionBroadcasts = (sentBroadcasts || []).filter(m => !restricted(publicState(), 'broadcast', m.id));

  /* The email toggle is deliberately not sticky: it resets after every send,
     so urgency is opted into per message rather than left switched on. */
  const commitBroadcast = (emailed) => {
    if (!access.canBroadcast || !text.trim()) return;
    const body = text.trim();
    const firstLine = body.split('\n')[0];
    onSendBroadcast(dept.id, {
      id: `bc-${Date.now()}`,
      title: firstLine.length > 70 ? `${firstLine.slice(0, 67)}…` : firstLine,
      body,
      author: 'You',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      emailed,
    });
    setText('');
    setEmailArmed(false);
    setIsConfirmOpen(false);
    onToast(emailed ? `Sent + emailed to ${formatCount(dept.emailReach)} members` : 'Broadcast sent to the channel');
  };

  const handleSend = () => {
    if (!text.trim() || !canWrite) return;
    if (isBroadcast) {
      if (emailArmed) { setIsConfirmOpen(true); return; }
      commitBroadcast(false);
      return;
    }
    setReplies(prev => [...prev, {
      id: `r-${Date.now()}`,
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }]);
    setText('');
  };

  if (isAdminThread && !access.canHelpDesk) return <div className={`absolute inset-0 z-[70] p-6 ${t.bg} ${t.text}`}><p>Help Desk access is required.</p><button onClick={onBack} className="text-[#1D9BF0] mt-4">Back to messages</button></div>;

  const headerTitle = isAdminThread ? thread.name : (isBroadcast ? `${dept.code} Department` : `${dept.code} Help Desk`);
  const headerSub = isAdminThread
    ? `${thread.subtitle} · writing to ${dept.code}`
    : (isBroadcast ? `Official broadcast · ${formatCount(dept.memberCount)} members` : 'Ask the department directly');

  return (
    <div className={`absolute inset-0 z-[70] flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className={`absolute top-[20%] left-[-20%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-30'}`} />
      </div>

      {/* ---------------------------------------------------------- header */}
      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b relative z-30 shrink-0`}>
        <div className="flex items-center min-w-0">
          <button onClick={onBack} aria-label="Back to messages" className={`mr-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} shrink-0`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>

          {isAdminThread ? (
            <div className={`w-10 h-10 rounded-full bg-[#1D9BF0]/10 border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center mr-3 shrink-0`}>
              <User className="w-5 h-5 text-[#1D9BF0]" strokeWidth={1.5} />
            </div>
          ) : (
            <EntityAvatar dept={dept} size="sm" isDark={isDark} className="mr-3" />
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 min-w-0">
              <h2 className={`text-base font-extrabold ${t.text} leading-tight truncate`}>{headerTitle}</h2>
              {isBroadcast
                ? <Megaphone className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />
                : <LifeBuoy className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
              <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{headerSub}</span>
              {isMuted && (
                <span className={`text-[10px] font-extrabold ${t.textMuted} shrink-0 inline-flex items-center gap-1`}>
                  <VolumeX className="w-3 h-3" strokeWidth={3} /> Muted
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <button onClick={() => setIsMenuOpen(o => !o)} aria-label="Channel options" className={`w-10 h-10 flex items-center justify-center rounded-lg`}>
            <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className={`absolute top-full right-0 mt-2 p-2 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95' : 'bg-white/95'} backdrop-blur-xl border ${t.borderSoft} shadow-xl z-50 flex flex-col space-y-1 animate-fade-in-up origin-top-right min-w-[190px]`}>
                <button
                  onClick={() => { setIsMenuOpen(false); onOpenHub(dept); }}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl active:scale-[0.98] transition-transform w-full text-left`}
                >
                  <Building2 className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                  <span className={`text-sm font-bold ${t.text}`}>Open {dept.code} Hub</span>
                </button>
                {isBroadcast && (
                  <button
                    onClick={() => { setIsMenuOpen(false); onToggleMute(dept); }}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl active:scale-[0.98] transition-transform w-full text-left`}
                  >
                    {isMuted
                      ? <Volume2 className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                      : <VolumeX className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />}
                    <span className={`text-sm font-bold ${t.text}`}>{isMuted ? 'Unmute Channel' : 'Mute Channel'}</span>
                  </button>
                )}
                {access.canHelpDesk && (
                  <button
                    onClick={() => { setIsMenuOpen(false); onManage(dept); }}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl active:scale-[0.98] transition-transform w-full text-left`}
                  >
                    <Info className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                    <span className={`text-sm font-bold ${t.text}`}>Manage Department</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col relative z-10">
        {isBroadcast ? (
          <>
            {/* Auto-enrolment stated plainly, once, at the top of the channel. */}
            <div className={`shrink-0 rounded-2xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft}`}>
              <div className="flex items-start gap-3">
                <Info className={`w-4 h-4 ${t.textMuted} shrink-0 mt-0.5`} strokeWidth={2.5} />
                <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
                  {access.canBroadcast
                    ? `Every ${dept.code} student, alumnus and faculty member is enrolled in this channel and cannot leave it. Post only what the whole department needs.`
                    : `You are enrolled in this channel as a member of ${dept.code}. Official notices land here, and urgent ones also reach your registered email.`}
                </p>
              </div>
            </div>

            {history.length === 0 && sessionBroadcasts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 opacity-60">
                <Megaphone className={`w-10 h-10 ${t.textMuted} mb-3`} strokeWidth={1.5} />
                <p className={`text-xs font-bold ${t.textMuted}`}>No notices yet.</p>
              </div>
            ) : (
              <>
                {history.map(notice => (
                  <AnnouncementCard key={notice.id} notice={notice} t={t} isDark={isDark} />
                ))}
                {sessionBroadcasts.map(notice => (
                  <AnnouncementCard key={notice.id} notice={notice} isOwn t={t} isDark={isDark} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            <div className={`shrink-0 rounded-2xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft}`}>
              <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-1`}>
                {isAdminThread ? 'Help Desk · incoming' : `${dept.code} Help Desk`}
              </p>
              <p className={`text-xs font-bold ${t.text} leading-relaxed opacity-90`}>
                {isAdminThread
                  ? `You are replying as ${dept.code} Department. ${thread.name} sees the department, not your personal account.`
                  : 'This is a private conversation with the department. An authorized department teammate will reply — usually within one working day.'}
              </p>
            </div>

            {isAdminThread && (
              <div className="self-start max-w-[85%]">
                <div className={`p-3.5 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} shadow-sm`}>
                  <p className={`text-sm font-medium ${t.text} leading-relaxed`}>{thread.msg}</p>
                </div>
                <span className={`text-[10px] font-bold ${t.textMuted} mt-1.5 ml-1 block`}>{thread.time}</span>
              </div>
            )}

            {!isAdminThread && replies.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-70">
                <LifeBuoy className={`w-10 h-10 ${t.textMuted} mb-3`} strokeWidth={1.5} />
                <p className={`text-xs font-bold ${t.textMuted} max-w-[250px] leading-relaxed`}>
                  Ask about registration, advising, transcripts or anything else the department handles.
                </p>
              </div>
            )}

            {replies.map(msg => (
              <div key={msg.id} className="self-end max-w-[85%] animate-fade-in-up">
                <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/30 w-fit ml-auto">
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                <div className="flex justify-end items-center mt-1.5 mr-1">
                  <span className={`text-[10px] font-bold ${t.textMuted}`}>{msg.time}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* -------------------------------------------------------- composer */}
      <div className={`p-4 ${t.glass} border-t relative z-20 shrink-0`}>
        {!canWrite ? (
          /* The read-only state explains the rule rather than just disabling
             the field — a greyed-out box with no reason reads as a bug, and
             the first thing a student does is tap it repeatedly. */
          <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/[0.04]'} border ${t.borderSoft}`}>
            <Lock className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
            <p className={`text-xs font-bold ${t.textMuted} flex-1 leading-snug`}>
              Only admins can send messages here.
            </p>
          </div>
        ) : (
          <>
            {/* Dual-Broadcast: the toggle sits with the Send controls, off by
                default, and says its blast radius in words when armed. */}
            {isBroadcast && (
              <button
                type="button"
                onClick={() => setEmailArmed(v => !v)}
                aria-pressed={emailArmed}
                className={`group/switch w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border mb-3 transition-all text-left active:scale-[0.99] ${
                  emailArmed
                    ? (isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200')
                    : (isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/[0.06]')
                }`}
              >
                <Mail className={`w-4 h-4 shrink-0 ${emailArmed ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-extrabold ${emailArmed ? (isDark ? 'text-red-300' : 'text-red-700') : t.text}`}>
                    Send to Registered Email
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 ${emailArmed ? (isDark ? 'text-red-300/80' : 'text-red-600') : t.textMuted}`}>
                    {emailArmed
                      ? `Also emails ${formatCount(dept.emailReach)} members`
                      : 'Off — this notice appears in the app only'}
                  </p>
                </div>
                <SwitchVisual checked={emailArmed} isDark={isDark} color="bg-red-500" />
              </button>
            )}

            <div className="flex items-end space-x-2">
              {!isBroadcast && (
                <button
                  onClick={() => onToast('Attachment picker (demo)')}
                  aria-label="Add attachment"
                  className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg ${t.card} border ${t.border} ${t.text} shadow-sm active:scale-95 transition-transform`}
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}

              <div className={`flex-1 ${t.card} border ${emailArmed ? 'border-red-400/60' : t.border} rounded-lg flex items-center px-3 min-h-[40px] shadow-inner transition-colors`}>
                <textarea
                  rows="1"
                  aria-label={isBroadcast ? 'Broadcast message' : 'Message'}
                  placeholder={isBroadcast ? `Post a notice to all ${dept.code} members...` : 'Message...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`w-full bg-transparent text-sm font-bold ${t.text} focus:outline-none resize-none py-2.5 max-h-24`}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!text.trim()}
                aria-label={emailArmed ? 'Send broadcast and email' : 'Send message'}
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-white active:scale-95 transition-all disabled:opacity-40 ${
                  emailArmed ? 'bg-red-600 shadow-md shadow-red-600/40' : 'bg-[#1D9BF0] shadow-md shadow-[#1D9BF0]/40'
                }`}
              >
                <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
              </button>
            </div>

            {isBroadcast && (
              <p className={`text-[10px] font-bold ${t.textMuted} mt-2 px-1`}>
                Posting as {dept.code} Department · reaches {formatCount(dept.memberCount)} members
              </p>
            )}
          </>
        )}
      </div>

      {/* The confirm step that stands between one tap and twelve thousand inboxes. */}
      {isConfirmOpen && (
        <DepartmentSheet title="Send as email too?" onClose={() => setIsConfirmOpen(false)} t={t} isDark={isDark}>
          <div className="space-y-5">
            <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                This posts to the channel <span className="font-black">and emails {formatCount(dept.emailReach)} registered
                addresses</span> — every student and alumnus of {dept.code}. It cannot be recalled.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft}`}>
              <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-1.5`}>Your message</p>
              <p className={`text-sm font-medium ${t.text} leading-relaxed whitespace-pre-wrap break-words`}>{text}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className={`flex-1 h-12 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-[0.97] transition-transform`}
              >
                Back to editing
              </button>
              <button
                onClick={() => commitBroadcast(true)}
                className="flex-1 h-12 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center active:scale-[0.97] transition-transform"
              >
                <Mail className="w-4 h-4 mr-2" strokeWidth={2.5} /> Send + Email
              </button>
            </div>
          </div>
        </DepartmentSheet>
      )}
    </div>
  );
};

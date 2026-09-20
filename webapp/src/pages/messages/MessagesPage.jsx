import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Filter, Settings, X, MessageSquare, User, Pin as PinIcon, Megaphone, LifeBuoy,
  Archive, VolumeX, Volume2, Pin, MailOpen, Trash2, AlertTriangle, Info, FileText
} from 'lucide-react';
import { PageContainer } from '../../components/layout/AppShell';
import {
  IconButton, Card, SearchInput, SegmentedControl, EmptyState, Modal, MicroHeading, SettingsRow,
  DropdownPanel, DropdownHeading, DropdownItem, DropdownDivider, ActionSheetModal
} from '../../components/ui';
import { EntityAvatar } from '../../features/departments/DepartmentPrimitives';
import { globalConversations, getDepartmentChannels, getHelpDeskThreads } from '../../data/conversations';
import { findDepartmentById } from '../../data/departments';
import { getRoleStyles } from '../../lib/roleStyles';
import { getDepartmentAccess, VIEWER_DEPARTMENT_ID } from '../../lib/departmentAccess';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /messages — desktop split view (list + reading pane), mobile single pane.

   The department hub adds two rows every member has from day one: the
   read-only Broadcast channel and their Help Desk thread. Both are pinned
   above the DMs — a university notice that sorts below a classmate's "lol"
   is a notice nobody reads. Admins additionally get a Help Desk segment
   holding the incoming student threads, kept out of their personal DMs.
--------------------------------------------------------------------------- */

const MessageSettingsModal = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  return (
    <Modal onClose={onClose} title="Message Settings" size="sm">
      <div className="space-y-6 pb-2">
        <Card padded={false} className="overflow-hidden">
          <SettingsRow
            icon={Volume2}
            label="Notification Sound"
            isToggle
            toggleState={soundEnabled}
            onToggle={() => setSoundEnabled(v => !v)}
          />
          <SettingsRow icon={Archive} label="Archived Chats" />
        </Card>

        <div>
          <MicroHeading>Support and Legal</MicroHeading>
          <Card padded={false} className="overflow-hidden">
            <SettingsRow icon={AlertTriangle} label="Report Technical Problem" />
            <SettingsRow icon={Info} label="Help" />
            <SettingsRow icon={FileText} label="Legal and Policies" />
          </Card>
        </div>
      </div>
    </Modal>
  );
};

/* One row in the list. Entities render as rounded squares, people as circles —
   the distinction that lets you tell an official notice from a classmate at a
   glance without reading a word. */
const ConversationRow = ({ chat, isActive, onOpen, onContextMenu }) => {
  const { t, isDark } = useTheme();
  const isEntity = chat.kind === 'broadcast' || chat.kind === 'helpdesk';
  const dept = isEntity ? findDepartmentById(chat.deptId) : null;
  const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles(chat.role, isDark);

  return (
    <div
      onClick={() => onOpen(chat)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(chat); }}
      className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer mb-1 group select-none ${
        isActive
          ? `${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'}`
          : `border-transparent ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
      }`}
    >
      <div className="relative shrink-0">
        {isEntity ? (
          <EntityAvatar dept={dept} size="md" />
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shadow-sm`}>
              <User className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
            </div>
            {chat.online && (
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 ${isDark ? 'border-[#121212]' : 'border-white'} rounded-full transition-colors`}></div>
            )}
          </>
        )}
      </div>

      <div className="flex-1 min-w-0 ml-3">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center space-x-1.5 truncate pr-2">
            <h4 className={`text-sm ${chat.unread ? 'font-extrabold' : 'font-bold'} ${t.text} truncate`}>{chat.name}</h4>
            {isEntity ? (
              chat.kind === 'broadcast'
                ? <Megaphone className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />
                : <LifeBuoy className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />
            ) : (
              <RoleIcon className={`w-3.5 h-3.5 ${colorClass} shrink-0`} strokeWidth={2.5} />
            )}
            {chat.pinned && <PinIcon className={`w-3 h-3 ${t.textMuted} shrink-0`} strokeWidth={2.5} />}
          </div>
          <span className={`${chat.unread ? 'text-[#1D9BF0] font-extrabold' : `${t.textMuted} font-bold`} text-[10px] shrink-0`}>{chat.time}</span>
        </div>
        <p className={`text-xs truncate ${chat.unread ? `font-bold ${t.text}` : `${t.textMuted} font-medium`}`}>{chat.msg}</p>
        {isEntity && (
          <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mt-1 truncate`}>{chat.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default function MessagesPage() {
  const { t, isDark } = useTheme();
  const { showToast, setChatContext, authRole, toggleChannelMute, mutedChannelIds } = useAppState();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [segment, setSegment] = useState('All Chats');
  const [search, setSearch] = useState('');
  const [chatFilter, setChatFilter] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contextMenuChat, setContextMenuChat] = useState(null);

  const viewerDept = findDepartmentById(VIEWER_DEPARTMENT_ID);
  const access = getDepartmentAccess(viewerDept, authRole);

  /* Auto-enrolment, expressed as data: the channels are simply in the list. */
  const deptChannels = getDepartmentChannels(VIEWER_DEPARTMENT_ID);
  const helpDeskThreads = access.isAdmin ? getHelpDeskThreads(VIEWER_DEPARTMENT_ID) : [];
  const waitingCount = helpDeskThreads.filter(x => x.unread).length;

  const segments = access.isAdmin
    ? ['All Chats', { id: 'Requests', label: 'Requests', badge: 1 }, { id: 'Help Desk', label: 'Help Desk', badge: waitingCount || undefined }]
    : ['All Chats', { id: 'Requests', label: 'Requests', badge: 1 }];

  let displayedChats;
  if (segment === 'Help Desk') {
    displayedChats = helpDeskThreads;
  } else if (segment === 'Requests') {
    displayedChats = globalConversations.filter(c => c.isRequest);
  } else {
    displayedChats = [...deptChannels, ...globalConversations.filter(c => !c.isRequest)];
  }

  if (chatFilter && segment !== 'Help Desk') {
    if (chatFilter === 'Unread') displayedChats = displayedChats.filter(c => c.unread);
    else if (chatFilter === 'Departments') displayedChats = displayedChats.filter(c => c.deptId);
    else displayedChats = displayedChats.filter(c => c.role === chatFilter);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    displayedChats = displayedChats.filter(c => c.name.toLowerCase().includes(q) || c.msg.toLowerCase().includes(q));
  }

  const openChat = (chat) => {
    setChatContext(null);
    navigate(`/messages/${chat.id}`);
  };

  /* A broadcast channel you are auto-enrolled in offers Mute, never Leave —
     leaving would break the university's only guaranteed reach. */
  const contextActions = !contextMenuChat ? [] : contextMenuChat.kind === 'broadcast'
    ? [
        {
          icon: mutedChannelIds.has(contextMenuChat.id) ? Volume2 : VolumeX,
          label: mutedChannelIds.has(contextMenuChat.id) ? 'Unmute Channel' : 'Mute Channel',
          onClick: () => { toggleChannelMute(contextMenuChat.id); setContextMenuChat(null); },
        },
        { icon: Info, label: 'View Department Hub', onClick: () => { const id = contextMenuChat.deptId; setContextMenuChat(null); navigate(`/departments/${id}`); } },
      ]
    : [
        { icon: Archive, label: 'Archive', onClick: () => { setContextMenuChat(null); showToast('Chat archived'); } },
        { icon: VolumeX, label: 'Mute Notifications', onClick: () => { setContextMenuChat(null); showToast('Notifications muted'); } },
        { icon: Pin, label: 'Pin Chat', onClick: () => { setContextMenuChat(null); showToast('Chat pinned'); } },
        { icon: MailOpen, label: contextMenuChat.unread ? 'Mark as Read' : 'Mark as Unread', onClick: () => { setContextMenuChat(null); showToast('Conversation updated'); } },
        { icon: Trash2, label: 'Delete', isDestructive: true, onClick: () => { setContextMenuChat(null); showToast('Chat deleted'); } },
      ];

  return (
    <PageContainer fullHeight className="animate-fade-in">
      <div className="lg:grid lg:grid-cols-[380px_1fr] gap-6 lg:h-[calc(100vh-4rem-3rem)] lg:py-6">
        {/* ------------------------------------------------- list pane */}
        <Card
          padded={false}
          className={`${chatId ? 'hidden lg:flex' : 'flex'} flex-col overflow-hidden min-h-0 h-full max-lg:mt-4`}
        >
          <div className={`px-4 pt-5 pb-3 border-b ${t.borderSoft} shrink-0`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-extrabold ${t.text} tracking-tight leading-tight`}>Messages</h2>
              <div className="flex items-center space-x-2">
                {chatFilter && (
                  <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#1D9BF0]/10'} border ${t.borderSoft} animate-fade-in`}>
                    <span className={`text-[10px] font-extrabold ${isDark ? 'text-white' : 'text-[#1D9BF0]'} uppercase tracking-wider`}>{chatFilter}</span>
                    <button onClick={() => setChatFilter(null)} aria-label="Clear filter" className={`opacity-70 hover:opacity-100 ${isDark ? 'text-white' : 'text-[#1D9BF0]'}`}>
                      <X className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                )}
                <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                  <IconButton
                    icon={Filter}
                    label="Filter conversations"
                    size="sm"
                    active={!!chatFilter || isFilterOpen}
                    aria-haspopup="menu"
                    aria-expanded={isFilterOpen}
                    onClick={() => setIsFilterOpen(o => !o)}
                  />
                  {isFilterOpen && (
                    <DropdownPanel onClose={() => setIsFilterOpen(false)}>
                      <DropdownHeading>Filter By</DropdownHeading>
                      {['Unread', 'Departments', 'Student', 'Alumni', 'Faculty'].map(f => (
                        <DropdownItem
                          key={f}
                          label={f}
                          selected={chatFilter === f}
                          onClick={() => { setChatFilter(f); setIsFilterOpen(false); }}
                        />
                      ))}
                      <DropdownDivider />
                      <DropdownItem label="Clear Filter" destructive onClick={() => { setChatFilter(null); setIsFilterOpen(false); }} />
                    </DropdownPanel>
                  )}
                </div>
                <IconButton icon={Settings} label="Message settings" size="sm" onClick={() => setIsSettingsOpen(true)} />
              </div>
            </div>

            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search conversations..."
              className="mb-4"
            />

            <SegmentedControl options={segments} value={segment} onChange={setSegment} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            {segment === 'Help Desk' && displayedChats.length > 0 && (
              <p className={`px-2 pb-2 text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>
                Questions sent to {viewerDept?.code} — private, 1-on-1
              </p>
            )}

            {displayedChats.length > 0 ? displayedChats.map((chat) => (
              <ConversationRow
                key={chat.id}
                chat={chat}
                isActive={String(chatId) === String(chat.id)}
                onOpen={openChat}
                onContextMenu={setContextMenuChat}
              />
            )) : (
              <EmptyState
                icon={segment === 'Help Desk' ? LifeBuoy : MessageSquare}
                title={segment === 'Help Desk' ? 'No questions waiting' : 'No messages found'}
                subtitle={segment === 'Help Desk' ? 'Student questions to the department land here.' : undefined}
                className={t.text}
              />
            )}
          </div>
        </Card>

        {/* ---------------------------------------------- reading pane */}
        <Card
          padded={false}
          className={`${chatId ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden min-h-0 h-full max-lg:border-0 max-lg:shadow-none max-lg:bg-transparent`}
        >
          <Outlet />
        </Card>
      </div>

      {isSettingsOpen && <MessageSettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {contextMenuChat && (
        <ActionSheetModal
          title={contextMenuChat.name}
          actions={contextActions}
          onClose={() => setContextMenuChat(null)}
        />
      )}
    </PageContainer>
  );
}

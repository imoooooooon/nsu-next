import { useMemo, useState } from 'react';
import {
  ArrowLeft, ShieldCheck, KeyRound, UserPlus, Megaphone, LifeBuoy, Briefcase,
  Droplet, Copy, Users, Mail, ArrowUpRight, Trash2, Search, Check, Info, User,
  CalendarPlus,
} from 'lucide-react';
import { EntityAvatar, AccessBadge, DepartmentSheet } from './DepartmentPrimitives';
import { getDepartmentAccess, formatCount } from './access';
import { departmentHelpDeskThreads, departmentJobs } from './data';
import { SegmentedPill } from '../ui/controls';

/* ---------------------------------------------------------------------------
   The Official's / Admin's console (brief §2).

   Three sections, one screen. Broadcast and Help Desk are deliberately NOT
   duplicated here — they live in Messages, per the brief. This screen links
   to them.
--------------------------------------------------------------------------- */

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'access', label: 'Access' },
  { id: 'profile', label: 'Profile' },
];

/* At 430px a name, a role, an access badge and a destructive action cannot
   share one line — the name loses, and the name is the point. So the badge
   drops to its own line beneath the identity and only the action stays in
   the gutter. */
const FacultyRow = ({ person, badge, action, onClick, t, isDark }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]'} ${onClick ? 'active:scale-[0.99] transition-transform' : ''} text-left`}
    >
      <div className={`w-11 h-11 rounded-full shrink-0 ${isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10'} flex items-center justify-center`}>
        <User className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-[#800000]'}`} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-extrabold ${t.text} truncate`}>{person.name}</p>
        <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{person.role} · {person.dept}</p>
        {badge && <div className="mt-1.5">{badge}</div>}
      </div>
      {action}
    </Tag>
  );
};

export const DepartmentManageOverlay = ({
  dept, authRole, t, isDark,
  facultyData, findUserById,
  adminIds, aboutOverride, broadcastsSent,
  onBack, onGrantAccess, onRevokeAccess, onSaveAbout,
  onOpenChannel, onOpenHelpDeskInbox, onPostJob, onPostBlood, onCreateEvent,
  upcomingEventCount = 0, onToast,
}) => {
  const [section, setSection] = useState('overview');
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [grantSearch, setGrantSearch] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [aboutDraft, setAboutDraft] = useState(aboutOverride ?? dept.about);

  const access = getDepartmentAccess(dept, authRole);
  const official = findUserById(dept.officialId);
  const admins = (adminIds || []).map(findUserById).filter(Boolean);
  const helpDesk = departmentHelpDeskThreads[dept.id] || [];
  const openThreads = helpDesk.filter(x => x.unread).length;
  const jobs = departmentJobs[dept.id] || [];

  const excludedIds = [dept.officialId, ...(adminIds || [])].filter(Boolean);

  /* Only verified faculty of THIS department are eligible — the brief's "any
     verified faculty member within the department". The constraint lives in
     the candidate list, not in a warning after the fact. */
  const candidates = useMemo(() => {
    const q = grantSearch.trim().toLowerCase();
    return facultyData
      .filter(p => p.dept === dept.code && p.verified && !excludedIds.includes(p.id))
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  }, [facultyData, dept.code, excludedIds, grantSearch]);

  const tiles = [
    { icon: LifeBuoy, label: 'Waiting', value: openThreads },
    { icon: Users, label: 'Reach', value: formatCount(dept.memberCount) },
    { icon: Mail, label: 'Email reach', value: formatCount(dept.emailReach) },
    { icon: ShieldCheck, label: 'Admins', value: admins.length + 1 },
  ];

  const quickActions = [
    { icon: Megaphone, label: 'New Broadcast', hint: 'Post a notice to every member', onClick: () => onOpenChannel(dept, 'broadcast') },
    { icon: LifeBuoy, label: 'Open Help Desk', hint: `${openThreads} question${openThreads === 1 ? '' : 's'} waiting`, onClick: () => onOpenHelpDeskInbox(dept) },
    { icon: CalendarPlus, label: 'Create an Event', hint: 'Talk, workshop or showcase — on the campus calendar', onClick: () => onCreateEvent(dept) },
    { icon: Briefcase, label: 'Post a Job', hint: 'RA, TA or lab position', onClick: () => onPostJob(dept) },
    { icon: Droplet, label: 'Post Blood Request', hint: 'On behalf of a member', onClick: () => onPostBlood(dept), danger: true },
  ];

  return (
    <div className={`absolute inset-0 z-[65] flex flex-col animate-slide-up ${t.bg}`}>
      <div className={`px-4 pt-12 pb-3 flex items-center ${t.glass} border-b relative z-30 shrink-0`}>
        <button onClick={onBack} aria-label="Back" className={`mr-3 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} shrink-0`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className={`text-base font-extrabold ${t.text} truncate`}>Manage {dept.code}</h2>
          <p className={`text-[10px] font-bold ${t.textMuted} truncate`}>{dept.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 px-5 pt-5 pb-32">
        <div className={`rounded-2xl p-4 mb-5 ${t.card} border ${t.border} flex items-center gap-3`}>
          <EntityAvatar dept={dept} size="md" isDark={isDark} />
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-extrabold ${t.text} truncate`}>{dept.code} Department</p>
            <p className={`text-[10px] font-bold ${t.textMuted} mt-0.5`}>
              Signed in as {access.isOfficial ? 'the Department Official' : 'a Department Admin'}
            </p>
          </div>
          <AccessBadge level={access.level} isDark={isDark} />
        </div>

        <SegmentedPill
          options={SECTIONS}
          value={section}
          onChange={setSection}
          t={t}
          isDark={isDark}
          ariaLabel="Console section"
          className="mb-6"
        />

        {/* ----------------------------------------------------- overview */}
        {section === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {tiles.map(tile => (
                <div key={tile.label} className={`p-4 rounded-xl ${t.card} border ${t.border}`}>
                  <tile.icon className={`w-5 h-5 ${t.textMuted} mb-3`} strokeWidth={2.5} />
                  <p className={`text-xl font-extrabold tracking-tight ${t.text}`}>{tile.value}</p>
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mt-1`}>{tile.label}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3`}>Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl ${t.card} border ${t.border} text-left active:scale-[0.99] transition-transform`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      action.danger
                        ? (isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600')
                        : (isDark ? 'bg-[#1D9BF0]/15 text-[#1D9BF0]' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]')
                    }`}>
                      <action.icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-extrabold ${t.text}`}>{action.label}</p>
                      <p className={`text-[11px] font-bold ${t.textMuted} mt-0.5`}>{action.hint}</p>
                    </div>
                    <ArrowUpRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Published by this department</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.textMuted}`}>Broadcasts sent this session</span>
                  <span className={`text-sm font-extrabold ${t.text}`}>{broadcastsSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.textMuted}`}>Upcoming events</span>
                  <span className={`text-sm font-extrabold ${t.text}`}>{upcomingEventCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.textMuted}`}>Open positions live</span>
                  <span className={`text-sm font-extrabold ${t.text}`}>{jobs.length}</span>
                </div>
                <div className={`pt-3 border-t ${t.borderSoft}`}>
                  <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
                    Broadcast history is the audit trail — every notice, and whether it was also
                    emailed, stays in the channel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------- admin access */}
        {section === 'access' && (
          <div className="space-y-5 animate-fade-in">
            <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>The department team</h3>
                  <p className={`text-[11px] font-bold ${t.textMuted} mt-1`}>
                    {admins.length + 1} people can act on behalf of {dept.code}
                  </p>
                </div>
                {access.canGrantAccess && (
                  <button
                    onClick={() => setIsGrantOpen(true)}
                    className="h-10 px-4 rounded-lg bg-[#1D9BF0] text-white font-extrabold text-[13px] flex items-center shrink-0 active:scale-95 transition-transform"
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Grant
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {official && (
                  <FacultyRow
                    person={official}
                    t={t}
                    isDark={isDark}
                    badge={<AccessBadge level="official" isDark={isDark} />}
                  />
                )}

                {admins.map(person => (
                  <FacultyRow
                    key={person.id}
                    person={person}
                    t={t}
                    isDark={isDark}
                    badge={<AccessBadge level="admin" isDark={isDark} />}
                    action={access.canGrantAccess ? (
                      <button
                        onClick={() => setConfirmRevoke(person)}
                        aria-label={`Revoke Admin Access for ${person.name}`}
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-gray-400 active:scale-95 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    ) : null}
                  />
                ))}

                {admins.length === 0 && (
                  <p className={`text-xs font-bold ${t.textMuted} px-1 py-2 leading-relaxed`}>
                    No admins delegated yet. The Official is the only person who can act for this department.
                  </p>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>What each level can do</h3>
              <div className="space-y-4">
                {[
                  { level: 'official', icon: KeyRound, text: 'Holds the Department ID, edits the hub, and grants or revokes Admin Access. Cannot be revoked from inside the app.' },
                  { level: 'admin', icon: ShieldCheck, text: 'Broadcasts (including email blasts), answers the Help Desk, and posts jobs and blood requests as the department.' },
                ].map(row => (
                  <div key={row.level} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
                      <row.icon className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <AccessBadge level={row.level} isDark={isDark} />
                      <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed mt-1.5`}>{row.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!access.canGrantAccess && (
              <p className={`text-[11px] font-bold ${t.textMuted} px-1`}>
                Only the Department Official can change who holds Admin Access.
              </p>
            )}
          </div>
        )}

        {/* ----------------------------------------------- department profile */}
        {section === 'profile' && (
          <div className="space-y-5 animate-fade-in">
            {access.isOfficial && (
              <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Department ID</h3>
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDark ? 'bg-amber-400/10 border-amber-400/25' : 'bg-amber-50 border-amber-200'}`}>
                  <KeyRound className={`w-5 h-5 shrink-0 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} strokeWidth={2.5} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-extrabold tracking-tight ${t.text}`}>{dept.departmentId}</p>
                    <p className={`text-[10px] font-bold ${t.textMuted} mt-0.5 leading-relaxed`}>
                      The Official's master key. Required by the registrar for any records request.
                    </p>
                  </div>
                  <button
                    onClick={() => onToast('Department ID copied')}
                    aria-label="Copy department ID"
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} active:scale-95 transition-transform`}
                  >
                    <Copy className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
                <p className={`text-[11px] font-bold ${t.textMuted} mt-3 leading-relaxed`}>
                  Transferring the Official role is handled by the registrar, not in the app.
                </p>
              </div>
            )}

            <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Description</h3>
              <textarea
                rows="7"
                value={aboutDraft}
                disabled={!access.isOfficial}
                onChange={(e) => setAboutDraft(e.target.value)}
                placeholder="What should visitors know about this department?"
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} outline-none resize-none shadow-sm ${access.isOfficial ? '' : 'opacity-60'}`}
              />
              {access.isOfficial ? (
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => onSaveAbout(dept.id, aboutDraft.trim())}
                    disabled={aboutDraft.trim() === (aboutOverride ?? dept.about)}
                    className="h-10 px-4 rounded-lg bg-[#1D9BF0] text-white font-extrabold text-[13px] flex items-center disabled:opacity-40 active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Save
                  </button>
                  <button
                    onClick={() => setAboutDraft(aboutOverride ?? dept.about)}
                    className={`text-[11px] font-extrabold ${t.textMuted}`}
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <p className="text-[10px] font-bold mt-2 ml-1 text-yellow-500">
                  Only the Department Official can edit this.
                </p>
              )}
            </div>

            <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Channels</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${isDark ? 'bg-white/10 text-white border-white/15' : 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20'}`}>
                  Broadcast · auto-enrolled
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 border-white'}`}>
                  Help Desk · 1-on-1
                </span>
              </div>
              <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
                Both channels are permanent. Members are enrolled in the broadcast when their
                account is created and can mute it, but never leave it.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ grant access sheet */}
      {isGrantOpen && (
        <DepartmentSheet title="Grant Admin Access" onClose={() => { setIsGrantOpen(false); setGrantSearch(''); }} t={t} isDark={isDark}>
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.07] border-[#1D9BF0]/20'}`}>
              <Info className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className={`text-[11px] font-bold leading-relaxed ${t.text} opacity-90`}>
                An admin can broadcast to all {formatCount(dept.memberCount)} members, email them,
                answer the Help Desk and post on behalf of {dept.code}. They cannot grant access to anyone else.
              </p>
            </div>

            <div className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
              <input
                type="text"
                value={grantSearch}
                onChange={(e) => setGrantSearch(e.target.value)}
                placeholder={`Search verified ${dept.code} faculty...`}
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none shadow-sm placeholder:font-bold`}
              />
            </div>

            {candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-60 text-center">
                <Search className="w-10 h-10 mb-3" strokeWidth={1.5} />
                <p className={`text-sm font-bold ${t.text}`}>No eligible faculty</p>
                <p className={`text-xs font-medium ${t.textMuted} mt-1 max-w-[260px]`}>
                  Only verified faculty listed under {dept.code} can be granted Admin Access.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {candidates.map(person => (
                  <FacultyRow
                    key={person.id}
                    person={person}
                    t={t}
                    isDark={isDark}
                    onClick={() => { onGrantAccess(dept.id, person); setIsGrantOpen(false); setGrantSearch(''); }}
                    action={
                      <span className="text-[#1D9BF0] text-[11px] font-extrabold inline-flex items-center shrink-0">
                        <UserPlus className="w-3.5 h-3.5 mr-1" strokeWidth={3} /> Grant
                      </span>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </DepartmentSheet>
      )}

      {/* --------------------------------------------------- revoke confirm */}
      {confirmRevoke && (
        <DepartmentSheet title="Revoke Admin Access" onClose={() => setConfirmRevoke(null)} t={t} isDark={isDark}>
          <div className="space-y-5">
            <p className={`text-sm font-medium ${t.text} leading-relaxed opacity-90`}>
              <span className="font-extrabold">{confirmRevoke.name}</span> will immediately lose the
              ability to broadcast, email members and answer the {dept.code} Help Desk. Threads they
              already answered stay in the Help Desk.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRevoke(null)}
                className={`flex-1 h-12 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-[0.97] transition-transform`}
              >
                Cancel
              </button>
              <button
                onClick={() => { onRevokeAccess(dept.id, confirmRevoke); setConfirmRevoke(null); }}
                className="flex-1 h-12 rounded-xl bg-red-600 text-white font-extrabold text-sm active:scale-[0.97] transition-transform"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </DepartmentSheet>
      )}
    </div>
  );
};

import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ShieldCheck, KeyRound, UserPlus, Megaphone, LifeBuoy, Briefcase, Droplet,
  Copy, Building2, Users, Mail, ArrowUpRight, Trash2, Search, Check, Info,
} from 'lucide-react';
import { PageContainer, DetailHeader } from '../../components/layout/AppShell';
import {
  Card, Button, SegmentedControl, SearchInput, Modal, Field, TextArea,
  TextInput, EmptyState, MicroHeading, Pill,
} from '../../components/ui';
import { EntityAvatar, AccessBadge } from '../../features/departments/DepartmentPrimitives';
import { DepartmentBloodRequestModal } from '../../features/departments/DepartmentBloodRequestModal';
import {
  findDepartmentById, departmentHelpDeskThreads, departmentJobs,
} from '../../data/departments';
import { globalFacultyData, findUserById } from '../../data/people';
import {
  getDepartmentAccess, formatCount, broadcastChannelId, helpDeskChannelId,
} from '../../lib/departmentAccess';
import { getRoleStyles } from '../../lib/roleStyles';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /departments/:deptId/manage — the Official's / Admin's console (brief §2).

   One page, three sections. A wizard would be wrong: people come here to do
   one small thing (grant access, fix a phone number, fire off a notice) and
   leave. Broadcast and Help Desk are deliberately NOT duplicated here — they
   live in Messages, per the brief. This page links to them.
--------------------------------------------------------------------------- */

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'access', label: 'Admin Access' },
  { id: 'profile', label: 'Profile' },
];

/* ------------------------------------------------------------ people rows */

const FacultyRow = ({ person, trailing, onClick }) => {
  const { t, isDark } = useTheme();
  const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles('Faculty', isDark);
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]'} ${onClick ? `${isDark ? 'hover:bg-white/[0.07]' : 'hover:bg-black/[0.05]'} active:scale-[0.99] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]` : ''} text-left`}
    >
      <div className={`w-11 h-11 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shrink-0`}>
        <RoleIcon className={`w-5 h-5 ${colorClass}`} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-extrabold ${t.text} truncate`}>{person.name}</p>
        <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{person.role} · {person.dept}</p>
      </div>
      {trailing}
    </Tag>
  );
};

/* -------------------------------------------------- grant access modal */

const GrantAccessModal = ({ dept, excludedIds, onGrant, onClose }) => {
  const { t, isDark } = useTheme();
  const [search, setSearch] = useState('');

  /* Only verified faculty of THIS department are eligible — the brief's
     "any verified faculty member within the department". The constraint is
     enforced by the candidate list, not by a warning after the fact. */
  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return globalFacultyData
      .filter(p => p.dept === dept.code && p.verified && !excludedIds.includes(p.id))
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  }, [dept.code, excludedIds, search]);

  return (
    <Modal onClose={onClose} title="Grant Admin Access" size="md">
      <div className="space-y-4 pb-2">
        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.07] border-[#1D9BF0]/20'} border`}>
          <Info className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className={`text-[11px] font-bold leading-relaxed ${t.text} opacity-90`}>
            An admin can broadcast to all {formatCount(dept.memberCount)} members, email them,
            answer the Help Desk and post on behalf of {dept.code}. They cannot grant access to anyone else.
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder={`Search verified ${dept.code} faculty...`}
          aria-label="Search faculty"
        />

        {candidates.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No eligible faculty"
            subtitle={`Only verified faculty listed under ${dept.code} can be granted Admin Access.`}
            className={t.text}
          />
        ) : (
          <div className="space-y-2">
            {candidates.map(person => (
              <FacultyRow
                key={person.id}
                person={person}
                onClick={() => { onGrant(person); onClose(); }}
                trailing={
                  <span className="text-[#1D9BF0] text-[11px] font-extrabold inline-flex items-center shrink-0">
                    <UserPlus className="w-3.5 h-3.5 mr-1" strokeWidth={3} /> Grant
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

/* ------------------------------------------------------------------ page */

export default function DepartmentManagePage() {
  const { t, isDark } = useTheme();
  const {
    authRole, showToast, departmentAdminIds, grantDepartmentAdmin,
    revokeDepartmentAdmin, departmentAbout, updateDepartmentAbout, sentBroadcasts,
  } = useAppState();
  const navigate = useNavigate();
  const { deptId } = useParams();
  const close = useCloseTo(`/departments/${deptId}`);

  const dept = findDepartmentById(deptId);
  const [section, setSection] = useState('overview');
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [isBloodOpen, setIsBloodOpen] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(null);

  const access = getDepartmentAccess(dept, authRole);
  const aboutOverride = dept ? departmentAbout[dept.id] : undefined;
  const [aboutDraft, setAboutDraft] = useState(aboutOverride ?? dept?.about ?? '');

  if (!dept) return <Navigate to="/network?segment=Departments" replace />;
  /* Anyone without a seat at the table lands on the public hub instead. */
  if (!access.canManage) return <Navigate to={`/departments/${dept.id}`} replace />;

  const official = findUserById(dept.officialId);
  const adminIds = departmentAdminIds[dept.id] || [];
  const admins = adminIds.map(findUserById).filter(Boolean);
  const helpDesk = departmentHelpDeskThreads[dept.id] || [];
  const openThreads = helpDesk.filter(x => x.unread).length;
  const jobs = departmentJobs[dept.id] || [];
  const broadcastsSent = (sentBroadcasts[dept.id] || []).length;

  const excludedIds = [dept.officialId, ...adminIds].filter(Boolean);

  const tiles = [
    { icon: LifeBuoy, label: 'Help Desk waiting', value: openThreads, tone: openThreads > 0 ? 'text-[#1D9BF0]' : t.textMuted },
    { icon: Users, label: 'Broadcast reach', value: formatCount(dept.memberCount), tone: t.text },
    { icon: Mail, label: 'Email reach', value: formatCount(dept.emailReach), tone: t.text },
    { icon: ShieldCheck, label: 'Admins', value: admins.length + 1, tone: t.text },
  ];

  const quickActions = [
    { icon: Megaphone, label: 'New Broadcast', hint: 'Post a notice to every member', onClick: () => navigate(`/messages/${broadcastChannelId(dept.id)}`) },
    { icon: LifeBuoy, label: 'Open Help Desk', hint: `${openThreads} question${openThreads === 1 ? '' : 's'} waiting`, onClick: () => navigate(`/messages/${helpDeskChannelId(dept.id)}?view=admin`) },
    { icon: Briefcase, label: 'Post a Job', hint: 'RA, TA or lab position', onClick: () => navigate(`/jobs/post?as=${dept.id}`) },
    { icon: Droplet, label: 'Post Blood Request', hint: 'On behalf of a member', onClick: () => setIsBloodOpen(true), danger: true },
  ];

  return (
    <PageContainer className="animate-fade-in">
      <DetailHeader title={`Manage ${dept.code}`} subtitle={dept.name} onBack={close}>
        <Button variant="secondary" size="sm" icon={Building2} onClick={() => navigate(`/departments/${dept.id}`)}>
          View Hub
        </Button>
      </DetailHeader>

      <Card padded={false} className="p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <EntityAvatar dept={dept} size="lg" />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-extrabold ${t.text}`}>{dept.name}</p>
          <p className={`text-[11px] font-bold ${t.textMuted} mt-0.5`}>
            Signed in as {access.isOfficial ? 'the Department Official' : 'a Department Admin'}
          </p>
        </div>
        <AccessBadge level={access.level} className="shrink-0" />
      </Card>

      <SegmentedControl options={SECTIONS} value={section} onChange={setSection} className="mb-6 max-w-lg" />

      {/* ------------------------------------------------------- overview */}
      {section === 'overview' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map(tile => (
              <Card key={tile.label} padded={false} className="p-4">
                <tile.icon className={`w-5 h-5 ${t.textMuted} mb-3`} strokeWidth={2.5} />
                <p className={`text-2xl font-extrabold tracking-tight ${tile.tone}`}>{tile.value}</p>
                <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mt-1`}>{tile.label}</p>
              </Card>
            ))}
          </div>

          <div>
            <MicroHeading>Quick Actions</MicroHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${t.card} border ${t.border} text-left transition-all hover:-translate-y-0.5 active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <MicroHeading className="!mb-0">Latest Help Desk</MicroHeading>
                <button
                  onClick={() => navigate(`/messages/${helpDeskChannelId(dept.id)}?view=admin`)}
                  className="text-[#1D9BF0] text-[11px] font-extrabold hover:underline"
                >
                  Open inbox
                </button>
              </div>
              {helpDesk.length === 0 ? (
                <p className={`text-xs font-bold ${t.textMuted}`}>No questions yet.</p>
              ) : (
                <div className="space-y-2">
                  {helpDesk.slice(0, 3).map(thread => (
                    <button
                      key={thread.id}
                      onClick={() => navigate(`/messages/${thread.id}`)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-black/[0.02] hover:bg-black/[0.04]'} transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-extrabold ${t.text} truncate`}>{thread.name}</p>
                          {thread.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] shrink-0" />}
                        </div>
                        <p className={`text-[11px] font-medium ${t.textMuted} mt-1 line-clamp-2`}>{thread.msg}</p>
                      </div>
                      <span className={`text-[10px] font-bold ${t.textMuted} shrink-0`}>{thread.time}</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <MicroHeading>Published by this department</MicroHeading>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.textMuted}`}>Broadcasts sent this session</span>
                  <span className={`text-sm font-extrabold ${t.text}`}>{broadcastsSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.textMuted}`}>Open positions live</span>
                  <span className={`text-sm font-extrabold ${t.text}`}>{jobs.length}</span>
                </div>
                <div className={`pt-3 border-t ${t.borderSoft}`}>
                  <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
                    Broadcast history is the audit trail — every notice, and whether it was also emailed,
                    stays in the channel.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- admin access */}
      {section === 'access' && (
        <div className="space-y-5 animate-fade-in max-w-3xl">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>The department team</h3>
                <p className={`text-[11px] font-bold ${t.textMuted} mt-1`}>
                  {admins.length + 1} people can act on behalf of {dept.code}
                </p>
              </div>
              {access.canGrantAccess && (
                <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsGrantOpen(true)}>
                  Grant Access
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {/* The Official — master key, no destructive action beside it. */}
              {official && (
                <FacultyRow
                  person={official}
                  trailing={
                    <div className="flex items-center gap-2 shrink-0">
                      <AccessBadge level="official" />
                    </div>
                  }
                />
              )}

              {admins.map(person => (
                <FacultyRow
                  key={person.id}
                  person={person}
                  trailing={
                    <div className="flex items-center gap-2 shrink-0">
                      <AccessBadge level="admin" />
                      {access.canGrantAccess && (
                        <button
                          onClick={() => setConfirmRevoke(person)}
                          aria-label={`Revoke Admin Access for ${person.name}`}
                          title="Revoke Admin Access"
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-white/5' : 'text-gray-400 hover:text-red-500 hover:bg-black/5'} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500/60`}
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  }
                />
              ))}

              {admins.length === 0 && (
                <p className={`text-xs font-bold ${t.textMuted} px-1 py-2`}>
                  No admins delegated yet. The Official is the only person who can act for this department.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <MicroHeading>What each level can do</MicroHeading>
            <div className="space-y-3">
              {[
                { level: 'official', icon: KeyRound, text: 'Holds the Department ID, edits the hub, and grants or revokes Admin Access. Cannot be revoked from inside the app.' },
                { level: 'admin', icon: ShieldCheck, text: 'Broadcasts (including email blasts), answers the Help Desk, and posts jobs and blood requests as the department.' },
              ].map(row => (
                <div key={row.level} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
                    <row.icon className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <AccessBadge level={row.level} />
                    <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed mt-1.5`}>{row.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {!access.canGrantAccess && (
            <p className={`text-[11px] font-bold ${t.textMuted} px-1`}>
              Only the Department Official can change who holds Admin Access.
            </p>
          )}
        </div>
      )}

      {/* ------------------------------------------------ department profile */}
      {section === 'profile' && (
        <div className="space-y-5 animate-fade-in max-w-3xl">
          {access.isOfficial && (
            <Card>
              <MicroHeading>Department ID</MicroHeading>
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDark ? 'bg-amber-400/10 border-amber-400/25' : 'bg-amber-50 border-amber-200'}`}>
                <KeyRound className={`w-5 h-5 shrink-0 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} strokeWidth={2.5} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-extrabold tracking-tight ${t.text}`}>{dept.departmentId}</p>
                  <p className={`text-[10px] font-bold ${t.textMuted} mt-0.5`}>
                    The Official's master key. Required by the registrar for any records request.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Department ID copied')}
                  aria-label="Copy department ID"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                >
                  <Copy className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
              <p className={`text-[11px] font-bold ${t.textMuted} mt-3 leading-relaxed`}>
                Transferring the Official role is handled by the registrar, not in the app.
              </p>
            </Card>
          )}

          <Card>
            <MicroHeading>Description</MicroHeading>
            <Field hint={access.isOfficial ? undefined : 'Only the Department Official can edit this.'}>
              <TextArea
                rows="6"
                value={aboutDraft}
                disabled={!access.isOfficial}
                onChange={(e) => setAboutDraft(e.target.value)}
                placeholder="What should visitors know about this department?"
                className={access.isOfficial ? '' : 'opacity-60 cursor-not-allowed'}
              />
            </Field>
            {access.isOfficial && (
              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  disabled={aboutDraft.trim() === (aboutOverride ?? dept.about)}
                  onClick={() => updateDepartmentAbout(dept.id, aboutDraft.trim())}
                >
                  Save Description
                </Button>
                <button
                  onClick={() => setAboutDraft(aboutOverride ?? dept.about)}
                  className={`text-[11px] font-extrabold ${t.textMuted} hover:underline`}
                >
                  Reset
                </button>
              </div>
            )}
          </Card>

          <Card>
            <MicroHeading>Contact</MicroHeading>
            <div className="space-y-4">
              <Field label="Office">
                <TextInput defaultValue={dept.office} disabled={!access.isOfficial} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <TextInput defaultValue={dept.email} disabled={!access.isOfficial} />
                </Field>
                <Field label="Phone">
                  <TextInput defaultValue={dept.phone} disabled={!access.isOfficial} />
                </Field>
              </div>
              <Field label="Office Hours">
                <TextInput defaultValue={dept.officeHours} disabled={!access.isOfficial} />
              </Field>
            </div>
            {access.isOfficial && (
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => showToast('Contact details saved')}>
                Save Contact Details
              </Button>
            )}
          </Card>

          <Card>
            <MicroHeading>Channels</MicroHeading>
            <div className="flex flex-wrap gap-2">
              <Pill className={isDark ? 'bg-white/10 text-white border-white/15' : 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20'}>
                Broadcast · auto-enrolled
              </Pill>
              <Pill className={isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 border-white'}>
                Help Desk · 1-on-1
              </Pill>
            </div>
            <p className={`text-[11px] font-bold ${t.textMuted} mt-3 leading-relaxed`}>
              Both channels are permanent. Members are enrolled in the broadcast when their account
              is created and can mute it, but never leave it.
            </p>
          </Card>
        </div>
      )}

      {isGrantOpen && (
        <GrantAccessModal
          dept={dept}
          excludedIds={excludedIds}
          onGrant={(person) => grantDepartmentAdmin(dept.id, person.id, person.name)}
          onClose={() => setIsGrantOpen(false)}
        />
      )}

      {confirmRevoke && (
        <Modal onClose={() => setConfirmRevoke(null)} title="Revoke Admin Access" size="sm">
          <div className="space-y-5 pb-2">
            <p className={`text-sm font-medium ${t.text} leading-relaxed opacity-90`}>
              <span className="font-extrabold">{confirmRevoke.name}</span> will immediately lose the ability
              to broadcast, email members and answer the {dept.code} Help Desk. Threads they already
              answered stay in the Help Desk.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setConfirmRevoke(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex-1"
                onClick={() => {
                  revokeDepartmentAdmin(dept.id, confirmRevoke.id, confirmRevoke.name);
                  setConfirmRevoke(null);
                }}
              >
                Revoke Access
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isBloodOpen && <DepartmentBloodRequestModal dept={dept} onClose={() => setIsBloodOpen(false)} />}
    </PageContainer>
  );
}

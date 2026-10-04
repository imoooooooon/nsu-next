import { DepartmentEntry } from '../../shared/DepartmentExperience';
import { useMemo, useState } from 'react';
import {
  ArrowLeft, Share, Mail, Megaphone, Settings2, Users, MapPin, Phone, Globe,
  Clock, Search, ChevronRight, Briefcase, Plus, ArrowUpRight, User,
  GraduationCap, KeyRound, ShieldCheck,
} from 'lucide-react';
import { EntityAvatar, EntityVerified, AccessBadge, DepartmentStats, DepartmentInfoRow } from './DepartmentPrimitives';
import { getDepartmentAccess, getDepartmentLeadership, LEADERSHIP_TITLES, formatCount } from './access';
import { departmentJobs, departmentBloodRequests } from './data';
import { SegmentedPill } from '../ui/controls';

/* ---------------------------------------------------------------------------
   The Department Hub (brief §1 and flow §3).

   Content order is fixed by the brief: identity → About (the department
   description) → the three directory tabs → the scrollable list of profile
   cards. Everything else (contact, officials, upcoming events, open roles,
   blood requests) stacks below, so the brief's order is what you meet on
   first scroll. Mirrors `webapp/src/pages/departments/DepartmentHubPage.jsx`.
--------------------------------------------------------------------------- */

const TABS = [
  { id: 'students', label: 'Students', statKey: 'students' },
  { id: 'alumni', label: 'Alumni', statKey: 'alumni' },
  { id: 'faculty', label: 'Faculty', statKey: 'faculty' },
];

/* Inside a department you are scanning a cohort, not browsing the whole
   network — so these are compact rows, not the full directory card. */
const PersonRow = ({ person, t, isDark, onClick }) => (
  <button
    onClick={() => onClick(person)}
    className={`w-full flex items-center gap-3 p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03] active:bg-white/[0.07]' : 'bg-white/60 active:bg-white'} transition-colors text-left active:scale-[0.99]`}
  >
    <div className={`w-12 h-12 rounded-full shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} border flex items-center justify-center`}>
      <User className={`w-6 h-6 ${t.text}`} strokeWidth={1.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-extrabold ${t.text} truncate`}>{person.name}</p>
      <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{person.role} @ {person.company}</p>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {person.skills.slice(0, 2).map(skill => (
          <span key={skill} className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${isDark ? 'bg-black/20 text-white/60' : 'bg-black/[0.04] text-black/50'}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
    <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
  </button>
);

const ROLE_ICONS = { chair: GraduationCap, official: KeyRound, admin: ShieldCheck };

const RoleChip = ({ role, isDark }) => {
  const Icon = ROLE_ICONS[role];
  const tone = role === 'official'
    ? (isDark ? 'bg-amber-400/15 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-700 border-amber-200')
    : (isDark ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200');
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${tone}`}>
      <Icon className="w-2.5 h-2.5" strokeWidth={3} />
      {role === 'official' ? 'Official' : 'Admin'}
    </span>
  );
};

/* A calendar-leaf date tile — month over day. */
const DateLeaf = ({ date, isDark }) => {
  const d = new Date(`${date}T12:00:00`);
  return (
    <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.06] border-[#1D9BF0]/15'}`}>
      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1D9BF0] leading-none">
        {d.toLocaleString('en-US', { month: 'short' })}
      </span>
      <span className={`text-lg font-black leading-none mt-1 ${isDark ? 'text-white' : 'text-[#0F1419]'}`}>{d.getDate()}</span>
    </div>
  );
};

export const DepartmentProfileOverlay = ({
  dept, authRole, t, isDark, aboutOverride, adminIds,
  peopleByCohort, findUserById,
  events = [], renderEventStatus, onOpenEvent, onCreateEvent,
  onBack, onSelectUser, onOpenChannel, onManage, onPostJob, onPostBlood, onToast,
}) => {
  const [tab, setTab] = useState('students');
  const [search, setSearch] = useState('');

  const access = getDepartmentAccess(dept, authRole);
  const activeTab = TABS.find(x => x.id === tab);

  const people = useMemo(() => {
    const base = (peopleByCohort[tab] || []).filter(p => p.dept === dept.code);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );
  }, [peopleByCohort, tab, search, dept.code]);

  /* Live delegation, not the seed record — an admin granted in the console
     has to appear here immediately or the two screens contradict each other. */
  const leadership = getDepartmentLeadership(dept, adminIds)
    .map(row => ({ ...row, person: findUserById(row.id) }))
    .filter(row => row.person);
  const [lead, ...team] = leadership[0]?.roles.includes('chair') ? leadership : [null, ...leadership];
  const jobs = departmentJobs[dept.id] || [];
  const bloodRequests = departmentBloodRequests[dept.id] || [];

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`} />
      </div>

      {/* ---------------------------------------------------------- header */}
      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b relative z-30 shrink-0`}>
        <button onClick={onBack} aria-label="Back" className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft}`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col items-center min-w-0 px-3">
          <h2 className={`text-base font-extrabold ${t.text} truncate`}>{dept.code}</h2>
          <p className={`text-[10px] font-bold ${t.textMuted} truncate`}>Department Hub</p>
        </div>
        <div className="flex items-center gap-2">
          {access.canManage && (
            <button onClick={() => onManage(dept)} aria-label="Manage department" className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft}`}>
              <Settings2 className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
            </button>
          )}
          <button onClick={() => onToast('Department link copied')} aria-label="Share department" className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft}`}>
            <Share className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 pb-40">
        <div className="px-5 pt-5"><DepartmentEntry dept={dept} authRole={authRole} t={t} isDark={isDark} onManage={() => onManage(dept)} /></div>
        {/* -------------------------------------------------- identity hero */}
        <div className="px-5 pt-6">
          <div className={`rounded-2xl p-6 relative overflow-hidden border ${t.border} shadow-xl shadow-black/[0.04] dark:shadow-black/40`}>
            <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white to-[#1D9BF0]/10 backdrop-blur-3xl'}`} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <EntityAvatar dept={dept} size="2xl" isDark={isDark} className="mb-4" />

              <h1 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} mb-1.5`}>{dept.name}</h1>
              {dept.verified && <EntityVerified className="mb-2" />}
              <p className={`font-bold ${t.textMuted} text-[11px] leading-relaxed mb-4`}>
                North South University · {dept.school}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}`}>
                  Est. {dept.established}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border inline-flex items-center gap-1 ${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}`}>
                  <Users className="w-3 h-3" strokeWidth={3} /> {formatCount(dept.memberCount)}
                </span>
              </div>

              {access.level !== 'visitor' && <AccessBadge level={access.level} isDark={isDark} className="mb-4" />}

              <DepartmentStats dept={dept} t={t} isDark={isDark} className="mb-5" />

              {/* Broadcast is secondary — you don't "enter" a channel you are
                  already enrolled in. The Help Desk is the real destination. */}
              <button
                onClick={() => onOpenChannel(dept, 'broadcast')}
                className={`w-full h-11 rounded-lg font-bold text-sm flex items-center justify-center transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm backdrop-blur-md'}`}
              >
                <Megaphone className="w-4 h-4 mr-2" strokeWidth={2.5} /> Broadcast Channel
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------ About — the department description */}
        <div className="px-5 pt-4">
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 whitespace-pre-wrap`}>
              {aboutOverride ?? dept.about}
            </p>
          </div>
        </div>

        {/* -------------------------------------------- directory tabs + list */}
        {/* The tab row scrolls with the list. It was pinned so the cohorts
            stayed reachable on a long roster, but a control strip that
            detaches and hangs over the cards reads as a glitch — and the
            cards it covered were the thing you came to read. */}
        <div className={`mx-5 mt-4 p-4 rounded-2xl ${t.card} border ${t.border}`}>
          <SegmentedPill
            options={TABS}
            value={tab}
            onChange={(next) => { setTab(next); setSearch(''); }}
            t={t}
            isDark={isDark}
            ariaLabel="Department cohort"
            className="mb-3"
          />

          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab.label.toLowerCase()} in ${dept.code}...`}
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
            />
          </div>
        </div>

        <div className="px-5 pt-3">
          <p className="text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider mb-3">
            Showing {people.length} of {formatCount(dept.stats[activeTab.statKey])} {activeTab.label.toLowerCase()}
          </p>

          {people.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <Users className="w-10 h-10 mb-3" strokeWidth={1.5} />
              <p className={`text-sm font-bold ${t.text}`}>
                {search ? 'No matches' : `No ${activeTab.label.toLowerCase()} listed yet`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {people.map(person => (
                <PersonRow key={person.id} person={person} t={t} isDark={isDark} onClick={onSelectUser} />
              ))}
            </div>
          )}
        </div>

        {/* --------------------------------------------------------- contact */}
        <div className="px-5 pt-6 space-y-4">
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Contact</h3>
            <div className="space-y-4">
              <DepartmentInfoRow icon={MapPin} label="Office" value={dept.office} t={t} isDark={isDark} />
              <DepartmentInfoRow icon={Clock} label="Office Hours" value={dept.officeHours} t={t} isDark={isDark} />
              <DepartmentInfoRow icon={Mail} label="Email" value={dept.email} href={`mailto:${dept.email}`} t={t} isDark={isDark} />
              <DepartmentInfoRow icon={Phone} label="Phone" value={dept.phone} href={`tel:${dept.phone.replace(/\s/g, '')}`} t={t} isDark={isDark} />
              <DepartmentInfoRow icon={Globe} label="Website" value={dept.website} href={`https://${dept.website}`} t={t} isDark={isDark} />
            </div>
          </div>

          {/* ---------------------------------------------------- officials */}
          {/* The Department Chair leads as a tinted tile — who a student,
              parent or recruiter is looking for. The Official and Admins
              follow; one person holding two roles is one entry. */}
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>Department Officials</h3>
            {leadership.length === 0 && (
              <p className={`text-xs font-bold ${t.textMuted}`}>No official assigned yet.</p>
            )}
            {lead && (
              <button
                onClick={() => onSelectUser(lead.person)}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl border text-left active:scale-[0.99] transition-transform ${isDark ? 'bg-rose-400/[0.06] border-rose-400/15' : 'bg-[#800000]/[0.035] border-[#800000]/10'}`}
              >
                <div className={`relative w-12 h-12 rounded-full shrink-0 ${isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10'} flex items-center justify-center`}>
                  <User className={`w-6 h-6 ${isDark ? 'text-rose-400' : 'text-[#800000]'}`} strokeWidth={2} />
                  <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${isDark ? 'bg-rose-400 border-[#121212]' : 'bg-[#800000] border-white'}`}>
                    <GraduationCap className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-rose-300' : 'text-[#800000]'}`}>{LEADERSHIP_TITLES.chair}</p>
                  <p className={`text-[15px] font-extrabold ${t.text} leading-snug mt-0.5 truncate`}>{lead.person.name}</p>
                  <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{lead.person.role}</p>
                  {lead.roles.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lead.roles.filter(r => r !== 'chair').map(r => <RoleChip key={r} role={r} isDark={isDark} />)}
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0 self-center`} strokeWidth={2.5} />
              </button>
            )}
            {team.length > 0 && (
              <div className={`space-y-1 ${lead ? 'mt-3' : ''}`}>
                {team.map(({ person, roles }) => (
                  <button
                    key={person.id}
                    onClick={() => onSelectUser(person)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl ${isDark ? 'active:bg-white/5' : 'active:bg-black/[0.03]'} transition-colors text-left`}
                  >
                    <div className={`w-10 h-10 rounded-full shrink-0 ${isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10'} flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-[#800000]'}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-extrabold ${t.text} truncate`}>{person.name}</p>
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} truncate`}>
                        {roles.map(r => LEADERSHIP_TITLES[r]).join(' · ')}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ----------------------------------------------- upcoming events */}
          {/* Hosted by the department, drawn from the one campus calendar —
              so every row here is also in the Events module. */}
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider`}>Upcoming Events</h3>
              {access.canCreateEvent && onCreateEvent && (
                <button onClick={() => onCreateEvent(dept)} className="text-[#1D9BF0] text-[11px] font-extrabold flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Create
                </button>
              )}
            </div>
            {events.length === 0 ? (
              <p className={`text-xs font-bold ${t.textMuted}`}>No upcoming events from this department.</p>
            ) : (
              <div className="space-y-2">
                {events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onOpenEvent && onOpenEvent(event)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03] active:bg-white/[0.07]' : 'bg-black/[0.02] active:bg-black/[0.05]'} text-left active:scale-[0.99] transition-all`}
                  >
                    <DateLeaf date={event.date} isDark={isDark} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-extrabold ${t.text} leading-snug line-clamp-2`}>{event.title}</p>
                      <p className={`text-[10px] font-bold ${t.textMuted} mt-1 truncate`}>{event.time} · {event.venue}</p>
                      {renderEventStatus && <div className="mt-1.5 inline-flex">{renderEventStatus(event)}</div>}
                    </div>
                    <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ------------------------------------------------ open positions */}
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider`}>Open Positions</h3>
              {access.canEditMetadata && (
                <button onClick={() => onPostJob(dept)} className="text-[#1D9BF0] text-[11px] font-extrabold flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Post
                </button>
              )}
            </div>
            {jobs.length === 0 ? (
              <p className={`text-xs font-bold ${t.textMuted}`}>No open positions right now.</p>
            ) : (
              <div className="space-y-2">
                {jobs.map(job => (
                  <div key={job.id} className={`p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]'}`}>
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-extrabold ${t.text} leading-snug`}>{job.title}</p>
                        <p className={`text-[10px] font-bold ${t.textMuted} mt-1`}>{job.type} · {job.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --------------------------------------------- emergency blood */}
          <div className={`rounded-2xl p-5 ${t.card} border ${t.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider`}>Emergency Blood</h3>
              {access.canEditMetadata && (
                <button onClick={() => onPostBlood(dept)} className="text-red-500 text-[11px] font-extrabold flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Post
                </button>
              )}
            </div>
            {bloodRequests.length === 0 ? (
              <p className={`text-xs font-bold ${t.textMuted}`}>No active requests from this department.</p>
            ) : (
              <div className="space-y-2">
                {bloodRequests.map(req => (
                  <div key={req.id} className={`p-3 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-white'} flex items-center justify-center shrink-0`}>
                        <span className="text-[11px] font-black text-red-500">{req.bg}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-extrabold ${t.text} truncate`}>{req.hospital}</p>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-red-300' : 'text-red-600'} mt-0.5`}>
                          {req.urgency} · {req.units} units · {req.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className={`text-[10px] font-bold ${t.textMuted} text-center px-4 leading-relaxed pb-2`}>
            Posts from this hub go to the campus-wide Events calendar, Job Board and Emergency network
            <ArrowUpRight className="w-3 h-3 inline ml-1" strokeWidth={3} />
          </p>
        </div>
      </div>

      {/* Fixed CTA — the Help Desk is the whole point of this screen for a
          student who is stuck, so it never scrolls away. */}
      <div className={`absolute bottom-0 left-0 w-full p-4 pb-6 ${t.glass} border-t z-30`}>
        <button
          onClick={() => onOpenChannel(dept, 'helpdesk')}
          className="w-full h-12 rounded-xl bg-[#1D9BF0] text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-[#1D9BF0]/40 active:scale-[0.97] transition-transform"
        >
          <Mail className="w-4 h-4 mr-2" strokeWidth={2.5} /> Message {dept.code} Department
        </button>
      </div>
    </div>
  );
};

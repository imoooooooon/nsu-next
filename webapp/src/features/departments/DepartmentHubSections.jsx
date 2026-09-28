import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap, KeyRound, ShieldCheck, Plus, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { Card, MicroHeading } from '../../components/ui';
import { EventStatusBadge, useEventStatus } from '../events/EventPrimitives';
import { getRoleStyles } from '../../lib/roleStyles';
import { getDepartmentLeadership, LEADERSHIP_TITLES } from '../../lib/departmentAccess';
import { findUserById } from '../../data/people';

/* ---------------------------------------------------------------------------
   Two hub rail sections that carry more structure than a plain list.

   · DepartmentOfficials — the Department Chair leads, set apart as a
     tinted tile: the Chair is who a student, parent or recruiter is looking
     for when they open this card. The Official (master key) and the Admins
     follow as plain rows. A Chair who also holds the master key is one tile
     with both titles, never two rows for one person.

   · DepartmentEvents — the department's upcoming events, drawn from the one
     campus calendar (`getDepartmentEvents`). Same rail grammar as Open
     Positions and Emergency Blood: a heading with a Post action for
     managers, compact rows, and a door out to the campus-wide module.
--------------------------------------------------------------------------- */

const ROLE_ICONS = { chair: GraduationCap, official: KeyRound, admin: ShieldCheck };

const RoleChip = ({ role }) => {
  const { isDark } = useTheme();
  const Icon = ROLE_ICONS[role];
  const tone = role === 'chair'
    ? (isDark ? 'bg-rose-400/15 text-rose-300 border-rose-400/30' : 'bg-[#800000]/[0.06] text-[#800000] border-[#800000]/15')
    : role === 'official'
      ? (isDark ? 'bg-amber-400/15 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-700 border-amber-200')
      : (isDark ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200');
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${tone}`}>
      <Icon className="w-2.5 h-2.5" strokeWidth={3} />
      {role === 'chair' ? 'Chair' : role === 'official' ? 'Official' : 'Admin'}
    </span>
  );
};

export const DepartmentOfficials = ({ dept, adminIds }) => {
  const { t, isDark } = useTheme();
  const rows = getDepartmentLeadership(dept, adminIds)
    .map(row => ({ ...row, person: findUserById(row.id) }))
    .filter(row => row.person);
  const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles('Faculty', isDark);
  const [lead, ...team] = rows[0]?.roles.includes('chair') ? rows : [null, ...rows];

  return (
    <Card>
      <MicroHeading>Department Officials</MicroHeading>

      {rows.length === 0 && <p className={`text-xs font-bold ${t.textMuted}`}>No official assigned yet.</p>}

      {lead && (
        <Link
          to={`/network/${lead.person.id}`}
          className={`group flex items-start gap-3.5 p-3.5 rounded-2xl border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
            isDark ? 'bg-rose-400/[0.06] border-rose-400/15 hover:bg-rose-400/10' : 'bg-[#800000]/[0.035] border-[#800000]/10 hover:bg-[#800000]/[0.06]'
          }`}
        >
          <div className={`relative w-12 h-12 rounded-full ${bgClass} border ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center shrink-0`}>
            <RoleIcon className={`w-6 h-6 ${colorClass}`} strokeWidth={2} />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${isDark ? 'bg-rose-400 border-[#121212]' : 'bg-[#800000] border-white'}`}>
              <GraduationCap className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-rose-300' : 'text-[#800000]'}`}>
              {LEADERSHIP_TITLES.chair}
            </p>
            <p className={`text-[15px] font-extrabold ${t.text} leading-snug mt-0.5 truncate`}>{lead.person.name}</p>
            <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{lead.person.role}</p>
            {lead.roles.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {lead.roles.filter(r => r !== 'chair').map(r => <RoleChip key={r} role={r} />)}
              </div>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0 self-center transition-transform group-hover:translate-x-0.5`} strokeWidth={2.5} />
        </Link>
      )}

      {team.length > 0 && (
        <div className={`space-y-1 ${lead ? 'mt-3' : ''}`}>
          {team.map(({ person, roles }) => (
            <Link
              key={person.id}
              to={`/network/${person.id}`}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.03]'} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
            >
              <div className={`w-10 h-10 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shrink-0`}>
                <RoleIcon className={`w-5 h-5 ${colorClass}`} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-extrabold ${t.text} truncate`}>{person.name}</p>
                <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} truncate`}>
                  {roles.map(r => LEADERSHIP_TITLES[r]).join(' · ')}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

/* A calendar-leaf date tile — month over day — so a row reads as "when"
   before it reads as "what". */
const DateLeaf = ({ date }) => {
  const { isDark } = useTheme();
  const d = new Date(`${date}T12:00:00`);
  return (
    <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 overflow-hidden ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.06] border-[#1D9BF0]/15'}`}>
      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1D9BF0] leading-none">
        {d.toLocaleString('en-US', { month: 'short' })}
      </span>
      <span className={`text-lg font-black leading-none mt-1 ${isDark ? 'text-white' : 'text-[#0F1419]'}`}>{d.getDate()}</span>
    </div>
  );
};

const DepartmentEventRow = ({ event }) => {
  const { t, isDark } = useTheme();
  const { displayStatus } = useEventStatus(event);
  return (
    <Link
      to={`/events/${event.id}`}
      className={`flex items-center gap-3 p-2.5 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-black/[0.02] hover:bg-black/[0.04]'} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
    >
      <DateLeaf date={event.date} />
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-extrabold ${t.text} leading-snug line-clamp-2`}>{event.title}</p>
        <p className={`text-[10px] font-bold ${t.textMuted} mt-1 flex items-center gap-2 min-w-0`}>
          <span className="inline-flex items-center shrink-0"><Clock className="w-3 h-3 mr-1" strokeWidth={2.5} />{event.time}</span>
          <span className="inline-flex items-center min-w-0"><MapPin className="w-3 h-3 mr-1 shrink-0" strokeWidth={2.5} /><span className="truncate">{event.venue}</span></span>
        </p>
        <div className="mt-1.5"><EventStatusBadge status={displayStatus} /></div>
      </div>
    </Link>
  );
};

export const DepartmentEvents = ({ events, canManage, onCreate, onBrowse }) => {
  const { t } = useTheme();
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <MicroHeading className="!mb-0">Upcoming Events</MicroHeading>
        {canManage && (
          <button
            onClick={onCreate}
            className="text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center"
          >
            <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Create
          </button>
        )}
      </div>
      {events.length === 0 ? (
        <p className={`text-xs font-bold ${t.textMuted}`}>No upcoming events from this department.</p>
      ) : (
        <div className="space-y-2">
          {events.map(event => <DepartmentEventRow key={event.id} event={event} />)}
        </div>
      )}
      <button
        onClick={onBrowse}
        className="w-full text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center justify-center pt-3"
      >
        Open the campus Events calendar <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
      </button>
    </Card>
  );
};

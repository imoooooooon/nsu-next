import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Megaphone, Settings2, ArrowUpRight, ChevronRight, BadgeCheck,
  Briefcase, Droplet, MailCheck,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { Button, Card } from '../../components/ui';
import { EntityAvatar, AccessBadge } from './DepartmentPrimitives';
import { departmentBroadcasts, departmentJobs, departmentBloodRequests } from '../../data/departments';
import {
  getDepartmentAccess, formatCount, broadcastChannelId, helpDeskChannelId,
} from '../../lib/departmentAccess';

/* ---------------------------------------------------------------------------
   The Departments lens of the Directory — a REGISTER, not a card grid.

   People are cards because you size a person up before you connect. A
   department is an office you look up — like the directory board in a
   campus lobby — so it reads as a dense list: square code tile, name,
   reach, room number. Two structural choices carry the difference:

   · Grouped by school — the university's real org chart, and the way
     students already navigate the campus.
   · Rows vary — a signal chip only appears when it's true (open roles,
     blood requests), so rows differ where departments differ
     instead of repeating one template four times.

   Membership is the relationship that makes an entity different from a
   person, so the viewer's own department leads as its own panel — and the
   access badge lives there, not repeated on the row below it.
--------------------------------------------------------------------------- */

/* "SAC 1042, NSU Campus, Bashundhara" → "SAC 1042" — the lobby-board fact. */
const getOfficeRoom = (dept) => (dept.office || '').split(',')[0].trim();

/* Seed history plus anything sent this session, so the panel and the
   channel can never disagree about the latest notice. */
const getLatestNotice = (dept, sentBroadcasts = {}) => {
  const all = [...(departmentBroadcasts[dept.id] || []), ...(sentBroadcasts[dept.id] || [])];
  return all[all.length - 1] || null;
};

/* Groups in first-seen order, so the data file decides the order of schools. */
const groupBySchool = (departments) => {
  const groups = new Map();
  departments.forEach(d => {
    if (!groups.has(d.school)) groups.set(d.school, []);
    groups.get(d.school).push(d);
  });
  return [...groups.entries()];
};

/* The verified mark is glued to the name's last word, so a wrapping name
   never leaves the check alone on a line of its own. */
const VerifiedName = ({ name, verified }) => {
  if (!verified) return name;
  const cut = name.lastIndexOf(' ');
  return (
    <>
      {name.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {name.slice(cut + 1)}
        <BadgeCheck className="inline-block w-4 h-4 ml-1 -mt-0.5 align-middle text-[#1D9BF0]" strokeWidth={2.5} aria-label="Official department" />
      </span>
    </>
  );
};

const SignalChip = ({ tone, icon: Icon, children }) => {
  const { isDark } = useTheme();
  const tones = {
    emerald: isDark ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: isDark ? 'bg-red-400/10 text-red-300 border-red-400/20' : 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${tones[tone]}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {children}
    </span>
  );
};

/* One register row. The name is a stretched link, so the whole row opens the
   hub while the Message button stays its own target above it. */
export const DepartmentRow = ({ dept }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const jobs = (departmentJobs[dept.id] || []).length;
  const blood = (departmentBloodRequests[dept.id] || []).length;
  const room = getOfficeRoom(dept);
  const hasSignals = jobs > 0 || blood > 0;

  return (
    <li
      className={`relative flex items-center gap-4 px-4 sm:px-5 py-4 transition-colors ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-white/70'} has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-[#1D9BF0]`}
    >
      <EntityAvatar dept={dept} size="md" />

      <div className="flex-1 min-w-0">
        <Link
          to={`/departments/${dept.id}`}
          className={`block font-extrabold text-[15px] tracking-tight leading-snug line-clamp-2 ${t.text} outline-none after:absolute after:inset-0 after:content-['']`}
        >
          <VerifiedName name={dept.name} verified={dept.verified} />
        </Link>

        <p className={`text-xs font-bold ${t.textMuted} mt-0.5 truncate`}>
          {formatCount(dept.memberCount)} members
          <span className="md:hidden"> · {room}</span>
          <span className="hidden md:inline"> · Est. {dept.established}</span>
        </p>

        {hasSignals && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {jobs > 0 && <SignalChip tone="emerald" icon={Briefcase}>{jobs} open {jobs === 1 ? 'role' : 'roles'}</SignalChip>}
            {blood > 0 && <SignalChip tone="red" icon={Droplet}>{blood} blood {blood === 1 ? 'request' : 'requests'}</SignalChip>}
          </div>
        )}
      </div>

      {/* The lobby-board column: where you physically go. */}
      <div className="hidden md:block w-28 shrink-0 text-right">
        <p className={`text-sm font-extrabold tabular-nums ${t.text}`}>{room}</p>
        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mt-0.5`}>Office</p>
      </div>

      <button
        type="button"
        aria-label={`Message the ${dept.code} department`}
        title={`Message the ${dept.code} department`}
        onClick={() => navigate(`/messages/${helpDeskChannelId(dept.id)}`)}
        className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white/70 text-black border-white hover:bg-white'} transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
      >
        <Mail className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <ChevronRight className={`hidden sm:block w-4 h-4 shrink-0 -ml-1 ${t.textMuted}`} strokeWidth={2.5} aria-hidden="true" />
    </li>
  );
};

/* The register: one glass surface, school sections inset as headers.
   Verification is stated once here instead of repeated on every row. */
export const DepartmentList = ({ departments, className = '' }) => {
  const { t, isDark } = useTheme();
  const divider = isDark ? 'divide-white/[0.06] border-white/[0.06]' : 'divide-black/[0.05] border-black/[0.05]';

  return (
    <Card padded={false} className={`overflow-hidden ${className}`}>
      <div className={`flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-4 border-b ${divider}`}>
        <h3 className={`text-base font-extrabold tracking-tight ${t.text}`}>All departments</h3>
        <span className="inline-flex items-center gap-1 text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider">
          <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} /> Verified by NSU
        </span>
      </div>

      {groupBySchool(departments).map(([school, depts], idx) => (
        <section key={school} aria-label={school} className={idx > 0 ? `border-t ${divider}` : ''}>
          <div className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.015]'}`}>
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} truncate`}>{school}</p>
            <span className={`text-[10px] font-extrabold tabular-nums ${t.textMuted} shrink-0`}>{depts.length}</span>
          </div>
          <ul className={`divide-y ${divider}`}>
            {depts.map(dept => <DepartmentRow key={dept.id} dept={dept} />)}
          </ul>
        </section>
      ))}
    </Card>
  );
};

/* The viewer's own department — the membership pass. It carries the one
   thing a member checks most (the latest notice) and their two doors in. */
export const MyDepartmentPanel = ({ dept, className = '' }) => {
  const { t, isDark } = useTheme();
  const { authRole, sentBroadcasts } = useAppState();
  const navigate = useNavigate();
  const access = getDepartmentAccess(dept, authRole);
  const notice = getLatestNotice(dept, sentBroadcasts);
  const divider = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';

  return (
    <Card padded={false} className={`overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider`}>Your department</h3>
          <AccessBadge level={access.level} />
        </div>
        <Link
          to={`/departments/${dept.id}`}
          className="flex items-center gap-3.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] group"
        >
          <EntityAvatar dept={dept} size="lg" />
          <div className="min-w-0">
            <p className={`font-extrabold text-base tracking-tight leading-snug ${t.text} group-hover:underline decoration-2 underline-offset-2`}>{dept.name}</p>
            <p className={`text-xs font-bold ${t.textMuted} mt-0.5 line-clamp-1`}>{dept.school}</p>
          </div>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/messages/${broadcastChannelId(dept.id)}`)}
        className={`w-full text-left px-5 py-4 border-t ${divider} ${isDark ? 'bg-[#1D9BF0]/[0.06] hover:bg-[#1D9BF0]/10' : 'bg-[#1D9BF0]/[0.05] hover:bg-[#1D9BF0]/[0.08]'} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D9BF0]`}
      >
        <span className="flex items-center gap-1.5 flex-wrap text-[10px] font-extrabold uppercase tracking-wider text-[#1D9BF0]">
          <Megaphone className="w-3.5 h-3.5" strokeWidth={2.5} /> Latest notice
          {notice && <span className={t.textMuted}>· {notice.time}</span>}
          {notice?.emailed && (
            <span className={`inline-flex items-center gap-1 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
              · <MailCheck className="w-3 h-3" strokeWidth={3} /> Also emailed
            </span>
          )}
        </span>
        <span className={`block text-sm font-bold leading-snug mt-1.5 line-clamp-2 ${notice ? t.text : t.textMuted}`}>
          {notice ? notice.title : 'No notices yet.'}
        </span>
      </button>

      <div className={`grid grid-cols-2 gap-3 p-4 border-t ${divider}`}>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/departments/${dept.id}`)}>
          Open hub <ArrowUpRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
        </Button>
        {access.canManage ? (
          <Button variant="soft" size="sm" icon={Settings2} onClick={() => navigate(`/departments/${dept.id}/manage`)}>
            Manage
          </Button>
        ) : (
          <Button variant="primary" size="sm" icon={Mail} onClick={() => navigate(`/messages/${helpDeskChannelId(dept.id)}`)}>
            Message
          </Button>
        )}
      </div>
    </Card>
  );
};

import { Mail, Megaphone, Settings2, ArrowUpRight, BadgeCheck, Briefcase, Droplet, MailCheck } from 'lucide-react';
import { EntityAvatar, AccessBadge } from './DepartmentPrimitives';
import { departmentBroadcasts, departmentJobs, departmentBloodRequests } from './data';
import { getDepartmentAccess, formatCount } from './access';

/* ---------------------------------------------------------------------------
   The Departments lens of the Directory — a REGISTER, not a card grid.
   Mirrors `webapp/src/features/departments/DepartmentDirectory.jsx`.

   People are cards because you size a person up before you connect. A
   department is an office you look up — like the directory board in a
   campus lobby — so it reads as a dense list: square code tile, name,
   reach, room number. Grouped by school (the university's real org chart),
   and a signal chip only appears when it's true (open roles, blood
   requests), so rows differ where
   departments differ instead of repeating one template.

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

const SignalChip = (props) => {
  const { tone, isDark, children } = props;
  const Icon = props.icon;
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

export const DepartmentRow = ({ dept, t, isDark, onOpen, onMessage }) => {
  const jobs = (departmentJobs[dept.id] || []).length;
  const blood = (departmentBloodRequests[dept.id] || []).length;
  const hasSignals = jobs > 0 || blood > 0;

  return (
    <li
      onClick={() => onOpen(dept)}
      className={`flex items-center gap-3.5 px-4 py-4 cursor-pointer transition-colors ${isDark ? 'active:bg-white/[0.05]' : 'active:bg-white/80'}`}
    >
      <EntityAvatar dept={dept} size="md" isDark={isDark} />

      <div className="flex-1 min-w-0">
        <h3 className={`font-extrabold text-[15px] tracking-tight leading-snug line-clamp-2 ${t.text}`}>
          <VerifiedName name={dept.name} verified={dept.verified} />
        </h3>
        <p className={`text-xs font-bold ${t.textMuted} mt-0.5 truncate`}>
          {formatCount(dept.memberCount)} members · {getOfficeRoom(dept)}
        </p>
        {hasSignals && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {jobs > 0 && <SignalChip tone="emerald" icon={Briefcase} isDark={isDark}>{jobs} open {jobs === 1 ? 'role' : 'roles'}</SignalChip>}
            {blood > 0 && <SignalChip tone="red" icon={Droplet} isDark={isDark}>{blood} blood {blood === 1 ? 'request' : 'requests'}</SignalChip>}
          </div>
        )}
      </div>

      <button
        aria-label={`Message the ${dept.code} department`}
        onClick={(e) => { e.stopPropagation(); onMessage(dept); }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? 'bg-white/5 text-white border-white/10' : 'bg-white/70 text-black border-white'} transition-transform active:scale-95`}
      >
        <Mail className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </li>
  );
};

/* The register: one glass surface, school sections inset as headers.
   Verification is stated once here instead of repeated on every row. */
export const DepartmentList = ({ departments, t, isDark, onOpen, onMessage }) => {
  const divider = isDark ? 'divide-white/[0.06] border-white/[0.06]' : 'divide-black/[0.05] border-black/[0.05]';

  return (
    <div className={`rounded-2xl ${t.card} border ${t.border} ${t.cardShadow} overflow-hidden`}>
      <div className={`flex items-center justify-between gap-2 px-4 py-3.5 border-b ${divider}`}>
        <h3 className={`text-base font-extrabold tracking-tight ${t.text}`}>All departments</h3>
        <span className="inline-flex items-center gap-1 text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider">
          <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} /> Verified by NSU
        </span>
      </div>

      {groupBySchool(departments).map(([school, depts], idx) => (
        <section key={school} aria-label={school} className={idx > 0 ? `border-t ${divider}` : ''}>
          <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.015]'}`}>
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} truncate`}>{school}</p>
            <span className={`text-[10px] font-extrabold tabular-nums ${t.textMuted} shrink-0`}>{depts.length}</span>
          </div>
          <ul className={`divide-y ${divider}`}>
            {depts.map(dept => (
              <DepartmentRow
                key={dept.id}
                dept={dept}
                t={t}
                isDark={isDark}
                onOpen={onOpen}
                onMessage={onMessage}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

/* The viewer's own department — the membership pass. It carries the one
   thing a member checks most (the latest notice) and their two doors in. */
export const MyDepartmentPanel = ({ dept, authRole, sentBroadcasts, t, isDark, onOpen, onOpenChannel, onManage }) => {
  const access = getDepartmentAccess(dept, authRole);
  const notice = getLatestNotice(dept, sentBroadcasts);
  const divider = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
  const btn = `h-10 rounded-lg text-[13px] font-extrabold flex items-center justify-center transition-all active:scale-[0.97]`;

  return (
    <div className={`rounded-2xl ${t.card} border ${t.border} ${t.cardShadow} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider`}>Your department</h3>
          <AccessBadge level={access.level} isDark={isDark} />
        </div>
        <div onClick={() => onOpen(dept)} className="flex items-center gap-3.5 cursor-pointer active:opacity-70 transition-opacity">
          <EntityAvatar dept={dept} size="lg" isDark={isDark} />
          <div className="min-w-0">
            <p className={`font-extrabold text-base tracking-tight leading-snug ${t.text}`}>{dept.name}</p>
            <p className={`text-[11px] font-bold ${t.textMuted} mt-0.5 line-clamp-1`}>{dept.school}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpenChannel(dept, 'broadcast')}
        className={`w-full text-left px-4 py-3.5 border-t ${divider} ${isDark ? 'bg-[#1D9BF0]/[0.06] active:bg-[#1D9BF0]/10' : 'bg-[#1D9BF0]/[0.05] active:bg-[#1D9BF0]/[0.08]'} transition-colors`}
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
        <button
          onClick={() => onOpen(dept)}
          className={`${btn} ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm'}`}
        >
          Open hub <ArrowUpRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
        </button>
        {access.canManage ? (
          <button onClick={() => onManage(dept)} className={`${btn} bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20`}>
            <Settings2 className="w-4 h-4 mr-2" strokeWidth={2.5} /> Manage
          </button>
        ) : (
          <button onClick={() => onOpenChannel(dept, 'helpdesk')} className={`${btn} bg-[#1D9BF0] text-white shadow-sm`}>
            <Mail className="w-4 h-4 mr-2" strokeWidth={2.5} /> Message
          </button>
        )}
      </div>
    </div>
  );
};

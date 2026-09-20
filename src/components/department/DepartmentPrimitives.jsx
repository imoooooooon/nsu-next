import { Building2, BadgeCheck } from 'lucide-react';
import { DEPARTMENT_LEVELS, formatCount, getDeptAccent } from './access';

/* ---------------------------------------------------------------------------
   Department (Entity) primitives.

   The rule that carries across every surface: entities are ROUNDED SQUARES,
   people are CIRCLES. One glance separates an official department notice from
   a classmate's message — in the inbox, in the directory and on job cards.
--------------------------------------------------------------------------- */

const SIZES = {
  xs: { box: 'w-8 h-8 rounded-lg', text: 'text-[9px]', icon: 'w-4 h-4' },
  sm: { box: 'w-10 h-10 rounded-lg', text: 'text-[10px]', icon: 'w-5 h-5' },
  md: { box: 'w-12 h-12 rounded-xl', text: 'text-[11px]', icon: 'w-6 h-6' },
  lg: { box: 'w-14 h-14 rounded-xl', text: 'text-xs', icon: 'w-7 h-7' },
  xl: { box: 'w-16 h-16 rounded-2xl', text: 'text-sm', icon: 'w-8 h-8' },
  '2xl': { box: 'w-20 h-20 rounded-2xl', text: 'text-lg', icon: 'w-10 h-10' },
};

/* The department's short code IS its profile picture — a department has no
   face, and "CSE" identifies it faster than any glyph. The full name always
   sits beside it. Falls back to the building mark only if a record has no
   code at all. */
export const EntityAvatar = ({ dept, size = 'md', isDark, className = '' }) => {
  const s = SIZES[size] || SIZES.md;
  const label = dept?.short || dept?.code;
  return (
    <div
      className={`${s.box} shrink-0 flex items-center justify-center border ${getDeptAccent(dept?.code, isDark)} ${className}`}
      aria-hidden="true"
    >
      {label
        ? <span className={`${s.text} font-black tracking-tight leading-none`}>{label}</span>
        : <Building2 className={s.icon} strokeWidth={2} />}
    </div>
  );
};

/* A department is verified by the university, so it says so in words rather
   than borrowing the person's blue check alone. */
export const EntityVerified = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-[#1D9BF0] ${className}`}>
    <BadgeCheck className="w-4 h-4 shrink-0" strokeWidth={2.5} />
    <span className="text-[10px] font-extrabold uppercase tracking-wider">Official</span>
  </span>
);

export const AccessBadge = ({ level, isDark, className = '' }) => {
  const cfg = DEPARTMENT_LEVELS[level];
  if (!cfg || level === 'visitor') return null;
  const tone = level === 'official'
    ? (isDark ? 'bg-amber-400/15 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-700 border-amber-200')
    : level === 'admin'
      ? (isDark ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
      : (isDark ? 'bg-white/10 text-white/70 border-white/15' : 'bg-black/[0.04] text-black/60 border-black/[0.06]');
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${tone} ${className}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
};

/* Faculty / Students / Alumni counts. Doubles as the directory tab counts, so
   the hero and the tabs can never disagree. */
export const DepartmentStats = ({ dept, t, isDark, compact = false, className = '' }) => {
  const cells = [
    { label: 'Faculty', value: dept.stats.faculty },
    { label: 'Students', value: dept.stats.students },
    { label: 'Alumni', value: dept.stats.alumni },
  ];
  return (
    <div className={`flex items-center w-full border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'} pt-4 ${className}`}>
      {cells.map((cell, idx) => (
        <div
          key={cell.label}
          className={`flex-1 text-center ${idx < cells.length - 1 ? 'border-r border-dashed border-gray-400/30' : ''}`}
        >
          <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>{cell.label}</p>
          <p className={`${compact ? 'text-sm' : 'text-base'} font-extrabold ${t.text}`}>{formatCount(cell.value)}</p>
        </div>
      ))}
    </div>
  );
};

export const DepartmentInfoRow = (props) => {
  const { label, value, href, t, isDark } = props;
  const Icon = props.icon;
  const body = (
    <>
      <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>{label}</p>
        <p className={`text-xs font-extrabold ${t.text} mt-0.5 break-words`}>{value}</p>
      </div>
    </>
  );

  if (!href) return <div className="flex items-start gap-3">{body}</div>;
  return (
    <a href={href} className="flex items-start gap-3 active:opacity-70 transition-opacity">
      {body}
    </a>
  );
};

/* Bottom sheet shared by the department overlays (same geometry as the
   Seeking module's action sheet, so the app keeps one sheet language). */
export const DepartmentSheet = ({ title, onClose, t, isDark, children }) => (
  <>
    <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
    <div className={`absolute bottom-0 left-0 w-full max-h-[88%] flex flex-col rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-[61] animate-slide-up border-t ${t.borderSoft}`}>
      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 shrink-0" />
      {title && (
        <h3 className={`px-5 pb-3 text-lg font-extrabold ${t.text} tracking-tight shrink-0`}>{title}</h3>
      )}
      <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
    </div>
  </>
);

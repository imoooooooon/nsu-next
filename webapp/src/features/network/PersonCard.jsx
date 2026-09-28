import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Droplets, BookmarkIcon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { TintedCard, Card, Avatar, Verified, Pill } from '../../components/ui';
import { getDeptStyle } from '../../lib/roleStyles';
import { findDepartmentByCode } from '../../data/departments';

/* The department chip is the main cross-link into the Entity Profile: from
   any person you can reach the office they belong to in one tap. It stops
   propagation so it never fires the card's own navigation. */
const DeptChip = ({ dept, className }) => {
  const navigate = useNavigate();
  const record = findDepartmentByCode(dept);
  if (!record) return <Pill className={className}>{dept}</Pill>;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); navigate(`/departments/${record.id}`); }}
      title={`Open the ${record.code} department hub`}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded-md active:scale-95 transition-transform"
    >
      <Pill className={`${className} hover:opacity-80 transition-opacity`}>{dept}</Pill>
    </button>
  );
};

/* ---------------------------------------------------------------------------
   People cards — the blue-tinted directory card, in two densities:
   'full'    → directory grid card with skills, stats and actions
   'connect' → the compact "People to Connect With" rail card on Home
--------------------------------------------------------------------------- */

export const ConnectButton = ({ personId, size = 'h-11 text-sm', accent = 'text-[#1D9BF0]', className = 'flex-1' }) => {
  const { t, isDark } = useTheme();
  const { requestedSet, toggleRequested } = useAppState();
  const requested = requestedSet.has(personId);

  return (
    <div className={`relative z-10 ${className}`} onClick={(e) => { e.stopPropagation(); toggleRequested(personId); }}>
      {requested ? (
        <div className={`flex items-center justify-center ${size} rounded-lg font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all cursor-pointer`}>
          <CheckCircle2 className={`w-4 h-4 mr-2 ${accent}`} strokeWidth={2.5} /> Requested
        </div>
      ) : (
        <button className={`w-full ${size} rounded-lg font-bold transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm backdrop-blur-md hover:bg-white'}`}>
          Connect
        </button>
      )}
    </div>
  );
};

export const PersonCard = ({ person, variant = 'full', className = '' }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

  if (variant === 'connect') {
    return (
      <TintedCard tint="blueSoft" interactive className={`w-[290px] shrink-0 p-5 ${className}`} onClick={() => navigate(`/network/${person.id}`)}>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <h4 className={`font-extrabold text-base tracking-tight truncate ${t.text}`}>{person.name}</h4>
              {person.verified && <Verified />}
            </div>
            <p className={`font-bold ${t.textMuted} text-[11px] truncate`}>{person.role} @ {person.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <DeptChip dept={person.dept} className={getDeptStyle(person.dept, isDark)} />
          <Pill className={`${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'} truncate max-w-[100px]`}>{person.batch}</Pill>
        </div>
        <ConnectButton personId={person.id} size="h-10 text-[13px]" />
      </TintedCard>
    );
  }

  return (
    <TintedCard tint="blueSoft" interactive className={`p-5 h-full ${className}`} contentClassName="flex flex-col h-full" onClick={() => navigate(`/network/${person.id}`)}>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 mb-1">
            <h3 className={`font-extrabold text-xl tracking-tight leading-tight truncate ${t.text}`}>{person.name}</h3>
            {person.verified && <Verified size="w-5 h-5" />}
          </div>
          <p className={`font-bold ${t.textMuted} text-xs truncate`}>{person.role} @ {person.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <DeptChip dept={person.dept} className={getDeptStyle(person.dept, isDark)} />
        {person.skills.map(skill => (
          <Pill key={skill} className={isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}>
            {skill}
          </Pill>
        ))}
      </div>

      <div className={`mt-auto flex justify-between items-center mb-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
        <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
          <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Blood</p>
          <p className={`text-sm font-extrabold ${t.text} flex items-center justify-center`}>
            <Droplets className="w-3 h-3 text-red-500 mr-1" strokeWidth={3} /> {person.blood}
          </p>
        </div>
        {person.batch !== 'Faculty' && (
          <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
            <p className={`text-sm font-extrabold ${t.text}`}>{person.batch.includes(' ') ? person.batch.split(' ')[1] : person.batch}</p>
          </div>
        )}
        <div className="text-center flex-1">
          <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Network</p>
          <p className={`text-sm font-extrabold ${t.text}`}>{person.followers}</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <ConnectButton personId={person.id} />
        <button
          aria-label={`Save ${person.name}`}
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white shadow-sm border border-transparent'} transition-transform active:scale-95`}
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkIcon className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </TintedCard>
  );
};

/* ---------------------------------------------------------------------------
   List mode — the same people, one line each, for when the directory is
   too long to browse card by card. Circle avatar (people are circles),
   name + headline, then department and batch in their own column from sm,
   and Connect as the one trailing action. The name is a stretched link, so
   the whole row opens the profile while Connect and the department chip
   stay their own targets above it.
--------------------------------------------------------------------------- */

export const PersonRow = ({ person }) => {
  const { t, isDark } = useTheme();
  const batch = person.batch === 'Faculty' ? 'Faculty' : person.batch;

  return (
    <li
      className={`relative flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-3.5 transition-colors ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-white/70'} has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-[#1D9BF0]`}
    >
      <Avatar size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link
            to={`/network/${person.id}`}
            className={`font-extrabold text-[15px] tracking-tight truncate ${t.text} outline-none after:absolute after:inset-0 after:content-['']`}
          >
            {person.name}
          </Link>
          {person.verified && <Verified />}
        </div>
        <p className={`text-xs font-bold ${t.textMuted} truncate mt-0.5`}>
          {person.role} @ {person.company}
          <span className="sm:hidden"> · {person.dept}</span>
        </p>
      </div>
      <div className="hidden sm:flex items-center justify-end gap-2 shrink-0 md:w-48 relative z-10">
        <DeptChip dept={person.dept} className={getDeptStyle(person.dept, isDark)} />
        <span className="hidden md:block">
          <Pill className={isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 border-white'}>{batch}</Pill>
        </span>
      </div>
      <ConnectButton personId={person.id} size="h-9 text-xs" className="w-28 shrink-0" />
    </li>
  );
};

export const PersonList = ({ people, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <Card padded={false} className={`overflow-hidden ${className}`}>
      <ul className={`divide-y ${isDark ? 'divide-white/[0.06]' : 'divide-black/[0.05]'}`}>
        {people.map(person => <PersonRow key={person.id} person={person} />)}
      </ul>
    </Card>
  );
};

import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Droplets, BookmarkIcon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { TintedCard, Avatar, Verified, Pill } from '../../components/ui';
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

export const ConnectButton = ({ personId, size = 'h-11 text-sm', accent = 'text-[#1D9BF0]' }) => {
  const { t, isDark } = useTheme();
  const { requestedSet, toggleRequested } = useAppState();
  const requested = requestedSet.has(personId);

  return (
    <div className="flex-1" onClick={(e) => { e.stopPropagation(); toggleRequested(personId); }}>
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

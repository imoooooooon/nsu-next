import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { TintedCard, Pill, Button } from '../../components/ui';
import { EntityAvatar, EntityVerified, AccessBadge, DepartmentStats } from './DepartmentPrimitives';
import { getDepartmentAccess, helpDeskChannelId } from '../../lib/departmentAccess';

/* ---------------------------------------------------------------------------
   The directory card for an Entity Profile.

   Deliberately NOT PersonCard: no Connect button (you don't befriend an
   office), no blood group, no circular avatar. The two actions a department
   card owes you are "open the hub" and "ask a question".
--------------------------------------------------------------------------- */

export const DepartmentCard = ({ dept, className = '' }) => {
  const { t, isDark } = useTheme();
  const { authRole } = useAppState();
  const navigate = useNavigate();
  const access = getDepartmentAccess(dept, authRole);

  return (
    <TintedCard
      tint="blueSoft"
      interactive
      className={`p-5 h-full ${className}`}
      contentClassName="flex flex-col h-full"
      onClick={() => navigate(`/departments/${dept.id}`)}
    >
      <div className="flex items-start gap-4 mb-4">
        <EntityAvatar dept={dept} size="xl" />
        {/* The code is the avatar; the name is what sits beside it. */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className={`font-extrabold text-lg tracking-tight leading-snug ${t.text}`}>{dept.name}</h3>
            {dept.verified && <EntityVerified className="mt-1 shrink-0" />}
          </div>
          <p className={`font-bold ${t.textMuted} text-xs leading-snug line-clamp-1`}>{dept.school}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Pill className={isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}>
          Est. {dept.established}
        </Pill>
        {access.level !== 'visitor' && <AccessBadge level={access.level} />}
      </div>

      <p className={`text-xs font-medium ${t.textMuted} leading-relaxed line-clamp-2 mb-4`}>{dept.about}</p>

      <DepartmentStats dept={dept} compact className="mt-auto mb-5" />

      <div className="flex gap-3">
        <Button variant="secondary" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); navigate(`/departments/${dept.id}`); }}>
          View Hub <ArrowUpRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
        </Button>
        <button
          aria-label={`Message the ${dept.code} department`}
          title={`Message the ${dept.code} department`}
          onClick={(e) => { e.stopPropagation(); navigate(`/messages/${helpDeskChannelId(dept.id)}`); }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white shadow-sm border border-transparent text-black'} transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
        >
          <Mail className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </TintedCard>
  );
};

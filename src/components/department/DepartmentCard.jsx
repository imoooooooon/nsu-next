import { ArrowUpRight, Mail } from 'lucide-react';
import { EntityAvatar, EntityVerified, AccessBadge, DepartmentStats } from './DepartmentPrimitives';
import { getDepartmentAccess } from './access';

/* ---------------------------------------------------------------------------
   The directory card for an Entity Profile.

   Deliberately NOT the person card: no Connect button (you don't befriend an
   office), no blood group, no circular avatar. The two actions a department
   card owes you are "open the hub" and "ask a question".
--------------------------------------------------------------------------- */

export const DepartmentCard = ({ dept, authRole, t, isDark, onOpen, onMessage }) => {
  const access = getDepartmentAccess(dept, authRole);

  return (
    <div
      onClick={() => onOpen(dept)}
      className={`rounded-2xl p-5 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform duration-300 shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}
    >
      <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white to-[#1D9BF0]/10 backdrop-blur-3xl'}`} />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <EntityAvatar dept={dept} size="xl" isDark={isDark} />
          {/* The code is the avatar; the name is what sits beside it. */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-extrabold text-lg tracking-tight leading-snug ${t.text} mb-1`}>{dept.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {dept.verified && <EntityVerified />}
              <p className={`font-bold ${t.textMuted} text-[11px] leading-snug`}>{dept.school}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}`}>
            Est. {dept.established}
          </span>
          {access.level !== 'visitor' && <AccessBadge level={access.level} isDark={isDark} />}
        </div>

        <p className={`text-xs font-medium ${t.textMuted} leading-relaxed line-clamp-2 mb-4`}>{dept.about}</p>

        <DepartmentStats dept={dept} t={t} isDark={isDark} compact className="mb-5" />

        <div className="flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(dept); }}
            className={`flex-1 h-11 rounded-lg font-bold text-sm flex items-center justify-center transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm backdrop-blur-md'}`}
          >
            View Hub <ArrowUpRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
          </button>
          <button
            aria-label={`Message the ${dept.code} department`}
            onClick={(e) => { e.stopPropagation(); onMessage(dept); }}
            className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white shadow-sm border border-transparent'} transition-transform active:scale-95`}
          >
            <Mail className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

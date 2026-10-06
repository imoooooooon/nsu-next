import { ArrowUpRight, BadgeCheck, Bookmark, ChevronRight, UserRound } from 'lucide-react';

// One ordering rule and one preview for the mobile and web home screens.
export function HomeCareerSections({ authRole, t, talent, savedTalentIds, onToggleSave, onOpenTalent, onViewAll, children }) {
  const requests = talent.filter(person => person.status === 'active').slice(0, 3);
  const seeking = (
    <section aria-label="Job-seeking requests" key="seeking">
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <h3 className={`text-lg font-extrabold tracking-tight ${t.text}`}>Job-seeking requests</h3>
        <button onClick={onViewAll} className="shrink-0 text-sm font-bold text-[#1D9BF0] hover:underline focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded-md">See All</button>
      </div>
      <div className={`rounded-2xl border ${t.border} ${t.card} overflow-hidden`}>
        <div className={`px-4 py-3 border-b ${t.borderSoft} flex items-center gap-2 text-xs font-bold ${t.textMuted}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Students open to their next opportunity
        </div>
        {requests.map(person => (
          <div key={person.id} className={`flex items-center gap-1 px-3 py-1 border-b last:border-0 ${t.borderSoft}`}>
            <button onClick={() => onOpenTalent(person)} className="flex-1 min-w-0 flex items-center gap-3 text-left rounded-xl p-2 py-3 hover:bg-[#1D9BF0]/5 active:scale-[0.99] transition-colors focus-visible:ring-2 focus-visible:ring-[#1D9BF0]">
              <span className="w-10 h-10 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center shrink-0"><UserRound size={19} /></span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-extrabold leading-snug ${t.text}`}>{person.headline}</span>
                <span className={`flex flex-wrap items-center gap-1 mt-1 text-[11px] font-semibold ${t.textMuted}`}>
                  {person.student.name} {person.student.verified && <BadgeCheck size={13} className="text-[#1D9BF0]" />} <span>· {person.student.department}</span>
                </span>
                <span className={`block mt-2 text-[10px] font-bold ${t.textMuted}`}>{person.category} · {person.workMode.join(' / ')}</span>
              </span>
              <ChevronRight size={16} className={`shrink-0 ${t.textMuted}`} />
            </button>
            <button onClick={() => onToggleSave(person.id)} aria-label={`${savedTalentIds.has(person.id) ? 'Unsave' : 'Save'} ${person.student.name}`} aria-pressed={savedTalentIds.has(person.id)} className={`p-3 rounded-xl hover:bg-[#1D9BF0]/10 focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${savedTalentIds.has(person.id) ? 'text-[#1D9BF0]' : t.textMuted}`}>
              <Bookmark size={17} fill={savedTalentIds.has(person.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
        {requests.length === 0 && <p className={`p-6 text-sm ${t.textMuted}`}>No open requests right now. Check back soon.</p>}
        <button onClick={onViewAll} className="flex w-full justify-between items-center px-5 py-4 text-xs font-extrabold text-[#1D9BF0] bg-[#1D9BF0]/5 hover:bg-[#1D9BF0]/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D9BF0]">Explore student talent <ArrowUpRight size={16} /></button>
      </div>
    </section>
  );
  const jobs = <section key="jobs" aria-label="Latest job offerings">{children}</section>;
  return <div className="space-y-7 mb-7">{authRole === 'alumni' || authRole === 'faculty' ? [seeking, jobs] : [jobs, seeking]}</div>;
}

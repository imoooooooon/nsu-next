import { useNavigate } from 'react-router-dom';
import { Briefcase, BookmarkIcon, Clock, ChevronRight, User, BadgeCheck } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { TintedCard } from '../../components/ui';

/* The emerald-tinted job card — the exact mobile card, grid-friendly on web. */
export const JobCard = ({ job, onSelect, onSelectPoster, className = '' }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

  const openJob = onSelect || ((j) => navigate(`/jobs/${j.id}`));

  return (
    <TintedCard tint="emerald" interactive className={`p-5 h-full ${className}`} contentClassName="flex flex-col h-full" onClick={() => openJob(job)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex space-x-2">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}>{job.type}</span>
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black/70 border border-black/10'}`}>{job.location}</span>
        </div>
        <button aria-label={`Save ${job.title}`} className="text-gray-400 hover:text-emerald-500 transition-colors active:scale-95" onClick={(e) => e.stopPropagation()}>
          <BookmarkIcon className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      <h3 className={`text-lg font-extrabold tracking-tight ${t.text} mb-1.5 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors`}>{job.title}</h3>

      <div className="flex items-center space-x-1.5 mb-3">
        <Briefcase className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
        <p className={`text-xs font-bold ${t.textMuted}`}>{job.company}</p>
        <span className="w-1 h-1 rounded-full bg-gray-400/50"></span>
        <p className={`text-xs font-bold ${t.textMuted}`}>{job.salary}</p>
      </div>

      <p className={`text-[11px] font-bold ${t.textMuted} line-clamp-2 mb-3 leading-relaxed`}>{job.preview}</p>

      {job.postedBy && (
        <div
          className="flex items-center space-x-2.5 mb-4 cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectPoster) onSelectPoster(job.postedBy);
            else navigate(`/network/${job.postedBy.userId}`);
          }}
        >
          <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-white/10' : 'bg-white border border-gray-200'} shadow-sm flex items-center justify-center shrink-0`}>
            <User className={`w-3.5 h-3.5 ${t.text}`} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-0.5`}>Posted By</p>
            <div className="flex items-center space-x-1.5">
              <span className={`text-[11px] font-extrabold ${t.text} truncate`}>{job.postedBy.name}</span>
              {job.postedBy.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${job.postedBy.type === 'Faculty' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                {job.postedBy.type}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={`mt-auto flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
        <div>
          {job.urgent ? (
            <span className="flex items-center text-red-500 text-[10px] font-extrabold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
              <Clock className="w-3 h-3 mr-1" strokeWidth={3} /> {job.deadline}
            </span>
          ) : (
            <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posted {job.posted}</span>
          )}
        </div>
        <span className={`flex items-center text-[11px] font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          View Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" strokeWidth={3} />
        </span>
      </div>
    </TintedCard>
  );
};

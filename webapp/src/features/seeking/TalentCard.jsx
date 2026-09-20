import { BadgeCheck, Bookmark, MessageSquare } from 'lucide-react';
import { isSeekingUnavailable, getSeekingCategoryStyle } from './utils';
import { SEEKING_STATUS_LABEL } from './constants';

/* --- SEEKING: REUSABLE TALENT CARD ---
   Ported 1:1 from mobile; `h-full flex flex-col` added so cards keep equal
   height inside the web feed grid (footer + CTA anchored to the bottom). */
export const TalentCard = ({ talent, t, isDark, isSaved, onOpen, onToggleSave, onMessage, previewMode = false }) => {
  if (!talent) return null;

  const unavailable = isSeekingUnavailable(talent.status);
  const name = talent.student?.name || 'NSU Student';
  const firstName = name.split(' ')[0];

  const handleKeyDown = (e) => {
    if (previewMode || !onOpen) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(talent);
    }
  };

  return (
    <div
      role={previewMode ? undefined : 'button'}
      tabIndex={previewMode ? undefined : 0}
      aria-label={previewMode ? undefined : `Open details for ${name}`}
      onClick={previewMode ? undefined : () => onOpen?.(talent)}
      onKeyDown={handleKeyDown}
      className={`h-full flex flex-col rounded-2xl p-4 ${t.card} border ${t.border} ${t.cardShadow} transition-all outline-none ${
        previewMode
          ? 'select-none'
          : 'cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.99]'
      } ${unavailable ? 'opacity-75' : ''}`}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border shrink-0 ${getSeekingCategoryStyle(talent.category, isDark)}`}>
          {talent.category}
        </span>
        <button
          type="button"
          disabled={previewMode}
          aria-label={isSaved ? `Remove ${name} from saved profiles` : `Save ${name}`}
          aria-pressed={!!isSaved}
          onClick={(e) => { e.stopPropagation(); onToggleSave?.(talent.id); }}
          className={`shrink-0 -mt-0.5 -mr-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
            isSaved ? 'text-[#1D9BF0]' : `${t.textMuted} hover:text-[#1D9BF0]`
          } ${previewMode ? 'cursor-default' : 'active:scale-90'}`}
        >
          <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className={`text-[15px] font-extrabold tracking-tight ${t.text} leading-tight truncate`}>
        {talent.headline}
      </h3>

      <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
        <span className={`text-xs font-bold ${t.text} truncate max-w-[55%]`}>{name}</span>
        {talent.student?.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
        <span className={`text-[11px] font-bold ${t.textMuted} truncate`}>
          · {talent.student?.department} · {talent.student?.batch}
        </span>
      </div>

      <p className={`flex-1 text-[11px] font-medium ${t.textMuted} leading-relaxed mt-2.5 line-clamp-2 min-h-[36px]`}>
        {talent.bioPreview}
      </p>

      <div className={`flex items-center justify-between mt-3 pt-3 border-t ${t.borderSoft}`}>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>
          {unavailable ? SEEKING_STATUS_LABEL[talent.status] : talent.availability}
        </span>
        <span className={`text-[10px] font-bold ${t.textMuted}`}>{talent.posted}</span>
      </div>

      <button
        type="button"
        disabled={previewMode || unavailable}
        aria-label={unavailable ? 'No longer available' : `Message ${firstName}`}
        onClick={(e) => { e.stopPropagation(); onMessage?.(talent); }}
        className={`w-full h-10 mt-3 rounded-lg font-extrabold text-xs flex items-center justify-center space-x-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D9BF0] ${
          unavailable
            ? `${isDark ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/35'} cursor-not-allowed`
            : `bg-[#1D9BF0] text-white shadow-sm ${previewMode ? 'cursor-default' : 'hover:bg-[#1A8CD8] active:scale-[0.98]'}`
        }`}
      >
        <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
        <span>{unavailable ? 'No Longer Available' : 'Message'}</span>
      </button>
    </div>
  );
};

import { useState } from 'react';
import { AlertTriangle, ArrowLeft, BadgeCheck, Bookmark, Briefcase, CalendarClock, CircleDollarSign, Clock, Copy, Eye, FileText, Flag, Github, Globe, Link2, Linkedin, MapPin, Monitor, MoreVertical, Send, Share, User } from 'lucide-react';
import { SEEKING_STATUS_LABEL } from './constants';
import { isSeekingUnavailable, getSeekingCategoryStyle, getSeekingStatusStyle } from './utils';
import { SeekingDetailRow, SeekingLinkRow, SeekingActionSheet } from './SeekingPrimitives';

// --- SEEKING: TALENT DETAILS ---
export const TalentDetailsOverlay = ({ talent, t, isDark, isSaved, onToggleSave, onBack, onMessage, onToast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!talent) return null;

  const isOwnPost = talent.student?.id === 'me';
  const unavailable = isSeekingUnavailable(talent.status);
  const name = talent.student?.name || 'NSU Student';
  const firstName = name.split(' ')[0];

  const links = [
    talent.resumeUrl && { key: 'resume', icon: FileText, label: 'Resume' },
    talent.portfolioUrl && { key: 'portfolio', icon: Globe, label: 'Portfolio' },
    talent.linkedInUrl && { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    talent.githubUrl && { key: 'github', icon: Github, label: 'GitHub' },
    talent.otherUrl && { key: 'other', icon: Link2, label: 'Other Link' }
  ].filter(Boolean);

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-15' : 'opacity-[0.15]'}`} />
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <button type="button" aria-label="Go back" onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Talent Details</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isSaved ? 'Remove from saved profiles' : 'Save profile'}
            aria-pressed={!!isSaved}
            onClick={() => onToggleSave(talent.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 ${isSaved ? 'text-[#1D9BF0]' : t.text}`}
          >
            <Bookmark className="w-5 h-5" strokeWidth={2.5} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            aria-label="More options"
            onClick={() => setIsMenuOpen(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}
          >
            <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10">
        <div className={`m-5 mt-6 rounded-2xl p-6 relative overflow-hidden ${t.cardShadow} border ${t.border}`}>
          <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white/90 to-[#1D9BF0]/10 backdrop-blur-3xl'}`} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-white/5' : 'bg-white/60'} border-2 ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center mb-4 shadow-lg`}>
              <User className={`w-9 h-9 ${t.text}`} strokeWidth={1.5} />
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1 max-w-full">
              <h2 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} truncate`}>{name}</h2>
              {talent.student?.verified && <BadgeCheck className="w-5 h-5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
            </div>
            <p className={`text-xs font-bold ${t.textMuted}`}>
              {talent.student?.department} · Batch {talent.student?.batch}
            </p>
            <p className={`text-[11px] font-bold ${t.textMuted} opacity-80 mt-0.5`}>North South University</p>
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-3`}>Posted {talent.posted}</p>
          </div>
        </div>

        <div className="px-5 space-y-5">
          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(talent.category, isDark)}`}>
                {talent.category}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingStatusStyle(talent.status, isDark)}`}>
                {SEEKING_STATUS_LABEL[talent.status] || 'Active'}
              </span>
            </div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight leading-tight`}>{talent.headline}</h3>
            <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${t.borderSoft}`}>
              <Clock className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
              <span className={`text-xs font-bold ${t.textMuted}`}>{talent.availability}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400/50" />
              <span className={`text-xs font-bold ${t.textMuted}`}>
                {talent.expiresIn === 'Expired' ? 'Expired' : `Expires in ${talent.expiresIn}`}
              </span>
            </div>
          </div>

          {unavailable && (
            <div className={`rounded-2xl p-4 border flex items-start gap-3 ${isDark ? 'bg-red-500/10 border-red-400/25' : 'bg-red-50 border-red-100'}`}>
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                {isOwnPost
                  ? `This post is ${SEEKING_STATUS_LABEL[talent.status].toLowerCase()} and is not visible to the network.`
                  : 'This student is no longer available for this opportunity.'}
              </p>
            </div>
          )}

          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90`}>{talent.fullBio}</p>
          </div>

          {talent.skills?.length > 0 && (
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span key={skill} className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold border ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-black/[0.03] text-gray-700 border-black/[0.06]'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Work Preferences</h3>
            <div className="space-y-4">
              <SeekingDetailRow icon={Monitor} label="Work Mode" value={(talent.workMode || []).join(' · ') || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={MapPin} label="Location" value={talent.location || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Clock} label="Availability" value={talent.availability || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Briefcase} label="Commitment" value={talent.commitment || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={CalendarClock} label="Preferred Duration" value={talent.preferredDuration || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={CircleDollarSign} label="Compensation" value={talent.compensation || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Eye} label="Visibility" value={talent.visibility || '—'} t={t} isDark={isDark} />
            </div>
          </div>

          {links.length > 0 && (
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Supporting Links</h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <SeekingLinkRow
                    key={link.key}
                    icon={link.icon}
                    label={link.label}
                    t={t}
                    isDark={isDark}
                    onClick={() => onToast(`${link.label} is not available in this prototype`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
        <button
          type="button"
          disabled={unavailable || isOwnPost}
          onClick={() => onMessage(talent)}
          className={`w-full h-14 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
            unavailable || isOwnPost
              ? 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
              : 'active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40'
          }`}
        >
          {!unavailable && !isOwnPost && <Send className="w-5 h-5" strokeWidth={2.5} />}
          <span className="truncate">
            {isOwnPost ? 'This Is Your Post' : unavailable ? 'No Longer Available' : `Message ${firstName}`}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <SeekingActionSheet
          title={talent.headline}
          t={t}
          isDark={isDark}
          onClose={() => setIsMenuOpen(false)}
          actions={[
            {
              label: isSaved ? 'Remove from Saved' : 'Save Profile', icon: Bookmark,
              onClick: () => { onToggleSave(talent.id); setIsMenuOpen(false); }
            },
            { label: 'Share Profile', icon: Share, onClick: () => { setIsMenuOpen(false); onToast('Share sheet is not available in this prototype'); } },
            { label: 'Copy Post Link', icon: Copy, onClick: () => { setIsMenuOpen(false); onToast('Post link copied'); } },
            ...(isOwnPost ? [] : [{ label: 'Report Post', icon: Flag, isDestructive: true, onClick: () => { setIsMenuOpen(false); onToast('Report submitted for review'); } }])
          ]}
        />
      )}
    </div>
  );
};

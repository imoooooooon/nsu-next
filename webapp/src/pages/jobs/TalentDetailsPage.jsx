import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, BadgeCheck, Bookmark, Briefcase, CalendarClock, CalendarDays,
  CircleDollarSign, Clock, Copy, Eye, FileText, Flag, Github, Globe, Link2, Linkedin,
  MapPin, Monitor, MoreVertical, Search, Send, Share, User
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer } from '../../components/layout/AppShell';
import { ActionSheetModal, Button, Card, EmptyState, IconButton, TintedCard } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';
import { globalSeekingData } from '../../features/seeking/data';
import { SEEKING_STATUS_LABEL } from '../../features/seeking/constants';
import { isSeekingUnavailable, getSeekingCategoryStyle, getSeekingStatusStyle } from '../../features/seeking/utils';
import { SeekingDetailRow, SeekingLinkRow } from '../../features/seeking/SeekingPrimitives';

/* --- SEEKING: TALENT DETAILS (route /jobs/seeking/:talentId) --- */
export default function TalentDetailsPage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const { talentId } = useParams();
  const close = useCloseTo('/jobs/seeking');
  const { savedTalentIds, handleToggleSavedTalent, mySeekingPosts, setChatContext, showToast } = useAppState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Own posts are looked up too, so View / Preview from My Posts reuses this page.
  const talent = useMemo(
    () =>
      globalSeekingData.find((item) => item.id === talentId) ||
      mySeekingPosts.find((item) => item.id === talentId) ||
      null,
    [talentId, mySeekingPosts]
  );

  if (!talent) {
    return (
      <PageContainer className="animate-fade-in">
        <div className={`pt-16 ${t.text}`}>
          <EmptyState
            icon={Search}
            title="Talent post not found"
            subtitle="This Seeking Work post may have been removed or expired."
            action="Back to Seeking"
            onAction={() => navigate('/jobs/seeking')}
          />
        </div>
      </PageContainer>
    );
  }

  const isOwnPost = talent.student?.id === 'me';
  const unavailable = isSeekingUnavailable(talent.status);
  const isSaved = savedTalentIds.has(talent.id);
  const name = talent.student?.name || 'NSU Student';
  const firstName = name.split(' ')[0];
  const ctaLabel = isOwnPost ? 'This Is Your Post' : unavailable ? 'No Longer Available' : `Message ${firstName}`;
  const expiryText =
    talent.expiresIn === 'Expired' ? 'Expired' : talent.expiresIn === '—' ? 'No end date' : `Expires in ${talent.expiresIn}`;

  const links = [
    talent.resumeUrl && { key: 'resume', icon: FileText, label: 'Resume' },
    talent.portfolioUrl && { key: 'portfolio', icon: Globe, label: 'Portfolio' },
    talent.linkedInUrl && { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    talent.githubUrl && { key: 'github', icon: Github, label: 'GitHub' },
    talent.otherUrl && { key: 'other', icon: Link2, label: 'Other Link' }
  ].filter(Boolean);

  // Same hand-off as the Seeking feed: the Messages module renders /messages/new
  // from chatContext.
  const handleMessage = () => {
    if (!talent || isSeekingUnavailable(talent.status)) return;
    setChatContext({
      peer: {
        name,
        role: 'Student',
        subtitle: `${talent.student?.department || 'NSU'} · Batch ${talent.student?.batch || '—'}`
      },
      seeking: { id: talent.id, headline: talent.headline, category: talent.category }
    });
    navigate('/messages/new');
    showToast(`Opening chat with ${firstName}`);
  };

  const workPreferencesCard = (
    <Card>
      <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Work Preferences</h3>
      <div className="space-y-4">
        <SeekingDetailRow icon={Monitor} label="Work Mode" value={(talent.workMode || []).join(' · ') || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={MapPin} label="Location" value={talent.location || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={Clock} label="Availability" value={talent.availability || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={Briefcase} label="Commitment" value={talent.commitment || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={CalendarClock} label="Preferred Duration" value={talent.preferredDuration || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={CircleDollarSign} label="Compensation" value={talent.compensation || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={Eye} label="Visibility" value={talent.visibility || '—'} t={t} isDark={isDark} />
        <SeekingDetailRow icon={CalendarDays} label="Posted" value={`${talent.posted} · ${expiryText}`} t={t} isDark={isDark} />
      </div>
    </Card>
  );

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex items-center justify-between gap-3 pt-8 lg:pt-10 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <IconButton icon={ArrowLeft} label="Back to seeking" onClick={close} />
          <h2 className={`text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${t.text} truncate`}>
            Talent Details
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconButton
            icon={Bookmark}
            label={isSaved ? 'Remove from saved profiles' : 'Save profile'}
            aria-pressed={isSaved}
            active={isSaved}
            iconClassName={isSaved ? 'fill-current' : ''}
            onClick={() => handleToggleSavedTalent(talent.id)}
          />
          <IconButton icon={MoreVertical} label="More options" onClick={() => setIsMenuOpen(true)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start pb-24 lg:pb-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          <TintedCard tint="blueSoft" className="p-6" contentClassName="flex flex-col items-center text-center">
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
          </TintedCard>

          <Card>
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
          </Card>

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

          <Card>
            <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90`}>{talent.fullBio}</p>
          </Card>

          {talent.skills?.length > 0 && (
            <Card>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span key={skill} className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold border ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-black/[0.03] text-gray-700 border-black/[0.06]'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* On mobile the preferences card stays in the reading flow (mobile parity). */}
          <div className="lg:hidden">{workPreferencesCard}</div>

          {links.length > 0 && (
            <Card>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Supporting Links</h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <SeekingLinkRow
                    key={link.key}
                    icon={link.icon}
                    label={link.label}
                    t={t}
                    isDark={isDark}
                    onClick={() => showToast('Opening link (demo)')}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Desktop action rail — replaces the mobile bottom CTA bar. */}
        <div className="hidden lg:block lg:sticky lg:top-20 space-y-5">
          <Card>
            <Button
              full
              size="lg"
              disabled={unavailable || isOwnPost}
              icon={unavailable || isOwnPost ? undefined : Send}
              onClick={handleMessage}
              className={unavailable || isOwnPost ? '' : 'shadow-lg shadow-[#1D9BF0]/40'}
            >
              <span className="truncate">{ctaLabel}</span>
            </Button>
            <Button
              full
              variant="secondary"
              size="md"
              icon={Bookmark}
              aria-pressed={isSaved}
              onClick={() => handleToggleSavedTalent(talent.id)}
              className="mt-3"
            >
              {isSaved ? 'Remove from Saved' : 'Save Profile'}
            </Button>
          </Card>
          {workPreferencesCard}
        </div>
      </div>

      {/* Mobile bottom CTA bar (glass), floating above the capsule nav. */}
      <div className="lg:hidden fixed bottom-24 inset-x-0 z-30 px-5">
        <div className={`max-w-md mx-auto rounded-2xl ${t.glass} border shadow-2xl p-3`}>
          <button
            type="button"
            disabled={unavailable || isOwnPost}
            onClick={handleMessage}
            className={`w-full h-14 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              unavailable || isOwnPost
                ? 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
                : 'active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40'
            }`}
          >
            {!unavailable && !isOwnPost && <Send className="w-5 h-5" strokeWidth={2.5} />}
            <span className="truncate">{ctaLabel}</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <ActionSheetModal
          title={talent.headline}
          onClose={() => setIsMenuOpen(false)}
          actions={[
            {
              label: isSaved ? 'Remove from Saved' : 'Save Profile', icon: Bookmark,
              onClick: () => { handleToggleSavedTalent(talent.id); setIsMenuOpen(false); }
            },
            { label: 'Share Profile', icon: Share, onClick: () => { setIsMenuOpen(false); showToast('Share sheet is not available in this prototype'); } },
            { label: 'Copy Post Link', icon: Copy, onClick: () => { setIsMenuOpen(false); showToast('Post link copied'); } },
            ...(isOwnPost ? [] : [{ label: 'Report Post', icon: Flag, isDestructive: true, onClick: () => { setIsMenuOpen(false); showToast('Report submitted for review'); } }])
          ]}
        />
      )}
    </PageContainer>
  );
}

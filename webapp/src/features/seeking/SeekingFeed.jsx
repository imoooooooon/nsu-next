import { useMemo } from 'react';
import { Bookmark, Megaphone, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { SEEKING_CATEGORY_CHIPS } from './constants';
import { countSeekingFilters, getSeekingViewerProfile, isSeekingRelevant } from './utils';
import { TalentCard } from './TalentCard';
import { SeekingEmptyState } from './SeekingEmptyState';

/* --- SEEKING: FEED (rendered by the /jobs/seeking page) ---
   Ported 1:1 from mobile; the single column becomes a two-column card grid on
   wide screens and horizontal padding is left to the page container. */
export const SeekingFeed = ({
  t, isDark, authRole, talent, segment, search, category, filters,
  savedTalentIds, onSelectCategory, onOpenTalent, onToggleSave, onMessageTalent,
  onCreatePost, onOpenMyPosts, onClearFilters, onViewAll
}) => {
  const isStudent = authRole === 'student';
  const viewer = getSeekingViewerProfile(authRole);
  const query = search.trim().toLowerCase();

  const displayed = useMemo(() => {
    let list = talent.filter((item) => {
      // Saved shows every saved profile, including ones that are no longer available.
      if (segment === 'Saved') return savedTalentIds.has(item.id);
      if (item.status !== 'active') return false;
      if (segment === 'Relevant') return isSeekingRelevant(item, viewer.department);
      return true;
    });

    if (query) {
      list = list.filter((item) =>
        item.headline.toLowerCase().includes(query) ||
        item.student?.name?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.bioPreview.toLowerCase().includes(query) ||
        (item.skills || []).some((s) => s.toLowerCase().includes(query))
      );
    }

    if (category !== 'All') list = list.filter((item) => item.category === category);

    if (filters.categories.length) list = list.filter((item) => filters.categories.includes(item.category));
    if (filters.workModes.length) list = list.filter((item) => (item.workMode || []).some((m) => filters.workModes.includes(m)));
    if (filters.availability.length) list = list.filter((item) => filters.availability.includes(item.availability));
    if (filters.departments.length) list = list.filter((item) => filters.departments.includes(item.student?.department));
    if (filters.verifiedOnly) list = list.filter((item) => item.student?.verified);
    if (filters.hasPortfolio) list = list.filter((item) => !!item.portfolioUrl);
    if (filters.hasResume) list = list.filter((item) => !!item.resumeUrl);

    const sorted = [...list];
    if (filters.sort === 'Most Recent') {
      sorted.sort((a, b) => new Date(b.postedTimestamp) - new Date(a.postedTimestamp));
    } else if (filters.sort === 'Available Now') {
      sorted.sort((a, b) => {
        const rank = (x) => (x.availability === 'Available immediately' ? 0 : 1);
        return rank(a) - rank(b) || new Date(b.postedTimestamp) - new Date(a.postedTimestamp);
      });
    } else {
      sorted.sort((a, b) => {
        const rank = (x) => (isSeekingRelevant(x, viewer.department) ? 0 : 1);
        return rank(a) - rank(b) || new Date(b.postedTimestamp) - new Date(a.postedTimestamp);
      });
    }
    return sorted;
  }, [talent, segment, query, category, filters, savedTalentIds, viewer.department]);

  const hasNarrowedSearch = !!query || category !== 'All' || countSeekingFilters(filters) > 0;

  const renderEmptyState = () => {
    if (hasNarrowedSearch) {
      return (
        <SeekingEmptyState
          icon={Search} t={t} isDark={isDark}
          title="No matching students found"
          description="Try removing a filter or searching for another skill."
          actions={[
            { label: 'Clear Filters', onClick: onClearFilters, primary: true },
            { label: 'View All Talent', onClick: onViewAll }
          ]}
        />
      );
    }
    if (segment === 'Saved') {
      return (
        <SeekingEmptyState
          icon={Bookmark} t={t} isDark={isDark}
          title="No saved profiles yet"
          description="Save students you may want to contact later."
          actions={[{ label: 'Browse Talent', onClick: onViewAll, primary: true }]}
        />
      );
    }
    if (segment === 'Relevant') {
      return (
        <SeekingEmptyState
          icon={Sparkles} t={t} isDark={isDark}
          title="No relevant profiles are available right now."
          description="Relevance is based on your department and profile. Check the All segment for the full network."
          actions={[{ label: 'View All Talent', onClick: onViewAll, primary: true }]}
        />
      );
    }
    return (
      <SeekingEmptyState
        icon={Users} t={t} isDark={isDark}
        title="No students are seeking work right now"
        description="New Seeking Work posts from the verified network will appear here."
      />
    );
  };

  return (
    <div className="relative z-10 pb-10">
      <div className="flex space-x-2 overflow-x-auto hide-scrollbar pt-4 pb-1">
        {SEEKING_CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            aria-pressed={category === chip.value}
            onClick={() => onSelectCategory(chip.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold border shrink-0 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              category === chip.value
                ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
                : `${isDark ? 'bg-white/5 text-gray-400 border-white/10 hover:text-white' : 'bg-white/50 text-gray-700 border-white/60 hover:border-[#1D9BF0]/30'}`
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {isStudent ? (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/25' : 'bg-[#1D9BF0]/[0.07] border-[#1D9BF0]/20'} border flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg bg-[#1D9BF0]/15 flex items-center justify-center shrink-0`}>
              <Megaphone className="w-4 h-4 text-[#1D9BF0]" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-extrabold ${t.text} leading-tight`}>Looking for an opportunity?</p>
              <p className={`text-[11px] font-bold ${t.textMuted} truncate mt-0.5`}>Create a Seeking Work post</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onCreatePost}
                className="px-3 py-2 rounded-lg text-[11px] font-extrabold bg-[#1D9BF0] text-white shadow-sm active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
              >
                Post
              </button>
              <button
                type="button"
                onClick={onOpenMyPosts}
                className={`px-3 py-2 rounded-lg text-[11px] font-extrabold ${t.card} border ${t.border} ${t.text} active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                My Posts
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
              <ShieldCheck className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
            </div>
            <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
              Discover verified students currently open to work.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4">
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayed.map((item) => (
              <TalentCard
                key={item.id}
                talent={item}
                t={t}
                isDark={isDark}
                isSaved={savedTalentIds.has(item.id)}
                onOpen={onOpenTalent}
                onToggleSave={onToggleSave}
                onMessage={onMessageTalent}
              />
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

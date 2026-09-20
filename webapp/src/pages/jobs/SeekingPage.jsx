import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { Button, ChipTabs, Fab, IconButton, SearchInput } from '../../components/ui';
import { JobsModeToggle } from '../../features/jobs/JobsModeToggle';
import { SeekingFeed } from '../../features/seeking/SeekingFeed';
import { SeekingFiltersSheet } from '../../features/seeking/SeekingFiltersSheet';
import { globalSeekingData } from '../../features/seeking/data';
import { EMPTY_SEEKING_FILTERS } from '../../features/seeking/constants';
import { countSeekingFilters, isSeekingUnavailable } from '../../features/seeking/utils';

const SEEKING_SEGMENTS = ['All', 'Relevant', 'Saved'];

/* Jobs › Seeking — verified student talent feed (route /jobs/seeking). */
export default function SeekingPage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const {
    authRole, showToast, setChatContext,
    seekingFilters, setSeekingFilters,
    savedTalentIds, handleToggleSavedTalent,
  } = useAppState();

  const [segment, setSegment] = useState('All');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isStudent = authRole === 'student';
  const filterCount = countSeekingFilters(seekingFilters);

  const handleApplyFilters = (next) => {
    setSeekingFilters(next);
    setIsFilterOpen(false);
    const count = countSeekingFilters(next);
    showToast(count > 0 ? `${count} filter${count > 1 ? 's' : ''} applied` : 'Filters cleared');
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setSeekingFilters(EMPTY_SEEKING_FILTERS);
  };

  const handleViewAll = () => {
    handleClearFilters();
    setSegment('All');
  };

  // Hands the conversation over to the Messages module, carrying the Seeking
  // post as context so the chat can show what it is regarding.
  const handleMessageTalent = (talent) => {
    if (!talent || isSeekingUnavailable(talent.status)) return;
    const name = talent.student?.name || 'NSU Student';
    setChatContext({
      peer: {
        name,
        role: 'Student',
        subtitle: `${talent.student?.department || 'NSU'} · Batch ${talent.student?.batch || '—'}`
      },
      seeking: { id: talent.id, headline: talent.headline, category: talent.category }
    });
    navigate('/messages/new');
    showToast(`Opening chat with ${name.split(' ')[0]}`);
  };

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader title="Jobs" subtitle="Verified student talent, open to work">
        {isStudent && (
          <div className="hidden lg:block">
            <Button size="sm" icon={Plus} onClick={() => navigate('/jobs/seeking/new')}>
              Post what you're seeking
            </Button>
          </div>
        )}
        <IconButton
          icon={SlidersHorizontal}
          label="Filter talent"
          active={filterCount > 0}
          badge={filterCount > 0 ? filterCount : null}
          onClick={() => setIsFilterOpen(true)}
        />
      </PageHeader>

      <JobsModeToggle mode="seeking" className="max-w-sm" />

      <SearchInput
        className="mt-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search skills, roles or students..."
        aria-label="Search seeking work posts"
      />

      <ChipTabs className="mt-4" options={SEEKING_SEGMENTS} value={segment} onChange={setSegment} />

      <SeekingFeed
        t={t}
        isDark={isDark}
        authRole={authRole}
        talent={globalSeekingData}
        segment={segment}
        search={search}
        category={category}
        filters={seekingFilters}
        savedTalentIds={savedTalentIds}
        onSelectCategory={setCategory}
        onOpenTalent={(talent) => navigate(`/jobs/seeking/${talent.id}`)}
        onToggleSave={handleToggleSavedTalent}
        onMessageTalent={handleMessageTalent}
        onCreatePost={() => navigate('/jobs/seeking/new')}
        onOpenMyPosts={() => navigate('/jobs/seeking/my-posts')}
        onClearFilters={handleClearFilters}
        onViewAll={handleViewAll}
      />

      {isStudent && (
        <Fab
          icon={Plus}
          label="Post what you're seeking"
          className="lg:hidden fixed bottom-28 right-5 z-30"
          onClick={() => navigate('/jobs/seeking/new')}
        />
      )}

      {isFilterOpen && (
        <SeekingFiltersSheet
          filters={seekingFilters}
          t={t}
          isDark={isDark}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      )}
    </PageContainer>
  );
}

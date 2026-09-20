import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ListFilter, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { Card, EmptyState, IconButton, SearchInput } from '../../components/ui';
import { EventCard } from '../../features/events/EventPrimitives';
import { EVENTS_REFERENCE_DATE, globalEventsData } from '../../data/events';
import { useCloseTo } from '../../lib/navigation';

const STATUS_FILTERS = ['All', 'Upcoming', 'Closing Soon', 'Past'];
const CATEGORY_FILTERS = ['All', 'Academic', 'Workshop', 'Competition', 'Career', 'Cultural'];

/* /events/browse — ported from EventsBrowseScreen in the mobile app. */
export default function EventsBrowsePage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const goBack = useCloseTo('/events');
  const [searchParams] = useSearchParams();

  const [filter, setFilter] = useState(searchParams.get('filter') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  let displayed = [...globalEventsData];

  if (filter === 'Closing Soon') displayed = displayed.filter(e => e.registrationStatus === 'Closing Soon');
  else if (filter === 'Past') displayed = displayed.filter(e => new Date(e.date) < EVENTS_REFERENCE_DATE);
  else if (filter === 'Upcoming') displayed = displayed.filter(e => new Date(e.date) >= EVENTS_REFERENCE_DATE);

  if (category !== 'All') displayed = displayed.filter(e => e.category === category);

  if (search.trim()) {
    displayed = displayed.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter !== 'Past') {
    displayed.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    displayed.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const chipClass = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? 'bg-[#1D9BF0] text-white border-[#1D9BF0]'
        : `${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`
    }`;

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex items-center gap-3">
        <IconButton icon={ArrowLeft} label="Back" onClick={goBack} />
        <PageHeader className="flex-1" title="Browse Events" subtitle={`${displayed.length} results`} />
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-2 mb-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search..."
          rounded="rounded-xl"
          className="flex-1"
        />
        <IconButton
          icon={SlidersHorizontal}
          label="Toggle filters"
          size="lg"
          active={isFilterOpen}
          onClick={() => setIsFilterOpen(o => !o)}
        />
      </div>

      {/* Filter panel */}
      {isFilterOpen && (
        <Card padded={false} className="p-4 mb-5 animate-fade-in-up">
          <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-3`}>Status Filter</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={chipClass(filter === f)}>
                {f}
              </button>
            ))}
          </div>
          <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-3`}>Category</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map(c => (
              <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className={chipClass(category === c)}>
                {c}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map(ev => (
            <EventCard key={ev.id} event={ev} variant="compact" onClick={(e) => navigate(`/events/${e.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={ListFilter} title="No events match these filters." />
      )}
    </PageContainer>
  );
}

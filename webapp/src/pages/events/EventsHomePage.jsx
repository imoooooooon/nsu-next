import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, BookmarkIcon, CalendarDays, ChevronRight, Clock, Plus, Search } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { Button, ChipTabs, EmptyState, Fab, IconButton, MicroHeading, SearchInput, SectionHeading } from '../../components/ui';
import { EventCard } from '../../features/events/EventPrimitives';
import { FeaturedEventsCarousel } from '../../features/events/FeaturedEventsCarousel';
import { EVENT_CATEGORIES, EVENTS_REFERENCE_DATE, globalEventsData } from '../../data/events';

/* /events — the Events hub, ported from EventsHomeScreen in the mobile app. */
export default function EventsHomePage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const openEvent = (ev) => navigate(`/events/${ev.id}`);

  const upcomingEvents = globalEventsData
    .filter(e => new Date(e.date) >= EVENTS_REFERENCE_DATE)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const featuredEvents = upcomingEvents.filter(e => e.featured);
  const recommendedEvents = upcomingEvents.filter(e => e.recommendationReason);
  const popularEvents = upcomingEvents.filter(e => e.popular).sort((a, b) => b.goingCount - a.goingCount);

  const closingSoonCount = upcomingEvents.filter(e => e.registrationStatus === 'Closing Soon').length;

  const displayUpcoming = upcomingEvents.filter(e => activeCategory === 'All' || e.category === activeCategory).slice(0, 4);
  const displayRecommended = recommendedEvents.filter(e => activeCategory === 'All' || e.category === activeCategory);

  const searchResults = searchQuery.trim()
    ? globalEventsData.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader title="Events" subtitle="What's happening across campus">
        <IconButton icon={CalendarDays} label="Open Calendar" onClick={() => navigate('/events/calendar')} />
        <IconButton icon={BookmarkIcon} label="My Events" onClick={() => navigate('/events/my')} />
        <Button size="sm" icon={Plus} onClick={() => navigate('/events/create')}>Create Event</Button>
      </PageHeader>

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        placeholder="Search events, organizers..."
        height="h-12"
        rounded="rounded-xl"
        className="mb-5"
      />

      {searchQuery.trim() ? (
        <div className="animate-fade-in">
          <MicroHeading>Search Results ({searchResults.length})</MicroHeading>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(ev => (
                <EventCard key={ev.id} event={ev} variant="compact" onClick={openEvent} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Search} title={`No events found for "${searchQuery}"`} />
          )}
        </div>
      ) : (
        <>
          {/* Deadline Alert */}
          {closingSoonCount > 0 && (
            <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={2.5} />
                <p className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                  {closingSoonCount} registration{closingSoonCount > 1 ? 's close' : ' closes'} soon
                </p>
              </div>
              <button
                onClick={() => navigate('/events/browse?filter=Closing%20Soon')}
                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold active:scale-95 transition-transform shrink-0 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                View
              </button>
            </div>
          )}

          {/* Two columns on xl: the carousel keeps the mobile 13:8 ratio, so a
              full-frame hero would be ~700px tall. A main column holds it at a
              sane height and the digest moves into a rail. */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 min-w-0">
          <FeaturedEventsCarousel events={featuredEvents} onEventClick={openEvent} />

          {/* Category chip rail */}
          <ChipTabs
            options={EVENT_CATEGORIES}
            value={activeCategory}
            onChange={setActiveCategory}
            rounded="rounded-full"
            className="mb-8 -mx-5 px-5 lg:mx-0 lg:px-0"
          />

          {/* Upcoming Events */}
          <div className="mb-8">
            <SectionHeading
              title="Upcoming Events"
              action="See All"
              onAction={() => navigate(`/events/browse?category=${encodeURIComponent(activeCategory)}`)}
            />
            {displayUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayUpcoming.map(ev => (
                  <EventCard key={ev.id} event={ev} variant="standard" onClick={openEvent} />
                ))}
              </div>
            ) : (
              <div className={`p-8 rounded-2xl border border-dashed ${isDark ? 'border-white/15' : 'border-black/10'} text-center`}>
                <p className={`text-xs font-bold ${t.textMuted}`}>No upcoming events in this category.</p>
              </div>
            )}
          </div>

          {/* Recommended For You */}
          {displayRecommended.length > 0 && (
            <div className="mb-8">
              <SectionHeading title="Recommended For You" />
              <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 lg:overflow-visible">
                {displayRecommended.map(ev => (
                  <EventCard key={ev.id} event={ev} variant="recommended" onClick={openEvent} />
                ))}
              </div>
            </div>
          )}

          </div>

          {/* ------------------------------------------------------- rail */}
          <aside className="xl:col-span-1 min-w-0 xl:sticky xl:top-20">
          {/* Popular This Week */}
          <div className="mb-6">
            <SectionHeading title="Popular This Week" />
            <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden shadow-sm`}>
              {popularEvents.slice(0, 3).map((ev, idx) => (
                <div
                  key={ev.id}
                  onClick={() => openEvent(ev)}
                  className={`flex items-center p-4 border-b ${t.borderSoft} last:border-0 ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-colors cursor-pointer group active:scale-[0.99]`}
                >
                  <div className="w-6 font-black text-xl text-[#1D9BF0]/40 mr-3 text-center">{idx + 1}</div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className={`text-sm font-extrabold ${t.text} truncate mb-0.5 group-hover:text-[#1D9BF0] transition-colors`}>{ev.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold ${t.textMuted} whitespace-nowrap`}>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></span>
                      <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{ev.organizer.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`text-[10px] font-extrabold ${t.text} mb-1 whitespace-nowrap`}>{ev.goingCount} Going</span>
                    <ChevronRight className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events Link */}
          <button
            onClick={() => navigate('/events/browse?filter=Past')}
            className={`w-full py-4 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} border border-transparent text-center transition-all active:scale-[0.98] flex items-center justify-center space-x-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <Archive className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
            <span className={`text-sm font-extrabold ${t.textMuted}`}>View Past Events</span>
          </button>
          </aside>
          </div>
        </>
      )}

      {/* Mobile floating action button */}
      <Fab
        icon={Plus}
        label="Create Event"
        className="lg:hidden fixed bottom-28 right-5 z-30"
        onClick={() => navigate('/events/create')}
      />
    </PageContainer>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookmarkIcon } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { ChipTabs, EmptyState, IconButton, MicroHeading } from '../../components/ui';
import { EventCard } from '../../features/events/EventPrimitives';
import { EVENTS_REFERENCE_DATE, globalEventsData } from '../../data/events';
import { useCloseTo } from '../../lib/navigation';

const SEGMENTS = ['Going', 'Interested', 'Registered', 'Past'];

/* /events/my — ported from MyEventsScreen in the mobile app. */
export default function MyEventsPage() {
  const navigate = useNavigate();
  const goBack = useCloseTo('/events');
  const { registeredEventIds, goingEventIds, interestedEventIds } = useAppState();
  const [segment, setSegment] = useState('Going');

  let displayed = [];
  if (segment === 'Going') displayed = globalEventsData.filter(e => goingEventIds.has(e.id));
  if (segment === 'Interested') displayed = globalEventsData.filter(e => interestedEventIds.has(e.id));
  if (segment === 'Registered') displayed = globalEventsData.filter(e => registeredEventIds.has(e.id));
  if (segment === 'Past') displayed = globalEventsData.filter(e => new Date(e.date) < EVENTS_REFERENCE_DATE && (goingEventIds.has(e.id) || registeredEventIds.has(e.id)));

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex items-center gap-3">
        <IconButton icon={ArrowLeft} label="Back" onClick={goBack} />
        <PageHeader className="flex-1" title="My Events" />
      </div>

      <ChipTabs options={SEGMENTS} value={segment} onChange={setSegment} className="mb-6 -mx-5 px-5 lg:mx-0 lg:px-0" />

      <MicroHeading>{segment} ({displayed.length})</MicroHeading>

      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map(ev => (
            <EventCard key={ev.id} event={ev} variant="compact" onClick={(e) => navigate(`/events/${e.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookmarkIcon}
          title="No events in this category."
          action={segment !== 'Past' ? 'Browse Events' : undefined}
          onAction={() => navigate('/events/browse')}
        />
      )}
    </PageContainer>
  );
}

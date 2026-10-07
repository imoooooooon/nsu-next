import { recordParticipation } from '../../../../src/shared/adminBridge.js';
import { currentViewer } from '../../../../src/shared/departmentStore.js';
import { useAdminBridge } from '../../../../src/shared/useAdminBridge.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowUpRight, BadgeCheck, Users, Bell, Building2, CalendarDays, CheckCircle2, Clock, Heart, MapPin } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer } from '../../components/layout/AppShell';
import { Card, EmptyState, SmartImage } from '../../components/ui';
import { EventCard, EventStatusBadge, useEventStatus } from '../../features/events/EventPrimitives';
import { findEventById, globalEventsData, getEventOrganizers } from '../../data/events';
import { findDepartmentById } from '../../data/departments';
import { EntityAvatar } from '../../features/departments/DepartmentPrimitives';
import { useCloseTo } from '../../lib/navigation';

/* /events/:eventId — ported from EventDetailsScreen in the mobile app,
   with the mobile bottom CTA replaced by a sticky action rail on desktop. */
export default function EventDetailsPage() {
  useAdminBridge();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = findEventById(eventId);

  if (!event) {
    return (
      <PageContainer className="animate-fade-in">
        <EmptyState
          icon={CalendarDays}
          title="Event not found"
          subtitle="This event may have been removed or the link is incorrect."
          action="Back to Events"
          onAction={() => navigate('/events')}
        />
      </PageContainer>
    );
  }

  return <EventDetailsView key={event.id} event={event} />;
}

const EventDetailsView = ({ event }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const goBack = useCloseTo('/events');
  const {
    showToast, authRole,
    setRegisteredEventIds,
    goingEventIds, setGoingEventIds,
    interestedEventIds, setInterestedEventIds,
    reminderEventIds, setReminderEventIds,
    followedOrganizerIds, setFollowedOrganizerIds,
  } = useAppState();

  const { isRegistered, displayStatus, isPast } = useEventStatus(event);
  const isGoing = goingEventIds.has(event.id);
  const isInterested = interestedEventIds.has(event.id);
  const hasReminder = reminderEventIds.has(event.id);
  const isFollowingOrg = followedOrganizerIds.has(event.organizer.id);
  const deptOrganizer = findDepartmentById(event.deptId);
  const organizers = getEventOrganizers(event);
  const coOrganizers = organizers.slice(1);

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleRegisterToggle = () => {
    if (isPast || displayStatus === 'Closed' || displayStatus === 'Cancelled') return;
    try { recordParticipation(event, currentViewer(authRole).personId, 'registered', !isRegistered); } catch (error) { showToast(error.message); return; }
    setRegisteredEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); showToast('Registration cancelled'); }
      else { next.add(event.id); showToast('Successfully registered!'); }
      return next;
    });
  };

  const handleGoingToggle = () => {
    try { recordParticipation(event, currentViewer(authRole).personId, 'going', !isGoing); } catch (error) { showToast(error.message); return; }
    setGoingEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); showToast('Removed from Going'); }
      else { next.add(event.id); showToast('Marked as Going'); }
      return next;
    });
  };

  const handleInterestedToggle = () => {
    try { recordParticipation(event, currentViewer(authRole).personId, 'interested', !isInterested); } catch (error) { showToast(error.message); return; }
    setInterestedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); showToast('Removed from Interested'); }
      else { next.add(event.id); showToast('Added to Interested'); }
      return next;
    });
  };

  const handleReminderToggle = () => {
    setReminderEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); showToast('Reminder disabled'); }
      else { next.add(event.id); showToast('Reminder enabled'); }
      return next;
    });
  };

  const handleFollowOrg = () => {
    setFollowedOrganizerIds(prev => {
      const next = new Set(prev);
      if (next.has(event.organizer.id)) { next.delete(event.organizer.id); showToast('Organizer unfollowed'); }
      else { next.add(event.organizer.id); showToast('Organizer followed'); }
      return next;
    });
  };

  const relatedEvents = globalEventsData
    .filter(e => e.id !== event.id && (e.category === event.category || e.organizer.id === event.organizer.id))
    .slice(0, 3);

  /* Primary action state machine — exact port from mobile. */
  let primaryActionLabel = 'Register';
  let primaryActionState = 'active';
  if (displayStatus === 'Cancelled') { primaryActionLabel = 'Event Cancelled'; primaryActionState = 'disabled'; }
  else if (isPast) { primaryActionLabel = 'Event Ended'; primaryActionState = 'disabled'; }
  else if (isRegistered) { primaryActionLabel = 'Registered'; primaryActionState = 'success'; }
  else if (displayStatus === 'Free Entry') { primaryActionLabel = isGoing ? 'Going' : 'Mark as Going'; primaryActionState = isGoing ? 'success' : 'active'; }
  else if (displayStatus === 'Closed') { primaryActionLabel = 'Registration Closed'; primaryActionState = 'disabled'; }
  else if (displayStatus === 'Closing Soon') { primaryActionLabel = 'Register Now'; primaryActionState = 'danger'; }

  const handlePrimaryClick = () => {
    if (primaryActionState === 'disabled') return;
    if (displayStatus === 'Free Entry') handleGoingToggle();
    else handleRegisterToggle();
  };

  const primaryButton = (
    <button
      onClick={handlePrimaryClick}
      disabled={primaryActionState === 'disabled'}
      className={`flex-1 h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center space-x-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
        primaryActionState === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' :
        primaryActionState === 'danger' ? 'bg-amber-500 text-white shadow-amber-500/30 shadow-md' :
        primaryActionState === 'disabled' ? 'bg-gray-400 dark:bg-gray-700 text-white/70 cursor-not-allowed active:scale-100' :
        'bg-[#1D9BF0] text-white shadow-[#1D9BF0]/30 shadow-md'
      }`}
    >
      {primaryActionState === 'success' && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
      <span>{primaryActionLabel}</span>
    </button>
  );

  const reminderButton = (
    <button
      onClick={handleReminderToggle}
      aria-label="Toggle Reminder"
      className={`w-14 h-14 rounded-xl border ${t.border} ${t.card} flex items-center justify-center transition-colors active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${hasReminder ? 'border-[#1D9BF0] bg-[#1D9BF0]/10 text-[#1D9BF0]' : t.text}`}
    >
      <Bell className={`w-5 h-5 ${hasReminder ? 'fill-current' : ''}`} strokeWidth={2.5} />
    </button>
  );

  const statsStrip = (className = '') => (
    <div className={`flex items-center justify-around py-4 ${className}`}>
      <div className="text-center">
        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Going</p>
        <p className={`text-base font-extrabold ${t.text}`}>{event.goingCount}</p>
      </div>
      <div className="text-center">
        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Interested</p>
        <p className={`text-base font-extrabold ${t.text}`}>{event.interestedCount}</p>
      </div>
      <div className="text-center">
        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Capacity</p>
        <p className={`text-base font-extrabold ${t.text}`}>{event.capacity}</p>
      </div>
    </div>
  );

  return (
    <PageContainer className="animate-fade-in pb-24 lg:pb-0">
      {/* Hero */}
      <div className={`relative w-full aspect-[43/26] shrink-0 rounded-[24px] overflow-hidden mt-6 lg:mt-8 border ${isDark ? 'border-white/10' : 'border-black/5'} shadow-lg`}>
        <SmartImage src={event.image} alt={event.title} fallbackIcon={CalendarDays} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <button
            onClick={goBack}
            aria-label="Back"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-black/60"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleInterestedToggle}
            aria-label={isInterested ? 'Remove from Interested' : 'Add to Interested'}
            className={`w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/20 transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-black/60 ${isInterested ? 'text-red-500' : 'text-white'}`}
          >
            <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#1D9BF0] text-white shadow-sm">{event.category}</span>
            <EventStatusBadge status={displayStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* ------------------------------------------------ main column */}
        <div className="lg:col-span-2 min-w-0 space-y-6">
          <div>
            <h1 className={`text-2xl lg:text-3xl font-extrabold ${t.text} leading-tight tracking-tight mb-2`}>{event.title}</h1>
            {/* Who runs it vs who published it — two facts, two rows. */}
            <dl className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <dt className={`text-sm font-bold ${t.textMuted}`}>Organized by:</dt>
                <dd className={`text-sm font-extrabold ${t.text}`}>
                  {organizers.map((org, i) => (
                    <span key={org.name} className="inline-flex items-center">
                      {i > 0 && <span className={`mr-1.5 font-bold ${t.textMuted}`}>,</span>}
                      {org.name}
                      {org.verified && <BadgeCheck className="w-4 h-4 ml-1 text-[#1D9BF0]" strokeWidth={2.5} aria-label="Verified" />}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <dt className={`text-sm font-bold ${t.textMuted}`}>Posted by:</dt>
                <dd className={`text-sm font-extrabold ${t.text}`}>{event.postedBy?.name}</dd>
              </div>
            </dl>
          </div>

          {/* Date / venue info card */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} space-y-4`}>
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} flex items-center justify-center shrink-0`}>
                <CalendarDays className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className={`text-sm font-extrabold ${t.text}`}>{dateStr}</span>
                <span className={`text-xs font-bold ${t.textMuted} mt-0.5`}>{event.time} - {event.endTime}</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} flex items-center justify-center shrink-0`}>
                <MapPin className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className={`text-sm font-extrabold ${t.text}`}>{event.venue}</span>
                <span className={`text-xs font-bold ${t.textMuted} mt-0.5 leading-snug pr-2`}>{event.venueDetails}</span>
              </div>
            </div>
            {event.notificationType === 'cancelled' && (
              <div className="flex items-center space-x-2.5 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">{event.notificationMessage}</span>
              </div>
            )}
          </div>

          {/* Stats strip (desktop shows these in the action rail instead) */}
          {statsStrip('border-y border-dashed border-gray-400/30 lg:hidden')}

          {/* About */}
          <div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`text-sm font-medium ${t.text} leading-relaxed opacity-90`}>{event.description}</p>
          </div>

          {/* Schedule timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div>
              <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Schedule</h3>
              <Card padded={false} className="p-5 space-y-4">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="flex relative">
                    {idx !== event.schedule.length - 1 && (
                      <div className={`absolute left-[5px] top-6 bottom-[-16px] w-0.5 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    )}
                    <div className="w-3 h-3 rounded-full bg-[#1D9BF0] border-4 border-transparent shrink-0 mt-1 z-10 transform -translate-x-[2px]"></div>
                    <div className="ml-4 flex flex-col">
                      <span className="text-[10px] font-extrabold text-[#1D9BF0] uppercase tracking-wider mb-0.5">{item.time}</span>
                      <span className={`text-sm font-bold ${t.text}`}>{item.title}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* Registration Info */}
          <div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>Registration Info</h3>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
              <p className={`text-sm font-bold ${t.text} mb-2 leading-relaxed`}>{event.registrationInfo}</p>
              {event.registrationDeadline && (
                <p className={`text-xs font-extrabold ${t.textMuted} flex items-center mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} /> Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Organized by</h3>
            <Card padded={false} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* A department organizer is an Entity: its code tile, never a
                      generic building — the same mark as the hub and inbox. */}
                  {deptOrganizer ? (
                    <EntityAvatar dept={deptOrganizer} size="md" />
                  ) : (
                    <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
                      <Building2 className={`w-6 h-6 ${t.textMuted}`} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <h4 className={`text-base font-extrabold ${t.text} leading-tight`}>{event.organizer.name}</h4>
                      {event.organizer.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{event.organizer.type}</span>
                  </div>
                </div>
              </div>
              <p className={`text-xs font-medium ${t.text} leading-relaxed opacity-90 mb-4`}>{event.organizer.description}</p>
              <button
                onClick={handleFollowOrg}
                className={`w-full py-2.5 rounded-lg text-xs font-extrabold transition-all border active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
                  isFollowingOrg
                    ? `${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-black'}`
                    : 'bg-[#1D9BF0] border-[#1D9BF0] text-white shadow-sm'
                }`}
              >
                {isFollowingOrg ? 'Following' : 'Follow Organizer'}
              </button>
              {deptOrganizer && (
                <Link
                  to={`/departments/${deptOrganizer.id}`}
                  className="mt-3 text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded"
                >
                  Open the {deptOrganizer.short} Department hub <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
                </Link>
              )}

              {/* Co-organizers — written the same way as in the create form. */}
              {coOrganizers.length > 0 && (
                <ul className={`mt-4 pt-4 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-black/[0.06]'}`}>
                  {coOrganizers.map(org => (
                    <li key={org.name} className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                        <Users className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2} />
                      </span>
                      <span className={`text-xs font-extrabold ${t.text}`}>{org.name}</span>
                      <span className={`text-xs font-bold ${t.textMuted}`}>· {org.type}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Posted by — read-only metadata about the listing itself. */}
              {event.postedBy && (
                <p className={`mt-4 pt-4 border-t text-[11px] font-bold ${t.textMuted} ${isDark ? 'border-white/10' : 'border-black/[0.06]'}`}>
                  Posted by <span className={`font-extrabold ${t.text}`}>{event.postedBy.name}</span>
                  {event.postedBy.role && <> · {event.postedBy.role}</>}
                </p>
              )}
            </Card>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="pt-2">
              <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Related Events</h3>
              <div className="flex space-x-4 overflow-x-auto hide-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0 pb-4">
                {relatedEvents.map(ev => (
                  <EventCard key={ev.id} event={ev} variant="recommended" onClick={(e) => navigate(`/events/${e.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ desktop action rail */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Card>
              <div className="flex space-x-3">
                {primaryButton}
                {!isPast && event.registrationStatus !== 'Cancelled' && reminderButton}
              </div>
              {statsStrip('mt-4 border-t border-dashed border-gray-400/30')}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile fixed CTA bar — hidden for past / cancelled events, like mobile */}
      {!isPast && event.registrationStatus !== 'Cancelled' && (
        <div className="lg:hidden fixed bottom-24 inset-x-0 z-30 px-5 animate-slide-up">
          <div className={`${t.glass} border rounded-2xl p-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex space-x-3 max-w-3xl mx-auto`}>
            {primaryButton}
            {reminderButton}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

import { CheckCircle2, MapPin, BadgeCheck, CalendarDays, UsersRound, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { SmartImage } from '../../components/ui';
import { EVENTS_REFERENCE_DATE } from '../../data/events';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   Event building blocks — status badge, category chip, event cards.
   Ported 1:1 from the mobile prototype, with a grid-friendly standard card.
--------------------------------------------------------------------------- */

export const EventStatusBadge = ({ status }) => {
  const { isDark } = useTheme();
  if (status === 'Open') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20">Open</span>;
  if (status === 'Closing Soon') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Closing Soon</span>;
  if (status === 'Registered') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 flex items-center"><CheckCircle2 className="w-2.5 h-2.5 mr-1" strokeWidth={3}/>Registered</span>;
  if (status === 'Closed') return <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10'}`}>Closed</span>;
  if (status === 'Free Entry') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free Entry</span>;
  if (status === 'Cancelled') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Cancelled</span>;
  return null;
};

export const useEventStatus = (event) => {
  const { registeredEventIds } = useAppState();
  const isRegistered = registeredEventIds.has(event.id);
  return {
    isRegistered,
    displayStatus: isRegistered ? 'Registered' : event.registrationStatus,
    isPast: new Date(event.date) < EVENTS_REFERENCE_DATE,
  };
};

/* variant: 'standard' (vertical, grid-friendly) | 'compact' (row) | 'horizontal' / 'recommended' (rail) */
export const EventCard = ({ event, variant = 'standard', onClick }) => {
  const { t, isDark } = useTheme();
  const { displayStatus, isPast } = useEventStatus(event);

  const dateObj = new Date(event.date);
  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
  const dayStr = dateObj.getDate();

  if (variant === 'compact') {
    return (
      <div onClick={() => onClick(event)} className={`p-4 rounded-2xl ${t.card} border ${t.border} shadow-sm active:scale-[0.98] hover:-translate-y-0.5 transition-transform cursor-pointer flex items-center space-x-4`}>
        <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 relative ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <SmartImage src={event.image} alt={event.title} fallbackIcon={CalendarDays} />
          {isPast && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]"><span className="text-[8px] font-extrabold text-white uppercase tracking-wider">Past</span></div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[10px] font-extrabold text-[#1D9BF0] uppercase tracking-wider`}>{monthStr} {dayStr} • {event.time}</span>
            <EventStatusBadge status={displayStatus} />
          </div>
          <h4 className={`text-sm font-extrabold ${t.text} truncate mb-0.5`}>{event.title}</h4>
          <p className={`text-[11px] font-bold ${t.textMuted} truncate flex items-center`}><MapPin className="w-3 h-3 mr-1 shrink-0" strokeWidth={2.5}/> {event.venue}</p>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal' || variant === 'recommended') {
    return (
      <div onClick={() => onClick(event)} className={`w-[260px] shrink-0 lg:w-auto lg:shrink rounded-2xl ${t.card} border ${t.border} shadow-sm active:scale-[0.98] hover:-translate-y-0.5 transition-transform cursor-pointer overflow-hidden flex flex-col`}>
        {variant === 'recommended' && event.recommendationReason && (
          <div className={`px-4 py-2 ${isDark ? 'bg-white/5 border-b border-white/5' : 'bg-black/5 border-b border-black/5'}`}>
            <span className={`text-[10px] font-extrabold ${t.text} uppercase tracking-wider flex items-center`}>
              <Sparkles className="w-3 h-3 mr-1.5 text-amber-500" strokeWidth={2.5} /> {event.recommendationReason}
            </span>
          </div>
        )}
        <div className="w-full aspect-[65/28] relative shrink-0 overflow-hidden">
          <SmartImage src={event.image} alt={event.title} fallbackIcon={CalendarDays} />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex flex-col items-center border border-white/10">
            <span className="text-white text-[10px] font-extrabold uppercase leading-tight">{monthStr}</span>
            <span className="text-white text-sm font-black leading-none">{dayStr}</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h4 className={`text-base font-extrabold ${t.text} line-clamp-2 leading-tight mb-1`}>{event.title}</h4>
          <div className="flex items-center space-x-1.5 mb-3">
            <span className={`text-[11px] font-bold ${t.textMuted} truncate`}>{event.organizer.name}</span>
            {event.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
          </div>
          <div className="mt-auto flex justify-between items-center">
            <EventStatusBadge status={displayStatus} />
            <span className={`text-[10px] font-extrabold ${t.textMuted}`}>{event.goingCount} going</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onClick(event)} className={`rounded-2xl overflow-hidden ${t.card} border ${t.border} shadow-sm active:scale-[0.98] hover:-translate-y-0.5 transition-transform cursor-pointer flex flex-col`}>
      <div className="w-full aspect-[65/24] relative shrink-0 overflow-hidden">
        <SmartImage src={event.image} alt={event.title} fallbackIcon={CalendarDays} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">{event.category}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            <span className="text-[11px] font-extrabold tracking-wide">{monthStr} {dayStr}, {event.time}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`text-lg font-extrabold ${t.text} leading-tight line-clamp-2 pr-2 min-h-[2.6em]`}>{event.title}</h3>
        </div>
        <div className="flex items-center space-x-1.5 mb-3">
          <span className={`text-xs font-bold ${t.textMuted} truncate`}>{event.organizer.name}</span>
          {event.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`flex items-center text-[11px] font-bold ${t.textMuted}`}><MapPin className="w-3.5 h-3.5 mr-1" strokeWidth={2.5}/> <span className="truncate max-w-[120px]">{event.venue}</span></div>
          <div className={`flex items-center text-[11px] font-bold ${t.textMuted}`}><UsersRound className="w-3.5 h-3.5 mr-1" strokeWidth={2.5}/> {event.goingCount} going</div>
        </div>
        <div className={`mt-auto pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/5'} flex justify-between items-center`}>
          <EventStatusBadge status={displayStatus} />
          <span className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center hover:bg-[#1D9BF0] hover:text-white transition-colors`}>
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
};

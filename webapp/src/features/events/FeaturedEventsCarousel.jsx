import { useEffect, useState } from 'react';
import { BadgeCheck, CalendarDays } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { Dots, SmartImage } from '../../components/ui';

/* Featured events hero carousel — drag/swipe + autoplay, from the mobile app. */
/* `ratio` keeps the mobile 390x240 proportion at any column width. */
export const FeaturedEventsCarousel = ({ events, onEventClick, ratio = 'aspect-[13/8]' }) => {
  const { isDark } = useTheme();
  const { registeredEventIds } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (isPaused || dragStartX !== null || events.length === 0) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % events.length), 5000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX, events.length]);

  if (events.length === 0) return null;

  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsPaused(false);
    if (dragOffset < -50) setCurrentIndex((prev) => (prev + 1) % events.length);
    else if (dragOffset > 50) setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setDragStartX(null); setDragOffset(0);
  };

  return (
    <div className="w-full relative z-10 mb-6">
      <div
        className={`relative w-full ${ratio} rounded-[24px] overflow-hidden border ${isDark ? 'border-white/10' : 'border-black/5'} shadow-lg touch-pan-y select-none`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
        onMouseDown={(e) => { setIsPaused(true); setDragStartX(e.clientX); }}
        onMouseMove={(e) => { if (dragStartX !== null) setDragOffset(e.clientX - dragStartX); }}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => { setIsPaused(true); setDragStartX(e.touches[0].clientX); }}
        onTouchMove={(e) => { if (dragStartX !== null) setDragOffset(e.touches[0].clientX - dragStartX); }}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}>
          {events.map((ev, idx) => {
            const isRegistered = registeredEventIds.has(ev.id);
            return (
              <div key={idx} className="w-full h-full shrink-0 relative cursor-pointer" onClick={() => { if (Math.abs(dragOffset) < 10) onEventClick(ev); }}>
                <SmartImage src={ev.image} alt={ev.title} fallbackIcon={CalendarDays} draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">{ev.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 flex flex-col">
                  <h3 className="text-white text-xl lg:text-2xl font-extrabold leading-tight mb-1.5 line-clamp-2 drop-shadow-md max-w-2xl">{ev.title}</h3>
                  <div className="flex items-center space-x-1.5 mb-3 text-white/90">
                    <span className="text-xs font-bold truncate max-w-[280px]">{ev.organizer.name}</span>
                    {ev.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center text-white/80 text-[11px] font-bold">
                      <CalendarDays className="w-3 h-3 mr-1.5" strokeWidth={2.5} /> {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {ev.time}
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-[#1D9BF0] text-white text-xs font-extrabold active:scale-95 transition-transform shadow-md" onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}>
                      {isRegistered || ev.registrationStatus === 'Closed' ? 'Details' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dots count={events.length} index={currentIndex} onSelect={setCurrentIndex} className="mt-3" />
    </div>
  );
};

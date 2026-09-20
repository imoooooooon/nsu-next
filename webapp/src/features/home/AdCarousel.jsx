import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Dots } from '../../components/ui';

/* Sponsored / campus highlight carousel — 1:1 port of the mobile AdCarousel. */

export const useDemoAds = () => useMemo(() => [
  {
    id: 1,
    link: '#bootcamp',
    content: (
      <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center px-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10 flex-1 pr-4">
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-black/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Workshop</span>
          <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Tech Bootcamp 2024</h3>
          <p className="text-white/90 text-[11px] font-semibold">Master UI/UX & React. Limited seats!</p>
        </div>
        <div className="z-10 w-11 h-11 bg-black/10 border border-black/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">🚀</div>
      </div>
    )
  },
  {
    id: 2,
    link: '#internship',
    content: (
      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center px-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10 flex-1 pr-4">
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-black/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Hiring Now</span>
          <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Startup Internship</h3>
          <p className="text-white/90 text-[11px] font-semibold">Kickstart your career at top startups.</p>
        </div>
        <div className="z-10 w-11 h-11 bg-black/10 border border-black/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">💼</div>
      </div>
    )
  },
  {
    id: 3,
    link: '#careerfair',
    content: (
      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center px-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="z-10 flex-1 pr-4">
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-white/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Event</span>
          <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Campus Career Fair</h3>
          <p className="text-white/90 text-[11px] font-semibold">Meet 50+ employers on campus.</p>
        </div>
        <div className="z-10 w-11 h-11 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">🎓</div>
      </div>
    )
  }
], []);

export const AdCarousel = ({ ads }) => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (isPaused || dragStartX !== null || !ads || ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX, ads]);

  if (!ads || ads.length === 0) return null;

  const handleDragStart = (clientX) => { setIsPaused(true); setDragStartX(clientX); };
  const handleDragMove = (clientX) => { if (dragStartX !== null) setDragOffset(clientX - dragStartX); };
  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsPaused(false);
    const threshold = 50;
    if (dragOffset < -threshold) setCurrentIndex((prev) => (prev + 1) % ads.length);
    else if (dragOffset > threshold) setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setDragStartX(null);
    setDragOffset(0);
  };

  return (
    <div className="w-full mt-2 mb-2 animate-fade-in relative z-10">
      <div
        className={`relative w-full rounded-xl overflow-hidden border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/80'} backdrop-blur-sm touch-pan-y select-none`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out h-[130px]"
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
        >
          {ads.map((ad, idx) => (
            <div key={idx} className="w-full h-full shrink-0 cursor-pointer flex items-center justify-center bg-cover bg-center">
              {ad.content}
            </div>
          ))}
        </div>
      </div>
      <Dots count={ads.length} index={currentIndex} onSelect={setCurrentIndex} className="mt-3" />
    </div>
  );
};

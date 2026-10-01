import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Dots } from '../../components/ui';

/* ---------------------------------------------------------------------------
   Sponsored / campus highlight carousel — port of the mobile AdCarousel.

   Same RATIO as mobile, not the same height. On the phone the slot is the
   390px content column × 130px — 3:1. The web used to keep the 130px and
   stretch the width, which turned the card into a ~5.5:1 ribbon with a tiny
   headline lost in a sea of gradient. Now:

   · the slot is `aspect-[3/1]` at every width (design system §3a), capped
     at `max-w-3xl` so a full-width column below xl never grows it past
     ~256px tall — the column is constrained, never the ratio;
   · everything inside a slide is sized in container-query units (cqw) of
     the 390px mobile design, so the slide is the mobile slide, scaled —
     at 390px wide it is pixel-identical to the phone.
--------------------------------------------------------------------------- */

/* 390px is the mobile design width: N px on the phone = N/390 × 100 cqw. */
const AdSlide = ({ gradient, glow = 'bg-black/10', chip = 'bg-black/20', puck = 'bg-black/10 border-black/20', tag, title, subtitle, emoji }) => (
  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center px-[6.15cqw] relative overflow-hidden`}>
    <div className={`absolute -right-[6.15cqw] -top-[6.15cqw] w-[32.8cqw] h-[32.8cqw] ${glow} rounded-full blur-2xl pointer-events-none`}></div>
    <div className="z-10 flex-1 pr-[4.1cqw] min-w-0">
      <span className={`px-[2.05cqw] py-[0.51cqw] rounded-[1cqw] text-[2.31cqw] font-black ${chip} text-white uppercase tracking-wider mb-[2.05cqw] inline-block backdrop-blur-md`}>{tag}</span>
      <h3 className="text-white font-extrabold text-[4.62cqw] leading-tight mb-[1.03cqw]">{title}</h3>
      <p className="text-white/90 text-[2.82cqw] font-semibold">{subtitle}</p>
    </div>
    <div className={`z-10 w-[11.28cqw] h-[11.28cqw] ${puck} border rounded-full flex items-center justify-center text-[4.62cqw] shadow-lg backdrop-blur-md shrink-0`}>{emoji}</div>
  </div>
);

export const useDemoAds = () => useMemo(() => [
  {
    id: 1,
    link: '#bootcamp',
    content: <AdSlide gradient="from-yellow-500 to-amber-600" tag="Workshop" title="Tech Bootcamp 2024" subtitle="Master UI/UX & React. Limited seats!" emoji="🚀" />,
  },
  {
    id: 2,
    link: '#internship',
    content: <AdSlide gradient="from-emerald-500 to-teal-700" tag="Hiring Now" title="Startup Internship" subtitle="Kickstart your career at top startups." emoji="💼" />,
  },
  {
    id: 3,
    link: '#careerfair',
    content: (
      <AdSlide
        gradient="from-orange-500 to-red-600"
        glow="bg-white/10"
        chip="bg-white/20"
        puck="bg-white/10 border-white/20"
        tag="Event"
        title="Campus Career Fair"
        subtitle="Meet 50+ employers on campus."
        emoji="🎓"
      />
    ),
  },
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
    <div className="w-full max-w-3xl mx-auto mt-2 mb-2 animate-fade-in relative z-10">
      <div
        className={`@container relative w-full aspect-[3/1] rounded-xl overflow-hidden border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/80'} backdrop-blur-sm touch-pan-y select-none`}
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
          className="flex transition-transform duration-500 ease-out h-full"
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

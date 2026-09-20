import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, Briefcase, Clock, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { Dots } from '../../components/ui';

/* Auto-advancing job slider from Home — 1:1 port with drag support. */
export const JobSlider = ({ jobs }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const extendedJobs = [...jobs, jobs[0]];

  useEffect(() => {
    if (isPaused || dragStartX !== null) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX]);

  useEffect(() => {
    if (currentIndex === jobs.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, jobs.length]);

  const handleDragStart = (clientX) => {
    setIsPaused(true);
    setDragStartX(clientX);
    setIsTransitioning(false);
    setIsDragging(false);
  };

  const handleDragMove = (clientX) => {
    if (dragStartX === null) return;
    const offset = clientX - dragStartX;
    if (Math.abs(offset) > 10) setIsDragging(true);
    if (currentIndex === 0 && offset > 0) setDragOffset(offset * 0.3);
    else setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsTransitioning(true);
    setIsPaused(false);
    const threshold = 50;
    if (dragOffset < -threshold) setCurrentIndex((prev) => prev + 1);
    else if (dragOffset > threshold && currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    setDragStartX(null);
    setDragOffset(0);
    setTimeout(() => setIsDragging(false), 50);
  };

  const activeDotIndex = currentIndex === jobs.length ? 0 : currentIndex;

  return (
    <div
      className="relative w-full mt-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
    >
      <div
        className="overflow-hidden -mx-4 px-4 pt-2 pb-4 -mb-2 relative z-0 touch-pan-y select-none"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
        >
          {extendedJobs.map((job, idx) => (
            <div key={`${job.id}-${idx}`} className="w-full shrink-0 px-1">
              <div
                className={`h-full rounded-2xl p-5 relative overflow-hidden group cursor-pointer border ${t.border} hover:-translate-y-0.5 transition-transform`}
                onClick={(e) => {
                  if (isDragging) { e.preventDefault(); e.stopPropagation(); return; }
                  navigate(`/jobs/${job.id}`);
                }}
              >
                <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-emerald-500/10' : 'bg-gradient-to-b from-white to-emerald-500/10 backdrop-blur-3xl'}`}></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}>{job.type}</span>
                      <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black/70 border border-black/10'}`}>{job.location}</span>
                    </div>
                    <BookmarkIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2} />
                  </div>

                  <h3 className={`text-base font-extrabold tracking-tight ${t.text} mb-1.5 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate`}>{job.title}</h3>

                  <div className="flex items-center space-x-1.5 mb-4">
                    <Briefcase className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
                    <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{job.company}</p>
                  </div>

                  <div className="mt-auto">
                    <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                      <div>
                        {job.urgent ? (
                          <span className="flex items-center text-red-500 text-[9px] font-extrabold bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                            <Clock className="w-2.5 h-2.5 mr-1" strokeWidth={3} /> {job.deadline}
                          </span>
                        ) : (
                          <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posted {job.posted}</span>
                        )}
                      </div>
                      <span className={`flex items-center text-[10px] font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Details <ArrowUpRight className="w-3 h-3 ml-0.5" strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dots
        count={jobs.length}
        index={activeDotIndex}
        onSelect={(idx) => {
          setIsTransitioning(true);
          setCurrentIndex(idx);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 4000);
        }}
        activeColor="bg-emerald-500"
        className="relative z-10 mt-3 mb-2"
      />
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, BadgeCheck } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* The Moments avatar rail — drag-scrollable, with note bubbles. 1:1 port. */
export const MomentsRow = ({ moments }) => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full relative z-20">
      <div
        ref={scrollRef}
        className={`flex space-x-4 overflow-x-auto hide-scrollbar rail-fade px-1 pt-6 pb-2 items-start h-[125px] touch-pan-x select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex flex-col items-center shrink-0 w-[68px] cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/moments/create')}>
          <div className="relative mb-1.5 pointer-events-none">
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-white text-black border border-gray-200'} shadow-sm z-20 w-max max-w-[80px] flex items-center justify-center`}>
              <span className="text-[10px] font-semibold truncate w-full text-center">Share thoug...</span>
              <div className={`absolute -bottom-1 left-4 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-white border-b border-r border-gray-200'}`}></div>
            </div>
            <div className="w-[68px] h-[68px] rounded-full relative">
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-100'} border-[2px] ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center overflow-hidden`}>
                <User className={`w-8 h-8 ${t.textMuted}`} strokeWidth={1.5} />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1D9BF0] rounded-full border-[2.5px] ${isDark ? 'border-black' : 'border-white'} flex items-center justify-center z-10`}>
                <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <span className={`text-[11px] font-semibold ${t.text} truncate w-full text-center pointer-events-none`}>Your Moment</span>
        </div>

        {moments.map((momentGroup) => {
          const firstNote = momentGroup.items.find(i => i.type === 'note');
          const unseenRing = 'border-[#1D9BF0]';
          const seenRing = isDark ? 'border-gray-600' : 'border-gray-300';

          return (
            <div key={momentGroup.id} className="flex flex-col items-center shrink-0 w-[68px] cursor-pointer group active:scale-95 transition-transform">
              <div className="relative mb-1.5">
                {firstNote && (
                  <div
                    onClick={(e) => { if (!isDragging) { e.stopPropagation(); navigate(`/moments/note/${momentGroup.id}`); } }}
                    className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-white text-black border border-gray-200'} shadow-sm z-20 w-max max-w-[80px] flex items-center justify-center active:scale-95 transition-transform`}
                  >
                    <span className="text-[10px] font-semibold truncate w-full text-center">{firstNote.content}</span>
                    <div className={`absolute -bottom-1 left-4 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-white border-b border-r border-gray-200'}`}></div>
                  </div>
                )}
                <div
                  onClick={() => { if (!isDragging) navigate(`/moments/${momentGroup.id}`); }}
                  className={`w-[68px] h-[68px] rounded-full border-[2.5px] p-[2.5px] pointer-events-auto ${momentGroup.seen ? seenRing : unseenRing}`}
                >
                  <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                    <User className={`w-8 h-8 ${t.textMuted}`} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full space-x-0.5 pointer-events-none">
                <span className={`text-[11px] font-semibold ${momentGroup.seen ? t.textMuted : t.text} truncate text-center`}>{momentGroup.user.name.split(' ')[0]}</span>
                {momentGroup.user.verified && <BadgeCheck className={`w-3 h-3 ${momentGroup.seen ? 'text-gray-400' : 'text-[#1D9BF0]'} shrink-0`} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

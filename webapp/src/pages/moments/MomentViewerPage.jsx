import { getInstantState, useMomentRecaps } from '../../../../src/shared/instantStore';
import { INSTANT_TTL } from '../../../../src/shared/instantModel';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, BadgeCheck, MoreVertical, X, Heart, Send } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { globalMomentsData, findMomentIndexById } from '../../data/moments';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   Moment viewer — the full-screen story player as a route (/moments/:momentId).
   Desktop: centered 9:16 stage on a dimmed backdrop (Instagram-web pattern).
   Mobile: full-bleed, identical to the app.
--------------------------------------------------------------------------- */

/* Users with at least one playable (non-note) item. Note-only users have their
   own route (/moments/note/:id), so the viewer never needs to sit on one. */
const PLAYABLE_MOMENTS = globalMomentsData.filter(m => m.items.some(i => i.type !== 'note'));

/* Resolves a route id to a playable index: the user itself when they have
   media, otherwise the next user who does. */
const resolveStartIndex = (id) => {
  const recaps = getInstantState().recaps.filter(item => Date.now() < item.createdAt + INSTANT_TTL);
  const playable = [...recaps, ...PLAYABLE_MOMENTS];
  const direct = playable.findIndex(m => m.id === id);
  if (direct >= 0) return direct;
  const requested = findMomentIndexById(id);
  if (requested < 0) return 0;
  const nextPlayable = playable.findIndex(
    m => globalMomentsData.indexOf(m) > requested
  );
  return nextPlayable >= 0 ? nextPlayable : 0;
};

export default function MomentViewerPage() {
  const { momentId } = useParams();
  const navigate = useNavigate();
  const close = useCloseTo('/home');
  const { t, isDark } = useTheme();

  const recaps = useMomentRecaps();
  const moments = [...recaps, ...PLAYABLE_MOMENTS];

  const [currentUserIndex, setCurrentUserIndex] = React.useState(() => resolveStartIndex(momentId));
  const [currentStoryIndex, setCurrentStoryIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [showHeartPop, setShowHeartPop] = React.useState(false);
  const [showViewers, setShowViewers] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);

  const timerRef = React.useRef(null);
  // Seeded by the playback effect below; never read before that runs.
  const startTimeRef = React.useRef(0);
  const pausedProgressRef = React.useRef(0);
  const updateInterval = 16;

  const currentUser = moments[currentUserIndex];
  const mediaItems = React.useMemo(() => currentUser?.items.filter(i => i.type !== 'note') || [], [currentUser]);
  const currentItem = mediaItems[currentStoryIndex];

  /* Keep the URL in sync with the story being watched. */
  React.useEffect(() => {
    const id = moments[currentUserIndex]?.id;
    if (id && id !== momentId) navigate(`/moments/${id}`, { replace: true });
  }, [currentUserIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    setHasLiked(false); setProgress(0); pausedProgressRef.current = 0;
    if (currentStoryIndex < mediaItems.length - 1) setCurrentStoryIndex(prev => prev + 1);
    else if (currentUserIndex < moments.length - 1) { setCurrentUserIndex(prev => prev + 1); setCurrentStoryIndex(0); }
    else close();
  };

  const handlePrev = () => {
    setHasLiked(false); setProgress(0); pausedProgressRef.current = 0;
    if (currentStoryIndex > 0) setCurrentStoryIndex(prev => prev - 1);
    else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(moments[currentUserIndex - 1].items.filter(i => i.type !== 'note').length - 1 || 0);
    } else setProgress(0);
  };

  React.useEffect(() => {
    if (!currentItem) return;

    if (!isPaused && !showViewers && !showOptionsMenu) {
      startTimeRef.current = Date.now() - (pausedProgressRef.current / 100 * currentItem.duration);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / currentItem.duration) * 100;
        if (newProgress >= 100) handleNext();
        else setProgress(newProgress);
      }, updateInterval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pausedProgressRef.current = progress;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentUserIndex, currentStoryIndex, isPaused, showViewers, showOptionsMenu, currentItem, mediaItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // re-binds each render so handlers see fresh indices

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!hasLiked) {
      setHasLiked(true); setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    } else setHasLiked(false);
  };

  if (!currentItem) return null;

  const displayedLikes = hasLiked ? currentItem.reactions + 1 : currentItem.reactions;
  const displayedViews = currentItem.reactions * 14 + 52 + (hasLiked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-md overflow-hidden flex flex-col justify-center py-0 sm:py-4 animate-scale-up origin-center">
      {/* Desktop close affordance outside the stage */}
      <button
        onClick={close}
        aria-label="Close viewer"
        className="hidden sm:flex absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-colors z-30"
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <div className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:w-auto sm:aspect-[9/16] mx-auto bg-[#121212] overflow-hidden relative shadow-2xl transition-transform duration-300 sm:rounded-[16px]">
        {currentItem.type === 'image' && (
          <img src={currentItem.url} alt="Moment" className="w-full h-full object-cover" draggable={false} />
        )}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full pt-4 px-4 pb-4 flex flex-col z-20 shrink-0">
          <div className="flex space-x-1.5 w-full mb-3">
            {mediaItems.map((_, idx) => (
              <div key={idx} className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden transition-colors">
                <div
                  className="h-full bg-white rounded-full transition-all ease-linear"
                  style={{
                    width: idx === currentStoryIndex ? `${progress}%` : idx < currentStoryIndex ? '100%' : '0%',
                    transitionDuration: idx === currentStoryIndex && !isPaused && !showViewers ? `${updateInterval}ms` : '0ms'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden transition-colors shadow-sm">
                <User className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-[14px] font-semibold text-white drop-shadow-md">{currentUser.user.name}</span>
                  {currentUser.user.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0]" strokeWidth={3} />}
                  <span className="text-[12px] font-light ml-1 text-white/90 drop-shadow-md">• 4h</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/80 drop-shadow-md mt-0.5">{currentUser.user.role}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(true); setIsPaused(true); }} className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all shadow-sm">
                <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button onClick={close} className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all shadow-sm sm:hidden">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-56 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full px-4 pt-6 pb-4 z-20 flex flex-col justify-end space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full cursor-pointer active:scale-95 transition-transform" onClick={() => { setShowViewers(true); setIsPaused(true); }}>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-500 border border-[#121212] flex items-center justify-center overflow-hidden shadow-sm">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-white drop-shadow-md pr-1">{displayedViews}</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <button onClick={handleLike} className="p-2 flex items-center justify-center active:scale-[0.7] transition-transform duration-300 ease-spring">
                <Heart className={`w-8 h-8 transition-colors duration-300 ${hasLiked ? 'text-[#1D9BF0] fill-[#1D9BF0]' : 'text-white'}`} strokeWidth={hasLiked ? 0 : 2.5} />
              </button>
              <span className="text-[12px] font-medium text-white drop-shadow-md">{displayedLikes}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full pl-5 pr-2 py-2 border border-white/20 shadow-lg">
            <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)} placeholder="Send message..." className="flex-1 bg-transparent text-white placeholder:text-white/80 font-light text-[14px] focus:outline-none" />
            <button onClick={() => setReplyText('')} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${replyText.trim() ? 'bg-white text-black scale-105 shadow-md' : 'bg-transparent text-white/60'}`}>
              <Send className="w-4 h-4 transform translate-x-[1px] -translate-y-[1px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="absolute top-24 bottom-32 left-0 w-[40%] z-10 cursor-pointer" onClick={handlePrev} onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} onTouchStart={handleInteractionStart} onTouchEnd={handleInteractionEnd} />
        <div className="absolute top-24 bottom-32 right-0 w-[60%] z-10 cursor-pointer" onClick={handleNext} onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} onTouchStart={handleInteractionStart} onTouchEnd={handleInteractionEnd} />

        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="w-24 h-24 text-[#1D9BF0] fill-[#1D9BF0] animate-heart-fly" />
          </div>
        )}

        {showViewers && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowViewers(false); setIsPaused(false); }} />
            <div className={`relative ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl max-h-[65%] w-full flex flex-col animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10`} onClick={(e) => e.stopPropagation()}>
              <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-4 mb-2 shrink-0`}></div>
              <div className={`px-5 py-3 border-b ${isDark ? 'border-white/10' : 'border-black/5'} flex justify-between items-center`}>
                <h3 className={`font-semibold text-lg ${t.text}`}>Viewers</h3>
                <span className={`text-sm font-medium ${t.textMuted}`}>{displayedViews} views</span>
              </div>
              <div className="overflow-y-auto px-3 py-2 space-y-1 mb-4 flex-1 hide-scrollbar">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-11 h-11 rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-200'} border ${isDark ? 'border-white/10' : 'border-black/5'} flex items-center justify-center overflow-hidden`}>
                        <User className={`w-6 h-6 ${t.textMuted}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-medium text-[13px] ${t.text}`}>User_{100 + i * 97}</span>
                        <span className={`text-[11px] font-light ${t.textMuted}`}>{(i * 7 + 3) % 59}m ago</span>
                      </div>
                    </div>
                    {i % 3 !== 0 && <Heart className="w-5 h-5 text-[#1D9BF0] fill-[#1D9BF0] drop-shadow-sm" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showOptionsMenu && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(false); setIsPaused(false); }} />
            <div className={`relative ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl w-full flex flex-col animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10 pb-8`} onClick={(e) => e.stopPropagation()}>
              <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-4 mb-2 shrink-0`}></div>
              <div className="px-6 py-2 flex flex-col">
                <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Share Moment</button>
                <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Copy Link</button>
                <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Mute {currentUser.user.name}</button>
                <button className="w-full py-4 text-left font-medium text-[15px] text-red-500 active:scale-95 transition-transform">Report</button>
                <button onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(false); setIsPaused(false); }} className={`w-full py-3.5 text-center font-semibold text-[15px] ${isDark ? 'bg-[#2A2A2A] text-white' : 'bg-gray-100 text-black'} rounded-2xl mt-4 active:scale-95 transition-transform`}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

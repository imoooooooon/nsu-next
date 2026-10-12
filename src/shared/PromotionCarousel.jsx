import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { publicRows, publicState } from './adminBridge.js';
import { useAdminBridge } from './useAdminBridge.js';
import { loopPosition } from './promotionModel.js';
import './promotion-carousel.css';

const defaults = [
  {id:'learn',title:'Build your next big idea',copy:'Discover workshops and campus events.',destination:'/webapp/events',tag:'Campus spotlight'},
  {id:'connect',title:'Your people. Your possibilities.',copy:'Meet your alumni and faculty community.',destination:'/webapp/network',tag:'Community spotlight'},
  {id:'grow',title:'Make your next move',copy:'Explore opportunities within your network.',destination:'/webapp/jobs',tag:'Career spotlight'},
];
export function PromotionCarousel({ authRole, onOpen }) {
  useAdminBridge();
  const state = publicState();
  const ads = state?.campaigns ? publicRows('campaigns', [], state).filter(c => c.audience === 'all' || c.audience === authRole).sort((a, b) => a.priority - b.priority) : defaults;
  if (!ads.length) return null;
  return <PromotionTrack key={ads.map(ad => ad.id).join('|')} ads={ads} onOpen={onOpen} />;
}

function PromotionTrack({ ads, onOpen }) {
  const [position, setPosition] = useState(1);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [columns, setColumns] = useState(1);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const touch = useRef(null);
  const rail = useRef(null);
  const swiped = useRef(false);
  const active = loopPosition(position, ads.length);
  const multiple = ads.length > 1;
  const slides = multiple ? [ads.at(-1), ...ads, ...ads.slice(0, 2)] : ads;

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setColumns(multiple && entry.contentRect.width >= 1000 ? 2 : 1));
    observer.observe(rail.current);
    return () => observer.disconnect();
  }, [multiple]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!multiple || paused || hovered || focused || reduced || moving) return;
    const timer = setTimeout(() => { setMoving(true); setPosition(p => p + 1); }, 6000);
    return () => clearTimeout(timer);
  }, [multiple, paused, hovered, focused, reduced, moving, position]);
  // Snap from the cloned end card to its identical original after the slide finishes.
  useEffect(() => {
    if (!moving) return;
    const timer = setTimeout(() => {
      setMoving(false);
      setPosition(p => loopPosition(p, ads.length) + 1);
    }, reduced ? 0 : 560);
    return () => clearTimeout(timer);
  }, [moving, ads.length, reduced]);
  const go = target => {
    if (moving || !multiple) return;
    setMoving(true);
    setPosition(target);
  };

  return <section ref={rail} className={`promotion ${columns === 2 ? 'promotion-two-up' : ''}`} aria-label="Campus promotions" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
    onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(position + (e.key === 'ArrowLeft' ? -1 : 1)); } }}>
    <div className="promotion-viewport"
      onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; swiped.current = false; }}
      onTouchEnd={e => { if (!touch.current) return; const dx = e.changedTouches[0].clientX - touch.current.x; const dy = e.changedTouches[0].clientY - touch.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; go(position + (dx < 0 ? 1 : -1)); } touch.current = null; }}
      onTouchCancel={() => { touch.current = null; }}
      onClickCapture={e => { if (swiped.current) { e.preventDefault(); e.stopPropagation(); swiped.current = false; } }}>
      <div className={`promotion-track ${moving && !reduced ? 'is-moving' : ''}`} style={{ transform: `translateX(-${multiple ? position * 100 / columns : 0}%)` }}>
        {slides.map((ad, i) => {
          const originalIndex = multiple ? loopPosition(i, ads.length) : 0;
          const visible = multiple ? i >= position && i < position + columns : true;
          return <div key={`${ad.id}-${i}`} className="promotion-item" aria-hidden={!visible} inert={!visible} role="group" aria-roledescription="slide" aria-label={`${originalIndex + 1} of ${ads.length}`}>
            <a className={`promotion-slide promotion-color-${originalIndex % 3}`} href={ad.destination} onClick={e => { if (onOpen?.(ad.destination)) e.preventDefault(); }} aria-label={`${ad.title} — ${ad.copy}`}>
              {ad.image && <img className="promotion-image" src={ad.image} alt="" draggable="false" />}
              <div className="promotion-copy"><span className="promotion-label">{ad.tag || 'Sponsored · Campus promotion'}</span><strong>{ad.title}</strong><p>{ad.copy}</p></div><ArrowUpRight className="promotion-arrow" aria-hidden="true" />
            </a>
          </div>;
        })}
      </div>
    </div>
    {multiple && <div className="promotion-controls">
      <button onClick={() => go(position - 1)} aria-label="Previous promotion"><ChevronLeft size={16} /></button>
      <div role="group" aria-label="Choose promotion">{ads.map((ad, i) => <button key={ad.id} aria-label={`Show promotion ${i + 1}: ${ad.title}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(i + 1)}><span /></button>)}</div>
      <button onClick={() => go(position + 1)} aria-label="Next promotion"><ChevronRight size={16} /></button>
      {!reduced && <button onClick={() => setPaused(v => !v)} aria-label={paused ? 'Play promotions' : 'Pause promotions'}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
    </div>}
  </section>;
}

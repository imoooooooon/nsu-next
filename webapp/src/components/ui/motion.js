import { useLayoutEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
   Motion — the shared "active pill" that glides between options.

   Every selection control (SegmentedControl, ViewModeToggle, the Jobs
   Hiring | Seeking pill) used to repaint its active option in place: the old
   one blinked off, the new one blinked on. That jump is what read as cheap.
   Now one pill per control physically travels to the chosen option on a
   spring (see --ease-spring in index.css), the way a Framer Motion
   `layoutId` indicator does — without shipping a motion library.

   Usage:
     const { trackRef, pillRef } = useSlidingPill(value);
     <div ref={trackRef} className="relative …">
       <span ref={pillRef} className="sliding-pill …" aria-hidden="true" />
       <button data-pill-key="a" className="relative z-10 …">A</button>
     </div>

   Two options keep the glide alive when the control REMOUNTS on selection:
   · `enterFrom` — the key the pill should start at on mount (Hiring → /jobs
     and Seeking → /jobs/seeking are two pages with a control each, so the
     page you land on glides in from the mode you just left);
   · `memoryKey` — the hook remembers where the pill last sat under that key
     and glides from there on the next mount.
--------------------------------------------------------------------------- */

const lastActiveByKey = new Map();

const findItem = (track, key) =>
  key == null ? null : track.querySelector(`[data-pill-key="${CSS.escape(String(key))}"]`);

const placePill = (pill, item, animate) => {
  if (!item) {
    pill.style.opacity = '0';
    return;
  }
  pill.style.transitionProperty = animate ? '' : 'none';
  pill.style.opacity = '1';
  pill.style.width = `${item.offsetWidth}px`;
  pill.style.height = `${item.offsetHeight}px`;
  pill.style.transform = `translate3d(${item.offsetLeft}px, ${item.offsetTop}px, 0)`;
  if (!animate) {
    void pill.offsetWidth; // commit the jump so the next change animates from here
    pill.style.transitionProperty = '';
  }
};

export const useSlidingPill = (activeKey, { memoryKey, enterFrom } = {}) => {
  const trackRef = useRef(null);
  const pillRef = useRef(null);
  const hasPlaced = useRef(false);

  /* Position is written straight to the DOM before paint — no state, so a
     selection never costs an extra render and there is no one-frame flash. */
  useLayoutEffect(() => {
    const track = trackRef.current;
    const pill = pillRef.current;
    if (!track || !pill) return;

    const target = findItem(track, activeKey);
    if (!hasPlaced.current) {
      hasPlaced.current = true;
      const origin = enterFrom !== undefined ? enterFrom : (memoryKey ? lastActiveByKey.get(memoryKey) : undefined);
      const from = origin !== undefined && origin !== activeKey ? findItem(track, origin) : null;
      if (from && target) {
        placePill(pill, from, false);
        placePill(pill, target, true);
      } else {
        placePill(pill, target, false);
      }
    } else {
      placePill(pill, target, true);
    }
    if (memoryKey) lastActiveByKey.set(memoryKey, activeKey);
    // enterFrom only matters for the first placement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, memoryKey]);

  /* Re-seat without animating when the track itself resizes (viewport,
     sidebar collapse, a badge count changing width). The first observation
     is the size we already placed at, so it's ignored — otherwise it would
     cancel a glide that is still running. */
  useLayoutEffect(() => {
    const track = trackRef.current;
    const pill = pillRef.current;
    if (!track || !pill || typeof ResizeObserver === 'undefined') return undefined;
    let last = `${track.offsetWidth}x${track.offsetHeight}`;
    const ro = new ResizeObserver(() => {
      const size = `${track.offsetWidth}x${track.offsetHeight}`;
      if (size === last) return;
      last = size;
      placePill(pill, track.querySelector('[data-pill-active="true"]'), false);
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  return { trackRef, pillRef };
};

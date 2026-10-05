import { useEffect, useRef, useState } from "react";
import { Camera, Check, Moon, Plus, Send } from "lucide-react";
import { INSTANT_TTL } from "./instantModel";
import {
  openInstant,
  reactToInstant,
  replyToInstant,
  snoozeInstants,
  useInstantClock,
  useInstantState,
} from "./instantStore";
import { frameStyle } from "./momentFrames";
import { MomentCaption } from "./MomentMedia";

function MomentSlide({ item, active, nearby }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (active && loaded) openInstant(item.id);
  }, [active, loaded, item.id]);
  return (
    <div
      className="moment-page"
      role="group"
      aria-label={`Moment from ${item.name}`}
      aria-hidden={!active}
    >
      <div className="moment-photo-shell">
        <div className="instant-photo-card" style={frameStyle(item.frame)}>
          {(nearby || loaded) && (
            <img
              key={retry}
              src={item.photo}
              alt={`Moment from ${item.name}`}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          )}
          {loaded && <MomentCaption {...item} />}
        </div>
        {!loaded && !failed && (
          <span
            className="instant-loading-label"
            role={active ? "status" : undefined}
          >
            Opening moment…
          </span>
        )}
        {failed && (
          <div className="moment-photo-error">
            <p>This photo couldn’t load.</p>
            <button
              type="button"
              tabIndex={active ? 0 : -1}
              onClick={() => {
                setFailed(false);
                setRetry((n) => n + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MomentsFeed({ items, authorName, notify, onCamera }) {
  const now = useInstantClock();
  const snapshot = useInstantState();
  const visible = items.filter((item) => now < item.createdAt + INSTANT_TTL);
  const [index, setIndex] = useState(0);
  const currentIndex = Math.min(index, Math.max(0, visible.length - 1));
  const current = visible[currentIndex];
  const [reply, setReply] = useState("");
  const [more, setMore] = useState(false);
  const [burst, setBurst] = useState(null);
  const rail = useRef(null);
  const drag = useRef(null);
  const timer = useRef(null);
  const snoozed = !authorName && snapshot.snoozedUntil > now;
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!rail.current) return;
    const element = rail.current;
    const observer = new ResizeObserver(() =>
      element.scrollTo({
        left: currentIndex * element.clientWidth,
        behavior: "instant",
      }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [currentIndex]);
  function goTo(next) {
    const element = rail.current;
    if (!element) return;
    const target = Math.max(0, Math.min(visible.length - 1, next));
    element.scrollTo({
      left: target * element.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function settle() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const element = rail.current;
      if (!element || drag.current) return;
      const next = Math.round(element.scrollLeft / element.clientWidth);
      setIndex(next);
      setReply("");
      setMore(false);
      setBurst(null);
    }, 110);
  }
  function react(emoji) {
    if (!current) return;
    reactToInstant(current.id, emoji);
    setBurst((previous) => ({ emoji, key: (previous?.key || 0) + 1 }));
    notify(`${emoji} reaction saved`);
  }
  if (!current || snoozed)
    return (
      <div className="instant-inbox moment-empty-state">
        <div className="instant-inbox-intro">
          <span className="instant-eyebrow">UGRADS MOMENTS</span>
          <h3>
            {snoozed
              ? "A little quiet time."
              : authorName
                ? `No new moments from ${authorName}.`
                : "All caught up."}
          </h3>
          <p>
            {snoozed
              ? "Your feed is snoozed for 24 hours."
              : "Come back for another glimpse of their day."}
          </p>
        </div>
        <div className="instant-empty-art">
          {snoozed ? (
            <Moon size={48} strokeWidth={1} />
          ) : (
            <Check size={48} strokeWidth={1} />
          )}
        </div>
        <button className="instant-primary" onClick={onCamera}>
          <Camera size={18} />
          Capture a moment
        </button>
        {snoozed && (
          <button
            className="instant-text-button"
            onClick={() => snoozeInstants(false)}
          >
            Resume moments
          </button>
        )}
      </div>
    );
  return (
    <div className="moment-feed">
      <div className="moment-carousel-layout">
        <div
          className="moment-carousel"
          ref={rail}
          role="region"
          aria-roledescription="carousel"
          aria-label="Moments photos"
          tabIndex={0}
          onScroll={settle}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(currentIndex + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button === 0)
              drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const distance = drag.current.x - e.clientX;
            if (Math.abs(distance) > 5) {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.scrollSnapType = "none";
              e.currentTarget.scrollLeft = drag.current.left + distance;
            }
          }}
          onPointerUp={(e) => {
            if (!drag.current) return;
            const distance = drag.current.x - e.clientX;
            drag.current = null;
            e.currentTarget.style.scrollSnapType = "";
            goTo(
              currentIndex +
                (Math.abs(distance) > 35 ? Math.sign(distance) : 0),
            );
          }}
          onPointerCancel={(e) => {
            drag.current = null;
            e.currentTarget.style.scrollSnapType = "";
          }}
        >
          {visible.map((item, i) => (
            <MomentSlide
              key={item.id}
              item={item}
              active={i === currentIndex}
              nearby={Math.abs(i - currentIndex) <= 1}
            />
          ))}
        </div>
        <div className="moment-action-dock" aria-label="React to this moment">
          {["😂", "❤️", "🌸", "👏"].map((emoji) => (
            <button
              key={emoji}
              aria-label={`React ${emoji}`}
              aria-pressed={snapshot.reactions[current.id] === emoji}
              onClick={() => react(emoji)}
            >
              {emoji}
            </button>
          ))}
          <button
            aria-label="More reactions"
            aria-expanded={more}
            onClick={() => setMore(!more)}
          >
            <Plus size={21} />
          </button>
        </div>
        {more && (
          <div className="moment-more-reactions">
            {["🔥", "🥹", "😍", "💙", "🙌"].map((emoji) => (
              <button
                key={emoji}
                aria-label={`React ${emoji}`}
                onClick={() => {
                  react(emoji);
                  setMore(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        {burst && (
          <div
            className="instant-reaction-burst"
            key={burst.key}
            aria-hidden="true"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                style={{
                  "--i": i,
                  "--x": `${((i % 3) - 1) * 40}px`,
                  "--rotation": `${i * 10}deg`,
                }}
              >
                {burst.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="instant-byline">
        <b>{current.name}</b>
        <span>
          {Math.max(1, Math.floor((now - current.createdAt) / 60000))}m
        </span>
      </div>
      <nav className="moment-pagination" aria-label="Moment pagination">
        <div className="moment-page-dots">
          {visible.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Go to moment ${i + 1}`}
              aria-current={currentIndex === i ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </nav>
      <span className="moment-page-status" aria-live="polite">
        {currentIndex + 1} of {visible.length}
      </span>
      <form
        className="instant-reply"
        onSubmit={(e) => {
          e.preventDefault();
          if (!reply.trim()) return;
          replyToInstant(current.id, reply);
          setReply("");
          notify("Reply saved");
        }}
      >
        <input
          aria-label={`Reply to ${current.name}`}
          placeholder={`Reply to ${current.name}…`}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          maxLength={500}
        />
        <button type="submit" aria-label="Send reply" disabled={!reply.trim()}>
          <Send size={19} />
        </button>
      </form>
    </div>
  );
}

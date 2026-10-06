import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Moon, Plus, Send } from "lucide-react";
import { momentDeck } from "./instantModel";
import {
  openInstant, reactToInstant, replyToInstant, snoozeInstants,
  useInstantClock, useInstantState,
} from "./instantStore";
import { frameStyle } from "./momentFrames";
import { MomentCaption } from "./MomentMedia";

function MomentSlide({ item, offset, onAdvance, last }) {
  const active = offset === 0;
  const depth = Math.min(Math.abs(offset), 3);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (active && loaded && !failed) openInstant(item.id);
  }, [active, loaded, failed, item.id]);
  return (
    <div
      className={`moment-deck-card ${active ? "is-active" : offset > 0 ? "is-queued" : "is-seen"}`}
      style={{
        "--deck-x": `${active ? 0 : (offset > 0 ? -1 : 1) * (27 + depth * 10)}%`,
        "--deck-scale": active ? 1 : 0.89 - depth * 0.055,
        "--deck-rotate": `${active ? 0 : (offset > 0 ? -1 : 1) * depth * 3}deg`,
        zIndex: active ? 10 : 5 - depth,
        opacity: Math.abs(offset) > 3 ? 0 : active ? 1 : offset > 0 ? 0.8 : 0.38,
      }}
      aria-hidden={!active}
      inert={!active}
    >
      <div className="instant-photo-card" style={frameStyle(item.frame)}>
        {(Math.abs(offset) <= 3 || loaded) && (
          <img key={retry} src={item.photo} alt={`Moment from ${item.name}`}
            draggable={false} onContextMenu={(e) => e.preventDefault()}
            onLoad={() => { setLoaded(true); setFailed(false); }}
            onError={() => { setLoaded(false); setFailed(true); }} />
        )}
        {loaded && <MomentCaption {...item} />}
      </div>
      {!loaded && !failed && <span className="instant-loading-label" role={active ? "status" : undefined}>Opening moment…</span>}
      {active && loaded && !failed && (
        <button className="moment-tap-target" aria-label={last ? "Finish viewing moments" : "Next moment"} onClick={onAdvance} />
      )}
      {failed && (
        <div className="moment-photo-error">
          <p>This photo couldn’t load.</p>
          <button type="button" onClick={() => { setFailed(false); setRetry((n) => n + 1); }}>Try again</button>
          {active && <button type="button" onClick={onAdvance}>Skip photo</button>}
        </div>
      )}
    </div>
  );
}

function MomentActions({ current, notify }) {
  const snapshot = useInstantState();
  const [reply, setReply] = useState("");
  const [more, setMore] = useState(false);
  const [burst, setBurst] = useState(null);
  function react(emoji) {
    reactToInstant(current.id, emoji);
    setBurst((previous) => ({ emoji, key: (previous?.key || 0) + 1 }));
    notify(`${emoji} reaction saved`);
  }
  return (
    <div className="moment-bottom-controls">
      {burst && <div className="instant-reaction-burst" key={burst.key} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => <span key={i} style={{ "--i": i, "--x": `${((i % 3) - 1) * 40}px`, "--rotation": `${i * 10}deg` }}>{burst.emoji}</span>)}
      </div>}
      <div className="moment-action-dock" role="group" aria-label="React to this moment">
        {["😂", "❤️", "🌸", "👏"].map((emoji) => <button key={emoji} aria-label={`React ${emoji}`} aria-pressed={snapshot.reactions[current.id] === emoji} onClick={() => react(emoji)}>{emoji}</button>)}
        <button aria-label="More reactions" aria-expanded={more} onClick={() => setMore(!more)}><Plus size={21} /></button>
      </div>
      {more && <div className="moment-more-reactions" role="group" aria-label="Additional reactions">
        {["🔥", "🥹", "😍", "💙", "🙌"].map((emoji) => <button key={emoji} aria-label={`React ${emoji}`} onClick={() => { react(emoji); setMore(false); }}>{emoji}</button>)}
      </div>}
      <form className="instant-reply" onSubmit={(e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        replyToInstant(current.id, reply);
        setReply("");
        notify("Reply saved");
      }}>
        <input aria-label={`Reply to ${current.name}`} placeholder={`Reply to ${current.name}…`} value={reply} onChange={(e) => setReply(e.target.value)} maxLength={500} />
        <button type="submit" aria-label="Send reply" disabled={!reply.trim()}><Send size={19} /></button>
      </form>
    </div>
  );
}

export function MomentsFeed({ items, authorName, notify, onCamera }) {
  const now = useInstantClock();
  const snapshot = useInstantState();
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [finished, setFinished] = useState(false);
  const deck = useRef(null);
  // Resolve by ID so expiring an earlier card never skips the active photo.
  const { visible, index: currentIndex } = momentDeck(items, activeId, now);
  const current = visible[currentIndex];
  const snoozed = !authorName && snapshot.snoozedUntil > now;
  function advance() {
    deck.current?.focus({ preventScroll: true });
    if (currentIndex < visible.length - 1) setActiveId(visible[currentIndex + 1].id);
    else setFinished(true);
  }
  function previous() {
    if (currentIndex > 0) setActiveId(visible[currentIndex - 1].id);
  }
  if (!current || snoozed || finished) return (
    <div className="instant-inbox moment-empty-state">
      <div className="instant-inbox-intro">
        <span className="instant-eyebrow">UGRADS MOMENTS</span>
        <h3>{snoozed ? "A little quiet time." : authorName && !finished ? `No moments from ${authorName} right now.` : "All caught up."}</h3>
        <p>{snoozed ? "Your feed is snoozed for 24 hours." : "Come back for another glimpse of their day."}</p>
      </div>
      <div className="instant-empty-art">{snoozed ? <Moon size={48} strokeWidth={1} /> : <Check size={48} strokeWidth={1} />}</div>
      <button className="instant-primary" onClick={onCamera}><Camera size={18} />Capture a moment</button>
      {finished && current && <button className="instant-text-button" onClick={() => setFinished(false)}>Back to last moment</button>}
      {snoozed && <button className="instant-text-button" onClick={() => snoozeInstants(false)}>Resume moments</button>}
    </div>
  );
  return (
    <div className="moment-feed">
      <div className="moment-deck" ref={deck} role="region" aria-roledescription="carousel" aria-label="Moments photos" tabIndex={0}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (["ArrowRight", "ArrowLeft", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            if (e.key === "ArrowLeft") previous();
            else advance();
          }
        }}>
        {visible.map((item, i) => <MomentSlide key={item.id} item={item} offset={i - currentIndex} onAdvance={advance} last={currentIndex === visible.length - 1} />)}
      </div>
      <div className="moment-meta">
        <button className="instant-icon-button" aria-label="Previous moment" disabled={currentIndex === 0} onClick={previous}><ArrowLeft size={18} /></button>
        <div className="instant-byline"><b>{current.name}</b><span>{Math.max(1, Math.floor((now - current.createdAt) / 60000))}m</span></div>
        <span className="moment-page-status" aria-live="polite" aria-atomic="true">{currentIndex + 1} / {visible.length}</span>
      </div>
      <MomentActions key={current.id} current={current} notify={notify} />
    </div>
  );
}

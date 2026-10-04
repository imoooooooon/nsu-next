import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CameraOff,
  Check,
  ChevronDown,
  Grid2X2,
  Image,
  Info,
  Moon,
  Plus,
  RotateCcw,
  Send,
  Star,
  SwitchCamera,
  Trash2,
  Type,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  archivedInstants,
  availableInstants,
  INSTANT_TTL,
} from "./instantModel";
import {
  openInstant,
  publishRecap,
  reactToInstant,
  removeInstant,
  replyToInstant,
  sendInstant,
  snoozeInstants,
  useInstantClock,
  useInstantState,
} from "./instantStore";
import "./instants.css";

function PickerIcon({ icon }) {
  const Component = icon;
  return <Component size={25} strokeWidth={1.8} />;
}

export function MomentTypePicker({ onNote, onStory, onInstant, t }) {
  return (
    <div className="moment-type-picker">
      <p className={`mb-5 text-sm ${t.textMuted}`}>What’s your moment?</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Notes", "A little thought", Type, onNote, "violet"],
          ["Story", "Photo or video", Image, onStory, "blue"],
          ["Instant", "Right here, right now", Zap, onInstant, "green"],
        ].map(([title, description, icon, onClick, color]) => (
          <button
            type="button"
            key={title}
            onClick={onClick}
            className={`moment-type ${t.card} ${t.borderSoft} ${t.text}`}
          >
            <span className={`moment-type-icon ${color}`}>
              <PickerIcon icon={icon} />
            </span>
            <span className="text-sm font-bold">{title}</span>
            <span className={`text-[10px] leading-4 ${t.textMuted}`}>
              {description}
            </span>
          </button>
        ))}
      </div>
      <p className={`text-[11px] text-center mt-5 ${t.textMuted}`}>
        Stories & notes last 24 hours. Instants are viewed once.
      </p>
    </div>
  );
}

export function InstantEntry({ t }) {
  const snapshot = useInstantState();
  const now = useInstantClock();
  const [open, setOpen] = useState(false);
  const count = availableInstants(snapshot, now).length;
  const snoozed = snapshot.snoozedUntil > now;
  return (
    <>
      <button
        type="button"
        className={`instant-entry ${t.text}`}
        aria-label={`Open Instants${snoozed ? ", snoozed" : `, ${count} new`}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(true)}
      >
        <span
          className={`instant-mini-stack ${!count || snoozed ? "is-quiet" : ""}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span>
            <Zap size={23} fill="currentColor" strokeWidth={1.5} />
          </span>
          {count > 0 && !snoozed && <b>{count}</b>}
          {snoozed && (
            <b>
              <Moon size={10} />
            </b>
          )}
        </span>
        <span className="text-[11px] font-semibold">Instants</span>
      </button>
      {open && <InstantDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function IconButton({ label, children, onClick, ...props }) {
  return (
    <button
      type="button"
      className="instant-icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function InstantDialog({ onClose, initialScreen = "inbox" }) {
  const dialog = useRef(null);
  const [screen, setScreen] = useState(initialScreen);
  const [closing, setClosing] = useState(false);
  const [info, setInfo] = useState(false);
  const [notice, setNotice] = useState("");
  const [sendBackTo, setSendBackTo] = useState("");
  const close = () => setClosing(true);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);
  return createPortal(
    <dialog
      ref={dialog}
      className={`instant-dialog ${closing ? "is-closing" : ""}`}
      aria-label="Ugrads Instants"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onAnimationEnd={(e) => {
        if (closing && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="instant-shell">
        <header className="instant-header">
          <IconButton
            label={
              screen === "inbox" ||
              (initialScreen === "camera" && screen === "camera")
                ? "Close Instants"
                : initialScreen === "camera"
                  ? "Back to camera"
                  : "Back to Instants"
            }
            onClick={() =>
              screen === "inbox" ||
              (initialScreen === "camera" && screen === "camera")
                ? close()
                : setScreen(initialScreen === "camera" ? "camera" : "inbox")
            }
          >
            {screen === "inbox" ||
            (initialScreen === "camera" && screen === "camera") ? (
              <X size={23} />
            ) : (
              <ArrowLeft size={23} />
            )}
          </IconButton>
          <div className="instant-heading">
            <h2>
              {screen === "archive"
                ? "Your instants"
                : screen === "camera"
                  ? "Capture an instant"
                  : "Instants"}
            </h2>
            <span>
              {screen === "archive"
                ? "Only visible to you"
                : screen === "camera"
                  ? "A little less polished. A little more you."
                  : "Here for a moment."}
            </span>
          </div>
          <div className="instant-header-actions">
            {screen === "inbox" && (
              <IconButton label="About Instants" onClick={() => setInfo(!info)}>
                <Info size={19} />
              </IconButton>
            )}
            {screen !== "archive" && (
              <IconButton
                label="Your instant archive"
                onClick={() => setScreen("archive")}
              >
                <Grid2X2 size={21} />
              </IconButton>
            )}
            {screen !== "camera" && (
              <IconButton
                label="Capture an instant"
                onClick={() => {
                  setSendBackTo("");
                  setScreen("camera");
                }}
              >
                <Camera size={22} />
              </IconButton>
            )}
          </div>
        </header>
        {info && (
          <div className="instant-info">
            <button
              aria-label="Dismiss information"
              onClick={() => setInfo(false)}
            >
              <X size={16} />
            </button>
            <b>One look. A little connection.</b>
            <p>
              Take a photo, add a thought, and share with close friends or
              mutuals. Instants disappear after viewing or 24 hours.
            </p>
            <p>Screen capture can’t be blocked in a browser.</p>
            <p>
              This prototype keeps captures and replies in this browser session;
              it doesn’t send them to other people.
            </p>
          </div>
        )}
        <div className="instant-content" key={screen}>
          {screen === "inbox" && (
            <InstantInbox
              notify={setNotice}
              onCamera={(name) => {
                setSendBackTo(name || "");
                setScreen("camera");
              }}
            />
          )}
          {screen === "camera" && <InstantCamera sendBackTo={sendBackTo} />}
          {screen === "archive" && (
            <InstantArchive
              notify={setNotice}
              onCamera={() => {
                setSendBackTo("");
                setScreen("camera");
              }}
            />
          )}
        </div>
        {notice && (
          <div className="instant-toast" role="status">
            <Check size={16} />
            {notice}
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}

function InstantInbox({ notify, onCamera }) {
  const snapshot = useInstantState();
  const now = useInstantClock();
  const [skipped, setSkipped] = useState([]);
  const unread = availableInstants(snapshot, now).filter(
    (item) => !skipped.includes(item.id),
  );
  const [active, setActive] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [reply, setReply] = useState("");
  const [burst, setBurst] = useState(null);
  const [extraReactions, setExtraReactions] = useState(false);
  const activeValid = active && now < active.createdAt + INSTANT_TTL;
  const snoozed = snapshot.snoozedUntil > now;
  const next = unread[0];
  // Loading does not spend a view. Consumption happens only when the photo decodes.
  const reveal = () => {
    if (next) {
      setLoadError(false);
      setLoadingId(next.id);
    }
  };
  const loaded = (item) => {
    if (openInstant(item.id)) {
      setActive(item);
      setReply("");
    }
    setLoadingId(null);
  };
  const advance = () => {
    setLeaving(true);
  };
  const handleReaction = (emoji) => {
    if (!activeValid) return;
    reactToInstant(active.id, emoji);
    setBurst((previous) => ({ emoji, key: (previous?.key || 0) + 1 }));
    notify(`${emoji} reaction saved`);
  };
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        setActive(null);
        setLoadingId(null);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  return (
    <div className="instant-inbox">
      {activeValid ? (
        <>
          <div className="instant-stack-stage">
            {unread.length > 0 && (
              <div className="instant-card-back back-one" />
            )}
            {unread.length > 1 && (
              <div className="instant-card-back back-two" />
            )}
            <div
              className={`instant-photo-card ${leaving ? "departing" : "revealed"}`}
              onAnimationEnd={(e) => {
                if (leaving && e.target === e.currentTarget) {
                  setActive(null);
                  setLeaving(false);
                  setBurst(null);
                }
              }}
            >
              <img
                src={active.photo}
                alt={`Instant from ${active.name}`}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              {active.caption && (
                <p className="instant-photo-caption">{active.caption}</p>
              )}
            </div>
            {burst && (
              <div
                className="instant-reaction-burst"
                key={burst.key}
                aria-hidden="true"
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      "--i": i,
                      "--x": `${((i % 3) - 1) * 66}px`,
                      "--rotation": `${(i - 4) * 13}deg`,
                    }}
                  >
                    {burst.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="instant-byline">
            <b>{active.name}</b>
            <span>
              {Math.max(1, Math.floor((now - active.createdAt) / 60000))}m
            </span>
            <span className="instant-view-once">
              <Zap size={11} />
              View once
            </span>
          </div>
          <div className="instant-reactions" aria-label="React to this instant">
            {["😂", "❤️", "🌸", "👏"].map((emoji, i) => (
              <button
                key={emoji}
                className={`reaction-${i} ${snapshot.reactions[active.id] === emoji ? "selected" : ""}`}
                aria-label={`React ${emoji}`}
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
            <button
              className="reaction-more"
              aria-label="More reactions"
              aria-expanded={extraReactions}
              onClick={() => setExtraReactions(!extraReactions)}
            >
              <Plus size={23} />
            </button>
          </div>
          {extraReactions && (
            <div className="instant-extra-reactions">
              {["🔥", "🥹", "😍", "💙", "🙌"].map((emoji) => (
                <button
                  key={emoji}
                  aria-label={`React ${emoji}`}
                  onClick={() => {
                    handleReaction(emoji);
                    setExtraReactions(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <div className="instant-view-actions">
            <button onClick={() => onCamera(active.name)}>
              <Camera size={16} />
              Send one back
            </button>
            <button onClick={advance} disabled={leaving}>
              {unread.length ? "Next instant" : "Done"}
              <ArrowRight size={17} />
            </button>
          </div>
          <form
            className="instant-reply"
            onSubmit={(e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              replyToInstant(active.id, reply);
              setReply("");
              notify("Reply saved");
            }}
          >
            <input
              aria-label={`Reply to ${active.name}`}
              placeholder={`Reply to ${active.name}…`}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              maxLength={500}
            />
            <button
              type="submit"
              aria-label="Send reply"
              disabled={!reply.trim()}
            >
              <Send size={19} />
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="instant-inbox-intro">
            <span className="instant-eyebrow">UGRADS MOMENTS</span>
            <h3>
              {snoozed
                ? "A little quiet time."
                : next
                  ? "A glimpse of their day."
                  : "All caught up."}
            </h3>
            <p>
              {snoozed
                ? "Your instants are snoozed for 24 hours."
                : next
                  ? "Open it once. Keep the feeling."
                  : "The photo disappears. The connection stays."}
            </p>
          </div>
          {next && !snoozed ? (
            <>
              <button
                className="instant-unopened-stack"
                onClick={reveal}
                disabled={!!loadingId}
                aria-label={`Open instant from ${next.name}`}
              >
                <span className="instant-card-back back-two" />
                <span className="instant-card-back back-one" />
                <span className="instant-photo-card covered">
                  <span className="instant-cover-art" />
                  <span className="instant-cover-label">
                    <Zap size={32} fill="currentColor" />
                    <b>{loadingId ? "Opening…" : "Tap to open"}</b>
                    <small>
                      {next.name}
                      {unread.length > 1 ? ` + ${unread.length - 1} more` : ""}
                    </small>
                  </span>
                </span>
              </button>
              <p className="instant-stack-count">
                {unread.length} new{" "}
                {unread.length === 1 ? "instant" : "instants"} · view once
              </p>
              {loadingId && (
                <img
                  className="instant-preload"
                  src={next.photo}
                  alt=""
                  onLoad={() => loaded(next)}
                  onError={() => {
                    setLoadingId(null);
                    setLoadError(true);
                  }}
                />
              )}
              {loadError && (
                <div className="instant-error" role="alert">
                  <p>Couldn’t load this photo. Tap the stack to retry.</p>
                  <button
                    className="instant-text-button"
                    onClick={() => {
                      setSkipped((prev) => [...prev, next.id]);
                      setLoadError(false);
                    }}
                  >
                    Skip for now
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="instant-empty-art" aria-hidden="true">
              {snoozed ? (
                <Moon size={48} strokeWidth={1} />
              ) : (
                <Check size={48} strokeWidth={1} />
              )}
            </div>
          )}
          <button className="instant-primary" onClick={() => onCamera("")}>
            <Camera size={18} />
            Share a little of your day
          </button>
          <button
            className="instant-text-button"
            onClick={() => snoozeInstants(!snoozed)}
          >
            {snoozed ? "Resume instants" : "Snooze for 24 hours"}
          </button>
          <p className="instant-footnote">
            Unopened instants expire after 24 hours.
          </p>
        </>
      )}
    </div>
  );
}

function InstantCamera({ sendBackTo }) {
  const video = useRef(null);
  const stream = useRef(null);
  const request = useRef({ version: 0 });
  const [camera, setCamera] = useState("idle");
  const [facing, setFacing] = useState("user");
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [audience, setAudience] = useState("mutuals");
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [sent, setSent] = useState(null);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);
  const now = useInstantClock();
  const stop = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  };
  useEffect(() => {
    const token = request.current;
    const hide = () => {
      if (document.hidden) {
        token.version++;
        stop();
        setCamera("idle");
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      token.version++;
      stop();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  async function start(nextFacing = facing) {
    const id = ++request.current.version;
    stop();
    setCamera("loading");
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("error");
      setError(
        "Camera access needs HTTPS or localhost and a supported browser.",
      );
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextFacing },
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      if (id !== request.current.version) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      video.current.srcObject = media;
      await video.current.play();
      if (id !== request.current.version) return;
      setFacing(nextFacing);
      setCamera("ready");
    } catch (err) {
      if (id !== request.current.version) return;
      stop();
      setCamera("error");
      setError(
        err.name === "NotAllowedError"
          ? "Camera access is blocked. Allow it in your browser’s site settings, then try again."
          : err.name === "NotFoundError"
            ? "No camera found. Connect a camera, then try again."
            : "Your camera isn’t available. Close other apps using it, then try again.",
      );
    }
  }
  function capture() {
    const element = video.current;
    if (camera !== "ready" || !element.videoWidth) return;
    const canvas = document.createElement("canvas");
    const size = Math.min(element.videoWidth, element.videoHeight);
    canvas.width = canvas.height = Math.min(size, 960);
    const ctx = canvas.getContext("2d");
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      element,
      (element.videoWidth - size) / 2,
      (element.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    setFlash(true);
    stop();
    setCamera("idle");
  }
  function share() {
    const result = sendInstant(photo, caption, audience);
    if (!result) return;
    setSent(result.item);
    setPhoto(null);
    setCaption("");
    setError(
      result.persisted
        ? ""
        : "Shared in this session, but storage is full. This instant won’t survive a reload.",
    );
  }
  return (
    <div className="instant-camera">
      <p className="instant-camera-lead">
        {sendBackTo
          ? `Inspired by ${sendBackTo}’s instant`
          : "Just you. Just now."}
      </p>
      <div
        className={`instant-camera-window ${flash ? "camera-flash" : ""}`}
        onAnimationEnd={() => setFlash(false)}
      >
        <video
          ref={video}
          autoPlay
          muted
          playsInline
          className={facing === "user" ? "mirrored" : ""}
          style={{ opacity: camera === "ready" && !photo ? 1 : 0 }}
          aria-hidden={camera !== "ready" || !!photo}
          aria-label="Live camera preview"
        />
        {photo && <img src={photo} alt="Your captured instant" />}
        {!photo && camera !== "ready" && (
          <div className="instant-camera-placeholder">
            {camera === "error" ? (
              <CameraOff size={35} strokeWidth={1.5} />
            ) : (
              <Camera size={35} strokeWidth={1.5} />
            )}
            <h3>
              {camera === "loading"
                ? "Opening your camera…"
                : camera === "error"
                  ? "Let’s get your camera ready"
                  : "Let life in."}
            </h3>
            <p>
              {error ||
                "Instants start with your camera. No uploads. No filters."}
            </p>
            {camera !== "loading" && (
              <button className="instant-primary" onClick={() => start()}>
                {camera === "error" ? "Try again" : "Enable camera"}
              </button>
            )}
          </div>
        )}
        {(photo || camera === "ready") && (
          <input
            className="instant-caption-input"
            aria-label="Instant caption"
            placeholder="Add a thought…"
            maxLength={100}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        )}
      </div>
      <div className="instant-audience">
        <button
          onClick={() => setAudienceOpen(!audienceOpen)}
          aria-expanded={audienceOpen}
        >
          {audience === "close-friends" ? (
            <Star size={15} fill="currentColor" />
          ) : (
            <Users size={16} />
          )}
          {audience === "close-friends" ? "Close friends" : "Mutual followers"}
          <ChevronDown size={15} />
        </button>
        {audienceOpen && (
          <div
            className="instant-audience-options"
            role="group"
            aria-label="Share with"
          >
            {[
              [
                "mutuals",
                "Mutual followers",
                "People you follow who follow you back",
              ],
              ["close-friends", "Close friends", "Your close friends list"],
            ].map(([value, label, help]) => (
              <button
                key={value}
                aria-pressed={audience === value}
                onClick={() => {
                  setAudience(value);
                  setAudienceOpen(false);
                }}
              >
                <span>
                  <b>{label}</b>
                  <small>{help}</small>
                </span>
                {audience === value && <Check size={18} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="instant-capture-controls">
        <IconButton
          label={photo ? "Retake photo" : "Switch camera"}
          disabled={!photo && camera !== "ready"}
          onClick={() => {
            if (photo) {
              setPhoto(null);
              start();
            } else start(facing === "user" ? "environment" : "user");
          }}
        >
          {photo ? <RotateCcw size={23} /> : <SwitchCamera size={25} />}
        </IconButton>
        {photo ? (
          <button
            className="instant-shutter send"
            aria-label="Share instant"
            onClick={share}
          >
            <ArrowRight size={31} />
          </button>
        ) : (
          <button
            className="instant-shutter"
            aria-label="Take photo"
            disabled={camera !== "ready"}
            onClick={capture}
          >
            <span />
          </button>
        )}
        <span className="instant-control-spacer" />
      </div>
      <p className="instant-footnote">
        {photo
          ? "Share this moment. They can open it once."
          : "Take a photo, then share when you’re ready."}
      </p>
      {sent && (
        <div className="instant-sent" role="status">
          <Check size={17} />
          <span>
            Instant shared
            {sent.audience === "close-friends"
              ? " with close friends"
              : " with mutuals"}
            .
          </span>
          {now - sent.createdAt < 10000 && (
            <button
              onClick={() => {
                removeInstant(sent.id);
                setSent(null);
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}
      {error && camera !== "error" && (
        <p className="instant-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function InstantArchive({ notify, onCamera }) {
  const snapshot = useInstantState();
  const now = useInstantClock();
  const items = archivedInstants(snapshot, now);
  const [selected, setSelected] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [detail, setDetail] = useState(null);
  if (detail)
    return (
      <div className="instant-archive-detail">
        <button className="instant-text-button" onClick={() => setDetail(null)}>
          <ArrowLeft size={16} />
          Back to archive
        </button>
        <div className="instant-photo-card">
          <img src={detail.photo} alt="Your archived instant" />
          {detail.caption && (
            <p className="instant-photo-caption">{detail.caption}</p>
          )}
        </div>
        <p className="instant-footnote">
          {new Date(detail.createdAt).toLocaleString()} ·{" "}
          {detail.audience === "close-friends"
            ? "Close friends"
            : "Mutual followers"}
        </p>
        <button
          className="instant-delete"
          onClick={() => {
            removeInstant(detail.id);
            setDetail(null);
            notify("Instant deleted and unsent");
          }}
        >
          <Trash2 size={16} />
          Delete & unsend
        </button>
        <p className="instant-footnote">
          Removes it from your archive and from anyone who hasn’t opened it.
        </p>
      </div>
    );
  return (
    <div className="instant-archive">
      <div className="instant-archive-intro">
        <h3>Your little everyday.</h3>
        <p>Saved just for you, for up to a year.</p>
      </div>
      {items.length ? (
        <>
          <div className="instant-archive-label">
            <span>
              {selecting ? "Choose photos for your story" : "Recent instants"}
            </span>
            {selecting && (
              <button
                onClick={() => {
                  setSelecting(false);
                  setSelected([]);
                }}
              >
                Cancel
              </button>
            )}
          </div>
          <div className="instant-archive-grid">
            {items.map((item) => (
              <button
                key={item.id}
                aria-label={`${selecting ? "Select" : "View"} instant ${new Date(item.createdAt).toLocaleTimeString()}`}
                aria-pressed={
                  selecting ? selected.includes(item.id) : undefined
                }
                onClick={() =>
                  selecting
                    ? setSelected((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id],
                      )
                    : setDetail(item)
                }
              >
                <img src={item.photo} alt={item.caption || "Your instant"} />
                {selecting && (
                  <span className={selected.includes(item.id) ? "checked" : ""}>
                    {selected.includes(item.id) && <Check size={15} />}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            className="instant-primary"
            disabled={selecting && !selected.length}
            onClick={() => {
              if (!selecting) {
                setSelecting(true);
                return;
              }
              if (publishRecap(selected)) {
                notify("Recap shared to your Story");
                setSelected([]);
                setSelecting(false);
              }
            }}
          >
            {selecting
              ? `Share ${selected.length || ""} to Story`
              : "Create recap"}
            <Plus size={16} />
          </button>
        </>
      ) : (
        <div className="instant-archive-empty">
          <Grid2X2 size={36} strokeWidth={1.3} />
          <h3>Your moments start here.</h3>
          <p>
            Instants you share will be saved here, even after your friends view
            them.
          </p>
          <button className="instant-primary" onClick={onCamera}>
            <Camera size={18} />
            Capture your first instant
          </button>
        </div>
      )}
    </div>
  );
}

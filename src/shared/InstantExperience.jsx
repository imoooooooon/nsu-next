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
  Info,
  Moon,
  Plus,
  RotateCcw,
  Star,
  SwitchCamera,
  Trash2,
  Type,
  Users,
  X,
  Layers,
} from "lucide-react";
import {
  archivedInstants,
  availableInstants,
  momentsForAuthor,
} from "./instantModel";
import {
  removeInstant,
  sendInstant,
  snoozeInstants,
  useInstantClock,
  useInstantState,
  getInstantState,
  updateMomentPresentation,
} from "./instantStore";
import { MomentCaption, MomentFrameEditor } from "./MomentMedia";
import { frameStyle } from "./momentFrames";
import { MomentsFeed } from "./MomentsFeed";
import "./instants.css";

function PickerIcon({ icon }) {
  const Component = icon;
  return <Component size={25} strokeWidth={1.8} />;
}

export function MomentTypePicker({ onNote, onInstant, t }) {
  return (
    <div className="moment-type-picker">
      <p className={`mb-5 text-sm ${t.textMuted}`}>What’s your moment?</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Notes", "A little thought", Type, onNote, "violet"],
          ["Moments", "Right here, right now", Camera, onInstant, "blue"],
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
        A thought or a photo. Share a little of your day.
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
        aria-label={`Open Moments${snoozed ? ", snoozed" : `, ${count} new`}`}
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
            <Layers size={23} strokeWidth={1.7} />
          </span>
          {count > 0 && !snoozed && <b>{count}</b>}
          {snoozed && (
            <b>
              <Moon size={10} />
            </b>
          )}
        </span>
        <span className="text-[11px] font-semibold">Moments</span>
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

export function InstantDialog({
  onClose,
  initialScreen = "inbox",
  authorId,
  authorName,
}) {
  const dialog = useRef(null);
  const [screen, setScreen] = useState(initialScreen);
  const [closing, setClosing] = useState(false);
  const [info, setInfo] = useState(false);
  const [notice, setNotice] = useState("");
  const [sessionMoments] = useState(() =>
    authorId
      ? momentsForAuthor(getInstantState(), Date.now(), authorId)
      : availableInstants(getInstantState(), Date.now()),
  );
  useEffect(() => {
    const viewport = window.visualViewport;
    const resize = () => dialog.current?.style.setProperty("--moment-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
    resize();
    viewport?.addEventListener("resize", resize);
    return () => viewport?.removeEventListener("resize", resize);
  }, []);
  const close = () => setClosing(true);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    const hide = () => {
      if (document.hidden) setClosing(true);
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      document.removeEventListener("visibilitychange", hide);
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
      aria-label="Ugrads Moments"
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
          <IconButton label="Close Moments" onClick={close}>
            <X size={23} />
          </IconButton>
          <div className="instant-heading">
            <h2>Moments</h2>
          </div>
          <div className="instant-header-actions">
            <IconButton label="About Moments" onClick={() => setInfo(!info)}>
              <Info size={20} />
            </IconButton>
            <IconButton
              label={
                screen === "archive"
                  ? "Back to moments"
                  : "Your moments archive"
              }
              onClick={() =>
                setScreen(screen === "archive" ? initialScreen : "archive")
              }
            >
              <Grid2X2 size={21} />
            </IconButton>
            <IconButton
              label="Capture a moment"
              aria-pressed={screen === "camera"}
              onClick={() => setScreen("camera")}
            >
              <Camera size={22} />
            </IconButton>
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
            <b>A little connection.</b>
            <p>
              Share a photo with close friends or mutual followers. Tap the photo
              to advance. Viewed cards move to the right; the next cards wait on
              the left. The stack shows unseen Moments; profiles let you revisit
              their Moments. All Moments disappear 24 hours after posting, including
              your saved captures.
            </p>
            <p>Screen capture can’t be blocked in a browser.</p>
            <p>
              This prototype keeps photos and replies in this browser session.
              It doesn’t send them to other people.
            </p>
            <button
              className="instant-text-button"
              onClick={() => {
                snoozeInstants(true);
                setInfo(false);
                close();
              }}
            >
              Snooze feed for 24 hours
            </button>
          </div>
        )}
        <div className={`instant-content instant-content-${screen}`} key={screen}>
          {screen !== initialScreen && (
            <button
              className="instant-text-button moment-screen-back"
              onClick={() => setScreen(initialScreen)}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          {screen === "inbox" && (
            <MomentsFeed
              items={sessionMoments}
              authorName={authorName}
              notify={setNotice}
              onCamera={() => setScreen("camera")}
            />
          )}
          {screen === "camera" && <InstantCamera />}
          {screen === "archive" && (
            <InstantArchive
              notify={setNotice}
              onCamera={() => setScreen("camera")}
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

function InstantCamera() {
  const video = useRef(null);
  const stream = useRef(null);
  const request = useRef({ version: 0 });
  const [camera, setCamera] = useState("idle");
  const [facing, setFacing] = useState("user");
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [frame, setFrame] = useState("squircle");
  const captionPosition = 81;
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
    const result = sendInstant(photo, caption, audience, {
      frame,
      captionPosition,
    });
    if (!result) return;
    setSent(result.item);
    setPhoto(null);
    setCaption("");
    setError(
      result.persisted
        ? ""
        : "Shared in this session, but storage is full. This moment won’t survive a reload.",
    );
  }
  return (
    <div className="instant-camera">
      <p className="instant-camera-lead">Capture your moment</p>
      <div className="instant-camera-stage">
      <div
        className={`instant-camera-window ${flash ? "camera-flash" : ""}`}
        style={frameStyle(frame)}
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
        {photo && <img src={photo} alt="Your captured moment" />}
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
                "Moments start with your camera. No uploads. No filters."}
            </p>
            {camera !== "loading" && (
              <button className="instant-primary" onClick={() => start()}>
                {camera === "error" ? "Try again" : "Enable camera"}
              </button>
            )}
          </div>
        )}
        {(photo || camera === "ready") && (
          <MomentCaption
            caption={caption}
            frame={frame}
            captionPosition={captionPosition}
          />
        )}
      </div>
      </div>
      {(photo || camera === "ready") && (
        <input
          className="instant-caption-input"
          aria-label="Moment caption"
          placeholder="Add a thought…"
          maxLength={100}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      )}
      {photo && (
        <MomentFrameEditor
          frame={frame}
          onFrame={setFrame}
        />
      )}
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
      <div className={`instant-capture-controls ${photo ? "has-photo" : ""}`}>
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
            className="instant-share-pill"
            aria-label="Share moment"
            onClick={share}
          >
            Share moment <ArrowRight size={20} />
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
        {!photo && <span className="instant-control-spacer" />}
      </div>
      <p className="instant-footnote">
        {photo
          ? "Gone in 24 hours. A little connection for today."
          : "Take a photo, then share when you’re ready."}
      </p>
      {sent && (
        <div className="instant-sent" role="status">
          <Check size={17} />
          <span>
            Moment shared
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
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  if (detail && items.some((item) => item.id === detail.id))
    return (
      <div className="instant-archive-detail">
        <button className="instant-text-button" onClick={() => setDetail(null)}>
          <ArrowLeft size={16} />
          Back to archive
        </button>
        <div className="instant-camera-stage">
        <div className="instant-photo-card" style={frameStyle(detail.frame)}>
          <img src={detail.photo} alt="Your archived moment" />
          <MomentCaption {...detail} />
        </div>
        </div>
        <p className="instant-footnote">
          {new Date(detail.createdAt).toLocaleString()} ·{" "}
          {detail.audience === "close-friends"
            ? "Close friends"
            : "Mutual followers"}
        </p>
        <button
          className="instant-primary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Done" : "Edit frame"}
        </button>
        {editing && (
          <MomentFrameEditor
            frame={detail.frame || "squircle"}
            onFrame={(frame) => {
              updateMomentPresentation(detail.id, {
                frame,
                captionPosition: 81,
              });
              setDetail({ ...detail, frame, captionPosition: 81 });
            }}
          />
        )}
        <button
          className="instant-delete"
          onClick={() => {
            removeInstant(detail.id);
            setDetail(null);
            notify("Moment deleted and unsent");
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
        <p>Your captures from the last 24 hours.</p>
      </div>
      {items.length ? (
        <>
          <div className="instant-archive-label">
            <span>Recent moments</span>
          </div>
          <div className="instant-archive-grid">
            {items.slice(currentPage * 6, currentPage * 6 + 6).map((item) => (
              <button
                key={item.id}
                style={frameStyle(item.frame)}
                aria-label={`View moment ${new Date(item.createdAt).toLocaleTimeString()}`}
                onClick={() => {
                  setDetail(item);
                  setEditing(false);
                }}
              >
                <img src={item.photo} alt={item.caption || "Your moment"} />
              </button>
            ))}
          </div>
          {pageCount > 1 && <nav className="moment-archive-pagination" aria-label="Archive pages">
            <IconButton label="Previous archive page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={18} /></IconButton>
            <span>{currentPage + 1} / {pageCount}</span>
            <IconButton label="Next archive page" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}><ArrowRight size={18} /></IconButton>
          </nav>}
        </>
      ) : (
        <div className="instant-archive-empty">
          <Grid2X2 size={36} strokeWidth={1.3} />
          <h3>Your moments start here.</h3>
          <p>
            Moments you share stay here until 24 hours after posting.
          </p>
          <button className="instant-primary" onClick={onCamera}>
            <Camera size={18} />
            Capture your first moment
          </button>
        </div>
      )}
    </div>
  );
}

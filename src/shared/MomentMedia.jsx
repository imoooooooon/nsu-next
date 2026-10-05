import { useId } from "react";
import { MOMENT_FRAMES, frameStyle, momentFrame } from "./momentFrames";

export function MomentCaption({
  caption,
  frame = "squircle",
  captionPosition = 81,
}) {
  const id = useId();
  if (!caption) return null;
  const text = caption.toLocaleUpperCase();
  const path = momentFrame(frame).path;
  return (
    <svg
      className="instant-photo-caption"
      viewBox="0 0 1000 1000"
      role="img"
      aria-label={caption}
    >
      <g transform="translate(85 85) scale(.83)">
        <defs>
          <path id={id} d={`${path} ${path}`} />
        </defs>
        <text
          fontSize={Math.min(52, Math.max(26, 1100 / (text.length * 0.65)))}
          textLength={text.length > 28 ? 1100 : undefined}
          lengthAdjust="spacingAndGlyphs"
        >
          <textPath href={`#${id}`} startOffset={`${captionPosition / 2}%`}>
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

export function MomentFrameEditor({
  frame,
  captionPosition,
  onFrame,
  onPosition,
}) {
  return (
    <div className="moment-frame-editor">
      <fieldset>
        <legend>Choose a frame</legend>
        <div className="moment-frame-options">
          {MOMENT_FRAMES.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={frame === option.id}
              onClick={() => onFrame(option.id)}
              aria-label={option.label}
            >
              <span
                className="moment-frame-swatch"
                style={frameStyle(option.id)}
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <label
        className="moment-position-label"
        htmlFor="moment-caption-position"
      >
        Caption position <span>{Math.round(captionPosition)}%</span>
      </label>
      <input
        id="moment-caption-position"
        aria-label="Caption position around frame"
        type="range"
        min="0"
        max="100"
        step="1"
        value={captionPosition}
        onChange={(e) => onPosition(Number(e.target.value))}
      />
      <div className="moment-position-presets">
        {[
          ["Top left", 81],
          ["Top", 0],
          ["Right", 25],
          ["Bottom", 50],
          ["Left", 75],
        ].map(([label, value]) => (
          <button
            type="button"
            key={label}
            onClick={() => onPosition(value)}
            aria-pressed={captionPosition === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

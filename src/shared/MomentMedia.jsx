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
      <g transform="translate(60 60) scale(.88)">
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

export function MomentFrameEditor({ frame, onFrame }) {
  return (
    <fieldset className="moment-frame-editor">
      <legend>Frame</legend>
      <div className="moment-frame-options">
        {MOMENT_FRAMES.map((option) => (
          <button key={option.id} type="button" aria-pressed={frame === option.id}
            onClick={() => onFrame(option.id)} aria-label={option.label} title={option.label}>
            <span className="moment-frame-swatch" style={frameStyle(option.id)} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

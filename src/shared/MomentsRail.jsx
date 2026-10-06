import { useRef, useState } from "react";
import { BadgeCheck, Plus, User } from "lucide-react";
import { InstantDialog, InstantEntry } from "./InstantExperience";
import { momentsForAuthor } from "./instantModel";
import { useInstantClock, useInstantState } from "./instantStore";

export function MomentsRail({ moments, t, isDark, onCreateClick, onOpenNote }) {
  const [author, setAuthor] = useState(null);
  const drag = useRef(null);
  const dragged = useRef(false);
  const snapshot = useInstantState();
  const now = useInstantClock();
  return (
    <div className="moments-rail-shell">
      <div
        className="moments-rail"
        aria-label="Moments and notes"
        onPointerDown={(e) => {
          dragged.current = false;
          if (e.pointerType === "mouse" && e.button === 0)
            drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const distance = drag.current.x - e.clientX;
          if (Math.abs(distance) > 6) {
            dragged.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            e.currentTarget.scrollLeft = drag.current.left + distance;
          }
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (dragged.current && e.detail > 0) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <button
          className={`moment-rail-person ${t.text}`}
          onClick={onCreateClick}
          aria-label="Create a moment or note"
        >
          <span className={`moment-rail-avatar ${isDark ? "dark" : ""}`}>
            <User size={30} strokeWidth={1.5} />
            <span className="moment-rail-plus">
              <Plus size={14} />
            </span>
          </span>
          <span>Your Moment</span>
        </button>
        <InstantEntry t={t} />
        {moments.map((group) => {
          const note = group.items.find((item) => item.type === "note");
          const photos = momentsForAuthor(snapshot, now, group.id);
          const count = photos.filter((item) => !snapshot.opened[item.id]).length;
          return (
            <div className={`moment-rail-person ${t.text}`} key={group.id}>
              <div className="moment-rail-profile">
                {note && (
                  <button
                    className="moment-rail-note"
                    aria-label={`Read ${group.user.name}'s note`}
                    onClick={() => onOpenNote(group)}
                  >
                    {note.content}
                  </button>
                )}
                <button
                  className={`moment-rail-avatar ${isDark ? "dark" : ""} ${count ? "has-moments" : photos.length ? "has-viewed-moments" : ""}`}
                  aria-label={`Open ${group.user.name}'s moments, ${photos.length} available, ${count} new`}
                  onClick={() => setAuthor(group)}
                >
                  <User size={30} strokeWidth={1.5} />
                </button>
              </div>
              <button
                className="moment-rail-name"
                onClick={() => setAuthor(group)}
                aria-label={`View ${group.user.name}'s moments`}
              >
                <span>{group.user.name.split(" ")[0]}</span>
                {group.user.verified && (
                  <BadgeCheck size={12} className="text-[#1D9BF0]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
      {author && (
        <InstantDialog
          authorId={author.id}
          authorName={author.user.name}
          onClose={() => setAuthor(null)}
        />
      )}
    </div>
  );
}

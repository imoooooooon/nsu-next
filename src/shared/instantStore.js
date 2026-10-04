import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ARCHIVE_TTL,
  INSTANT_TTL,
  initialInstantState,
  consumeInstant,
  createInstant,
} from "./instantModel.js";

const STORAGE_KEY = "ugrads-instants-v1";
function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (
      saved?.version === 1 &&
      Array.isArray(saved.received) &&
      Array.isArray(saved.sent) &&
      Array.isArray(saved.recaps) &&
      saved.opened
    )
      return saved;
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
  const initial = initialInstantState(Date.now());
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    /* Keep this session in memory. */
  }
  return initial;
}
let state = load();
const listeners = new Set();
export const getInstantState = () => state;
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const useInstantState = () =>
  useSyncExternalStore(subscribe, getInstantState, getInstantState);
function update(next) {
  state = next;
  let persisted = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    persisted = false;
  }
  listeners.forEach((listener) => listener());
  return persisted;
}
export function openInstant(id) {
  const next = consumeInstant(state, id, Date.now());
  if (next === state) return false;
  update(next);
  return true;
}
export function sendInstant(photo, caption, audience) {
  const now = Date.now();
  const item = createInstant(
    photo,
    caption,
    audience,
    now,
    crypto.randomUUID(),
  );
  if (!item) return null;
  const persisted = update({
    ...state,
    sent: [item, ...state.sent.filter((i) => now < i.createdAt + ARCHIVE_TTL)],
  });
  return { item, persisted };
}
export function removeInstant(id) {
  update({ ...state, sent: state.sent.filter((item) => item.id !== id) });
}
export function reactToInstant(id, emoji) {
  update({ ...state, reactions: { ...state.reactions, [id]: emoji } });
}
export function replyToInstant(id, text) {
  if (!text.trim()) return;
  update({
    ...state,
    replies: [
      ...state.replies,
      { id, text: text.trim(), createdAt: Date.now() },
    ],
  });
}
export function snoozeInstants(snooze) {
  update({ ...state, snoozedUntil: snooze ? Date.now() + INSTANT_TTL : 0 });
}
export function publishRecap(ids) {
  const now = Date.now();
  const items = state.sent.filter(
    (item) => ids.includes(item.id) && now < item.createdAt + ARCHIVE_TTL,
  );
  if (!items.length) return false;
  const recap = {
    id: `recap-${crypto.randomUUID()}`,
    createdAt: now,
    user: {
      name: "Your recap",
      role: "Student",
      avatar: null,
      verified: false,
    },
    seen: false,
    items: items.map((item) => ({
      id: `story-${item.id}`,
      type: "image",
      url: item.photo,
      duration: 5000,
      reactions: 0,
    })),
  };
  update({
    ...state,
    recaps: [
      recap,
      ...state.recaps.filter((item) => now < item.createdAt + INSTANT_TTL),
    ],
  });
  return true;
}
export function useInstantClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return now;
}
export function useMomentRecaps() {
  // Subscribe to recaps alone: reactions must not rebuild the mobile home tree.
  const recaps = useSyncExternalStore(subscribe, getRecaps, getRecaps);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const nextExpiry = Math.min(
      ...recaps
        .map((item) => item.createdAt + INSTANT_TTL)
        .filter((expiry) => expiry > now),
    );
    if (!Number.isFinite(nextExpiry)) return;
    const timer = setTimeout(
      () => setNow(Date.now()),
      Math.max(1, nextExpiry - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [recaps, now]);
  return useMemo(
    () => recaps.filter((item) => now < item.createdAt + INSTANT_TTL),
    [recaps, now],
  );
}
const getRecaps = () => state.recaps;

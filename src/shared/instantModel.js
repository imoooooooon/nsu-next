import { normalizePresentation } from "./momentFrames.js";
export const INSTANT_TTL = 24 * 60 * 60 * 1000;
export const ARCHIVE_TTL = INSTANT_TTL;
export const INSTANT_DEMO_REVISION = 2;

export function isMomentLive(item, now) {
  return item.createdAt <= now && now < item.createdAt + INSTANT_TTL;
}

export function momentDeck(items, activeId, now) {
  const visible = items.filter((item) => isMomentLive(item, now));
  const originalIndex = items.findIndex((item) => item.id === activeId);
  const next = items.slice(Math.max(0, originalIndex)).find((item) => isMomentLive(item, now));
  return { visible, index: next ? visible.findIndex((item) => item.id === next.id) : visible.length - 1 };
}

// Also discard expired media from session storage, not just from the rendered feed.
export function expireInstants(state, now) {
  const expired = (item) => now >= item.createdAt + INSTANT_TTL;
  if (![...state.received, ...state.sent, ...state.recaps].some(expired)) return state;
  const received = state.received.filter((item) => !expired(item));
  const sent = state.sent.filter((item) => !expired(item));
  const liveIds = new Set([...received, ...sent].map((item) => item.id));
  return {
    ...state, received, sent,
    recaps: state.recaps.filter((item) => !expired(item)),
    opened: Object.fromEntries(Object.entries(state.opened).filter(([id]) => liveIds.has(id))),
    reactions: Object.fromEntries(Object.entries(state.reactions).filter(([id]) => liveIds.has(id))),
    replies: state.replies.filter((reply) => liveIds.has(reply.id)),
  };
}

export function availableInstants(state, now) {
  return state.received.filter(
    (item) =>
      !state.opened[item.id] &&
      isMomentLive(item, now),
  );
}

export function archivedInstants(state, now) {
  return state.sent.filter((item) => isMomentLive(item, now));
}

export function consumeInstant(state, id, now) {
  if (!availableInstants(state, now).some((item) => item.id === id))
    return state;
  return { ...state, opened: { ...state.opened, [id]: now } };
}

export function createInstant(
  photo,
  caption,
  audience,
  now,
  id,
  presentation = {},
) {
  if (
    !photo?.startsWith("data:image/jpeg") ||
    !["mutuals", "close-friends"].includes(audience)
  )
    return null;
  return {
    id,
    photo,
    caption: caption.trim().slice(0, 100),
    audience,
    createdAt: now,
    name: "You",
    authorId: "self",
    ...normalizePresentation(presentation.frame, presentation.captionPosition),
  };
}

export function initialInstantState(now) {
  const photos = [
    [
      "maliha",
      "Maliha",
      "Library break ☕",
      "photo-1495474472287-4d71bcdd2085",
      4,
    ],
    [
      "tahmid",
      "Tahmid",
      "Found our spot for the afternoon",
      "photo-1522202176988-66273c2fd55f",
      18,
    ],
    [
      "sadia",
      "Sadia",
      "A little green between classes 🌿",
      "photo-1441974231531-c6227db76b6e",
      42,
    ],
    ["rayan", "Rayan", "Wrong class", "photo-1455390582262-044cdead277a", 48],
    [
      "nabila",
      "Nabila",
      "One more chapter",
      "photo-1507842217343-583bb7270b66",
      53,
    ],
    [
      "fahim",
      "Fahim",
      "Building something",
      "photo-1498050108023-c5249f4df085",
      61,
    ],
    ["ayman", "Ayman", "Good company", "photo-1522071820081-009f0129c71c", 76],
    [
      "maliha-afternoon",
      "Maliha",
      "Coffee number two",
      "photo-1509042239860-f550ce710b93",
      89,
    ],
    [
      "tahmid-campus",
      "Tahmid",
      "Campus days",
      "photo-1523240795612-9a054b0db644",
      102,
    ],
  ];
  return {
    version: 1,
    demoRevision: INSTANT_DEMO_REVISION,
    received: photos.map(([id, name, caption, photo, minutes], index) => ({
      id,
      name,
      caption,
      photo: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=85`,
      createdAt: now - minutes * 60000,
      authorId: {
        Maliha: "user-1",
        Tahmid: "user-3",
        Sadia: "user-6",
        Rayan: "user-7",
        Nabila: "user-8",
        Fahim: "user-5",
        Ayman: "user-4",
      }[name],
      frame: ["squircle", "hexagon", "organic", "triangle"][index % 4],
      captionPosition: 81,
    })),
    opened: {},
    sent: [],
    replies: [],
    reactions: {},
    recaps: [],
    snoozedUntil: 0,
  };
}

export function momentsForAuthor(state, now, authorId) {
  return availableInstants(state, now).filter(
    (item) => !authorId || item.authorId === authorId,
  );
}

// Add new demo photos once, without resetting captures or existing view receipts.
export function refreshInstantDemo(state, now) {
  if (state.demoRevision === INSTANT_DEMO_REVISION) return state;
  const incoming = initialInstantState(now).received.filter(
    (item) => !state.received.some((existing) => existing.id === item.id),
  );
  return {
    ...state,
    demoRevision: INSTANT_DEMO_REVISION,
    received: [...state.received, ...incoming],
  };
}

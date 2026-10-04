export const INSTANT_TTL = 24 * 60 * 60 * 1000;
export const ARCHIVE_TTL = 365 * INSTANT_TTL;

export function availableInstants(state, now) {
  return state.received.filter(
    (item) =>
      !state.opened[item.id] &&
      item.createdAt <= now &&
      now < item.createdAt + INSTANT_TTL,
  );
}

export function archivedInstants(state, now) {
  return state.sent.filter((item) => now < item.createdAt + ARCHIVE_TTL);
}

export function consumeInstant(state, id, now) {
  if (!availableInstants(state, now).some((item) => item.id === id))
    return state;
  return { ...state, opened: { ...state.opened, [id]: now } };
}

export function createInstant(photo, caption, audience, now, id) {
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
  ];
  return {
    version: 1,
    received: photos.map(([id, name, caption, photo, minutes]) => ({
      id,
      name,
      caption,
      photo: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=85`,
      createdAt: now - minutes * 60000,
    })),
    opened: {},
    sent: [],
    replies: [],
    reactions: {},
    recaps: [],
    snoozedUntil: 0,
  };
}

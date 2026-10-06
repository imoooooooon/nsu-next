import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCHIVE_TTL,
  INSTANT_TTL,
  archivedInstants,
  availableInstants,
  consumeInstant,
  createInstant,
  initialInstantState,
  refreshInstantDemo,
  momentsForAuthor,
  expireInstants,
  momentDeck,
} from "../src/shared/instantModel.js";
import {
  MOMENT_FRAMES,
  STORIES_ENABLED,
  normalizePresentation,
} from "../src/shared/momentFrames.js";
import { momentPeople } from "../src/shared/momentPeople.js";

const now = 1_800_000_000_000;
test("profile entry selects only that author’s unexpired, unopened moments", () => {
  const state = initialInstantState(now);
  assert.deepEqual(
    momentsForAuthor(state, now, "user-1").map((item) => item.id),
    ["maliha", "maliha-afternoon"],
  );
  const opened = consumeInstant(state, "maliha", now);
  assert.deepEqual(
    momentsForAuthor(opened, now, "user-1").map((item) => item.id),
    ["maliha-afternoon"],
  );
  assert.equal(momentsForAuthor(state, now + INSTANT_TTL, "user-1").length, 0);
  assert.equal(momentsForAuthor(state, now, "unknown").length, 0);
});
test("capture persists the chosen frame and caption position, with safe defaults", () => {
  for (const frame of MOMENT_FRAMES) {
    const item = createInstant(
      "data:image/jpeg;base64,dGVzdA==",
      "Caption",
      "mutuals",
      now,
      "new",
      { frame: frame.id, captionPosition: 99 },
    );
    assert.equal(item.frame, frame.id);
    assert.equal(item.captionPosition, 99);
  }
  assert.deepEqual(normalizePresentation("invalid", NaN), {
    frame: "squircle",
    captionPosition: 81,
  });
  assert.equal(normalizePresentation("hexagon", 200).captionPosition, 100);
});
test("Stories are disabled and active rail metadata contains no Story media", () => {
  assert.equal(STORIES_ENABLED, false);
  assert.ok(
    momentPeople.every((person) =>
      person.items.every((item) => item.type === "note" && !item.url),
    ),
  );
});
test("an instant is consumed once, independently of other photos", () => {
  const state = initialInstantState(now);
  const opened = consumeInstant(state, "maliha", now);
  assert.equal(availableInstants(opened, now).length, 8);
  assert.equal(consumeInstant(opened, "maliha", now + 1), opened);
  assert.equal(availableInstants(state, now).length, 9);
});
test("unopened instants expire exactly at 24 hours and cannot be consumed", () => {
  const state = initialInstantState(now);
  const expires = state.received[0].createdAt + INSTANT_TTL;
  assert.ok(
    availableInstants(state, expires - 1).some((item) => item.id === "maliha"),
  );
  assert.ok(
    !availableInstants(state, expires).some((item) => item.id === "maliha"),
  );
  assert.equal(consumeInstant(state, "maliha", expires), state);
});
test("future dated and unknown instants cannot be opened", () => {
  const state = initialInstantState(now);
  assert.deepEqual(availableInstants(state, now - INSTANT_TTL), []);
  assert.equal(consumeInstant(state, "unknown", now), state);
});
test("one-view receipts survive serialization and reload", () => {
  const consumed = consumeInstant(initialInstantState(now), "maliha", now);
  const restored = JSON.parse(JSON.stringify(consumed));
  assert.equal(availableInstants(restored, now + 1000).length, 8);
});
test("capture accepts only camera JPEG data and the two allowed audiences", () => {
  const photo = "data:image/jpeg;base64,dGVzdA==";
  const item = createInstant(
    photo,
    "  after class  ",
    "close-friends",
    now,
    "new",
  );
  assert.equal(item.caption, "after class");
  assert.equal(item.audience, "close-friends");
  assert.equal(createInstant(photo, "", "public", now, "new"), null);
  assert.equal(
    createInstant("https://example.com/photo.jpg", "", "mutuals", now, "new"),
    null,
  );
  assert.equal(
    createInstant(photo, "x".repeat(200), "mutuals", now, "new").caption.length,
    100,
  );
});
test("sender captures disappear at the same 24-hour boundary as received Moments", () => {
  const state = {
    ...initialInstantState(now),
    sent: [{ id: "mine", createdAt: now }],
  };
  assert.equal(ARCHIVE_TTL, INSTANT_TTL);
  assert.equal(archivedInstants(state, now - 1).length, 0);
  assert.equal(archivedInstants(state, now + ARCHIVE_TTL - 1).length, 1);
  assert.equal(archivedInstants(state, now + ARCHIVE_TTL).length, 0);
});

test("expiry removes media and its replies/reactions without changing live captures", () => {
  const state = initialInstantState(now);
  const expires = state.received[0].createdAt + INSTANT_TTL;
  state.sent = [{ id: "fresh", createdAt: expires - 1000 }, { id: "old", createdAt: now - INSTANT_TTL }];
  state.opened = { maliha: now };
  state.reactions = { maliha: "❤️" };
  state.replies = [{ id: "maliha", text: "Hello" }];
  const expired = expireInstants(state, expires);
  assert.deepEqual(expired.received, []);
  assert.deepEqual(expired.sent.map((item) => item.id), ["fresh"]);
  assert.deepEqual(expired.opened, {});
  assert.deepEqual(expired.reactions, {});
  assert.deepEqual(expired.replies, []);
  assert.equal(expireInstants(expired, expires + 1), expired);
});

test("deck expiry preserves the active ID and advances only when that photo expires", () => {
  const items = [
    { id: "earlier", createdAt: now - INSTANT_TTL + 10 },
    { id: "active", createdAt: now - INSTANT_TTL + 20 },
    { id: "next", createdAt: now },
  ];
  let deck = momentDeck(items, "active", now + 10);
  assert.equal(deck.visible[deck.index].id, "active");
  assert.equal(deck.index, 0);
  deck = momentDeck(items, "active", now + 20);
  assert.equal(deck.visible[deck.index].id, "next");
  assert.equal(momentDeck(items, "next", now + INSTANT_TTL).index, -1);
});

test("demo expansion preserves captures and receipts and runs only once", () => {
  const current = initialInstantState(now);
  const old = {
    ...current,
    demoRevision: undefined,
    received: current.received.slice(0, 3),
    opened: { maliha: now },
    sent: [{ id: "mine" }],
  };
  const migrated = refreshInstantDemo(old, now);
  assert.equal(migrated.received.length, 9);
  assert.deepEqual(migrated.opened, old.opened);
  assert.deepEqual(migrated.sent, old.sent);
  assert.equal(refreshInstantDemo(migrated, now + INSTANT_TTL), migrated);
});

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
} from "../src/shared/instantModel.js";

const now = 1_800_000_000_000;
test("an instant is consumed once, independently of other photos", () => {
  const state = initialInstantState(now);
  const opened = consumeInstant(state, "maliha", now);
  assert.equal(availableInstants(opened, now).length, 2);
  assert.equal(consumeInstant(opened, "maliha", now + 1), opened);
  assert.equal(availableInstants(state, now).length, 3);
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
  assert.equal(availableInstants(restored, now + 1000).length, 2);
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
test("the sender archive outlives recipient expiry but stops at one year", () => {
  const state = {
    ...initialInstantState(now),
    sent: [{ id: "mine", createdAt: now }],
  };
  assert.equal(archivedInstants(state, now + INSTANT_TTL).length, 1);
  assert.equal(archivedInstants(state, now + ARCHIVE_TTL - 1).length, 1);
  assert.equal(archivedInstants(state, now + ARCHIVE_TTL).length, 0);
});

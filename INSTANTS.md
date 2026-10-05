# Ugrads Moments

The mobile prototype and web app share `src/shared/MomentsRail.jsx`,
`InstantExperience.jsx`, `MomentsFeed.jsx`, `MomentMedia.jsx`, `momentFrames.js`,
`instantModel.js`, `instantStore.js`, and `instants.css`. Internal Instant names and
the existing session storage key are retained for compatibility; all active UI
calls the photo feature **Moments**.

## Product behaviour

- Creation offers **Notes / Moments**. Stories are inactive for this release.
  The original mobile Story viewer/composer, web `StoryViewerPage.jsx`, original
  Story data and recap helpers remain available for a future phase. Story creation,
  recap publishing and Story viewing have no active entry points.
- The top row keeps the Moments stack. Profile photos and names open only that
  person's unread Moments; note bubbles open their existing Notes viewer.
  Existing author viewer URLs also resolve to that author's Moments.
- The viewer header reads **Moments**, with Close, Info, Archive and Camera icons.
  It keeps author, timestamp and Reply. The view-once badge, lightning timestamp,
  instruction text and send-back CTA have been removed.
- Native horizontal scroll snapping supports touch/trackpad swiping, desktop
  dragging, left/right arrow keys and selectable pagination dots. There is no
  separate Next button. Both directions remain available within the open session.
- A successfully loaded, active photo is marked viewed. A snapshot preserves the
  open session for backward paging; closing or hiding the document ends that
  session. Viewed photos are excluded when reopening. Failed loads do not consume
  photos; unopened photos expire after 24 hours.
- Reactions live in a vertical strip on the right, with a plus button for more.
  Reactions animate over the photo; replies are recorded in session state.
- Capture uses `getUserMedia` without microphone, gallery upload or filters.
  After capture, users choose a soft square, soft hexagon, soft triangle or organic
  circle. Captions remain uppercase and follow the selected frame's curved edge.
  The top-left default, edge presets and a continuous position slider let users
  place a caption anywhere around the perimeter. Frame and position are saved and
  can also be adjusted in the private archive.
- Camera switching, retaking, mutual/close-friends audiences, ten-second Undo,
  private archive retention and delete/unsend remain. Camera tracks stop on capture,
  dismissal, navigation, switching and document hiding; late permission results
  are discarded. Snooze is an explicit 24-hour toggle.

## Design and accessibility

The viewer uses an immersive black canvas in both themes, Ugrads blue state
accents and Plus Jakarta Sans. The row and creation chooser use the app's normal
theme tokens. Shared SVG geometry drives frame masks, thumbnails and caption
paths. Native scrolling replaces the layered reveal animation; modal/camera and
reaction motion use the existing spring token. Reduced-motion preferences suppress
movement. No additional animation runtime is required.

The native modal traps focus, supports Escape and returns focus to its trigger.
Controls have accessible names, focus indicators and selection states. Pagination
announces the current position. Inactive photos are hidden from assistive technology.
The layout supports narrow phones and a centred desktop viewing stage.

## Prototype boundary

This repository has no authenticated media backend or social graph. The demo has
nine received Moments across seven authors. Captures, audiences, replies, reactions,
receipts and presentation choices live in `sessionStorage`, with an in-memory
fallback. Sharing does not transmit photos or replies to real recipients. Storage
is per tab/origin and subject to browser quotas; the archive is not durable cloud
storage. Existing receipts and captures survive the presentation metadata migration.

Production needs authenticated media storage, server-side recipient eligibility,
expiry/deletion enforcement, durable archives, and messaging/moderation integration.
Browser screen capture cannot reliably be prevented; the Info panel states this.

## Validation

`npm test` covers lifecycle and expiry boundaries, receipts, captures, audience,
archive retention, author filtering, frame/position validation and the inactive
Stories release state. Build sequentially with `npm run build` followed by
`npm run build --prefix webapp`.

Browser QA covers author filtering, Notes routing, creation choices, forward/back
paging, reactions/replies, responsive layout and synthetic camera capture through
frame selection, caption positioning and archive editing. Synthetic camera frames
avoid accessing a real webcam during QA.

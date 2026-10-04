# Ugrads Moments: Instants

The mobile prototype and web app share `src/shared/InstantExperience.jsx`,
`instantModel.js`, `instantStore.js`, and `instants.css`.

## Product behaviour

- Create Moment offers **Notes / Story / Instant**. Notes and Story retain their
  existing composers and viewers.
- Received Instants have one entry point: the photo stack in the top Moments
  row. There is no feed card, sidebar entry, or public Instant URL.
- The create flow opens the camera and private archive only; it does not expose
  the received inbox. The inbox offers camera, archive and explicit snooze controls.
- Opening a photo consumes it only after the image loads. Closing, leaving the
  document, or advancing ends that view. Failed loads can be retried or skipped
  without consuming the photo. Unopened photos expire after 24 hours.
- Emoji reactions animate over the photo. Replies are recorded in session state.
- Capture uses `getUserMedia` with no microphone, gallery upload, filters, or image
  editing. Users may add a caption, switch cameras, retake, choose mutual followers
  or close friends, and share. Camera tracks stop on capture, dismissal, navigation,
  switching cameras and when the document is hidden. Late permission results are
  discarded after leaving the camera.
- A shared photo has a ten-second Undo action. The private archive retains sender
  photos for up to one year; deleting also represents unsending to unopened recipients.
- Selected archive photos can be published as a new Story recap, using the existing
  Story player. This does not put received Instants into Stories.
- Snooze is an explicit 24-hour toggle. The sidebar drag interaction is omitted.

## Design and accessibility

The official visual reference is Meta's [Instants announcement](https://about.fb.com/news/2026/05/instants-share-in-the-moment/),
including its camera, stacked photo viewer, reaction cluster, and archive images.
The originally supplied Instagram URL returned HTTP 429 during research.

Instants use an immersive black camera/viewer canvas in both themes, Ugrads blue
for state accents, Plus Jakarta Sans, squircle photo masks, and the existing
`--ease-spring-soft` motion token. The normal Moments row and creation chooser
continue to use the app's theme tokens. CSS transform/opacity animations implement
stack reveal, tap-photo advancement, departure, camera flash, modal entry/exit and emoji bursts without
adding another animation runtime. Reduced-motion preferences suppress movement.

A native modal dialog traps focus, supports Escape and returns focus to its trigger.
Controls have accessible names, keyboard focus indicators and disabled states.
Layouts support narrow phones, short viewports and a centred desktop stage.

## Prototype boundary

This repository has no authenticated media backend or social graph. The demo has
nine received Instants; captures, audience choices, replies, reactions, receipts,
and recaps are stored locally in `sessionStorage`, with an in-memory fallback.
Sharing does not transmit photos or messages to real recipients. Session storage
is per tab/origin and has browser quota limits; captured photos are not durable
year-long cloud storage. Storage failure after capture is reported in the UI.

Production needs authenticated media storage, server-side recipient eligibility,
atomic per-recipient consumption, expiry/deletion enforcement, durable private
archives, and integration with messaging and moderation. Client-side state is a
prototype of those behaviours, not an authorization or privacy boundary.

Web browsers cannot reliably prevent OS screenshots or screen recording. The
feature's information panel says so; no screenshot-protection promise is made.

## Validation

`npm test` includes lifecycle, expiry boundary, receipt reload, capture validation,
audience and archive retention tests. Build both apps sequentially with
`npm run build` then `npm run build --prefix webapp`.

Browser QA covers both Moments entry points, preserved Notes/Story composers,
view-once reload, reactions/replies, reduced-width layout, synthetic camera capture,
switching and track disposal, permission errors, audience selection, undo, archive
and recap handoff. Synthetic camera frames avoid accessing a real webcam during QA.

Photo silhouettes use a shared SVG mask with continuous curved edges. Captions follow an SVG text path around the upper-left edge. Tap the photo (or press Enter/Space while focused) to advance directly; no separate Next button is shown. New demo samples are added once to existing sessions without resetting receipts or captures.

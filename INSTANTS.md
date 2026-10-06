# Ugrads Moments

The mobile prototype and web app share `src/shared/MomentsRail.jsx`,
`InstantExperience.jsx`, `MomentsFeed.jsx`, `MomentMedia.jsx`, `momentFrames.js`,
`instantModel.js`, `instantStore.js`, and `instants.css`. Internal Instant names and
the session storage key remain for compatibility; active UI calls the feature
**Moments**.

## Current revision — 6 October 2026

Implemented from `Ugrads Moments Section Revisions.md`. This supersedes the earlier
horizontal swipe carousel, vertical reaction strip, freeform caption-position
controls and one-year sender archive described in the previous PDF revision.

## Product behaviour

- Creation offers **Notes / Moments**. Stories remain inactive; their earlier
  design and code are retained for a future release.
- The top-row stack shows only unseen Moments and becomes empty once all are seen.
  Avatars/names and author URLs open all of that person's unexpired photos,
  including viewed ones. Profile replay does not add photos back to the stack.
  Blue avatar rings indicate unseen photos; muted dashed rings indicate available
  photos that have all been seen. Note bubbles open the separate Notes viewer.
- The viewer is a bounded, non-scrolling screen using the dynamic viewport height.
  The header retains Moments, Close, Info, Archive and Camera. Media shrinks to fit
  the available space while the reaction and reply controls stay visible.
  In the mobile prototype it shares the home's 430px maximum canvas width and
  square screen edges, including when viewed on a desktop. Header, author metadata,
  reply text and touch targets use sizes consistent with the app.
- A horizontal depth deck puts unseen queued cards on the left, the active photo
  in the centre, and blurred, receded viewed cards on the right. Tap the active
  photo to advance. The last tap reaches the caught-up state. A Previous control
  and keyboard navigation allow revisiting within the current viewing session.
  Swipe/drag is no longer the viewer's navigation mechanism; the home row still
  scrolls normally.
- Photos are marked viewed only after successful loading while active. Failed
  photos offer Retry and Skip without consuming them. Closing/hiding the dialog
  ends the session; reopening the stack excludes viewed photos, while reopening
  a profile allows replay until the original 24-hour expiry.
- **All photo Moments expire 24 hours after posting**, including sender captures.
  Expired media is removed from the feed, an open deck, archive/detail view and
  session store, along with associated receipts, reactions and replies. The
  active card is tracked by ID so expiry of an earlier photo cannot skip it.
  Model checks use the exact expiry boundary; mounted UI refreshes every second
  and on visibility changes. Stored media is also cleaned on load and mutation.
- Quick reactions form one horizontal pill above the reply bar. The plus button
  opens another horizontal palette. Replies and reactions are recorded locally;
  changing cards clears the previous card's reply draft and expanded palette.
- Camera capture uses video-only `getUserMedia`, camera switching and retakes;
  there is no gallery upload, microphone or filter flow.
- The post-capture shape palette is compact: soft square, soft hexagon, soft
  triangle and organic circle. New captions start at the upper-left corner and
  follow the curved outline. The freeform slider and position presets are removed.
  Existing stored caption positions remain readable; new captures and archive
  frame edits use the corner default.
- Audience selection supports mutual followers or close friends. The share action
  is a floating horizontal pill with a separate retake control and ten-second Undo.
- The archive contains only the last 24 hours, with six items per page, frame
  editing and delete/unsend. Snooze remains an explicit 24-hour control.
- Camera tracks stop on capture, close/unmount, switching and document hiding.
  Late camera permission responses are discarded after leaving the experience.

## Layout and accessibility

The viewer uses an immersive black surface in both themes. Shared SVG geometry
provides frame masks, swatches and curved caption paths. The existing spring tokens
animate the card deck; reduced-motion preferences suppress animation. Offstage
cards are inert and hidden from assistive technology. The modal contains focus,
supports Escape and restores focus to its trigger. Controls have accessible names
and focus indicators; the current position is announced.

Capture and archive detail use a flexible media stage. Short landscape screens
place media beside controls. The dialog follows visual viewport changes so a
software keyboard can reduce the available height without moving the reply bar
below the viewport. Browser/device keyboard behaviour still depends on the host.

## Prototype boundary

There is no authenticated media backend or social graph. The demo seeds nine
received photos across seven authors. Captures, audiences, replies, reactions,
receipts and presentation settings live in `sessionStorage`, with an in-memory
fallback. Sharing does not transmit photos or replies to real recipients. Storage
is per tab/origin and subject to quotas; it is not durable cloud storage.

Production requires authenticated storage, recipient eligibility, server-enforced
expiry/deletion and messaging/moderation integration. Client cleanup is not a
backend privacy guarantee. Browser screen capture cannot reliably be prevented.

## Validation

`npm test` covers lifecycle and expiry boundaries, receipts, captures, audiences,
author filtering, frame/position validation, disabled Stories, expiry cleanup and
active-card identity across expiry. Build mobile first (`npm run build`), then web
(`npm run build --prefix webapp`).

Browser review should cover tap advancement and back navigation, reaction/reply
isolation, author filtering, empty/completion states, capture/frame selection,
sharing/Undo, archive edits, and no vertical overflow at phone, short-phone,
landscape and desktop sizes. Use synthetic camera media for automated capture QA.

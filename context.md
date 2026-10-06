# Ugrads — chat and codebase handoff

Prepared on **6 October 2026 (Asia/Dhaka)** for starting a new chat.
Workspace: **`D:\nsu-next`**. Shell: **PowerShell**.

This is a consolidated handoff of the conversation, implementation decisions,
repository state and verification results. It is not a verbatim transcript.
Use the current source files as the implementation authority and the latest user
request as the product authority. Earlier interrupted work is also documented in
the repository's feature and design documents linked below.

## Latest follow-up: combined portal revisions (6 October 2026)

Implemented the deduplicated requirements from `Shared File__Ugrads - Alumni
Portal Startup Stages.pdf` and `Ugrads Revisions.pdf`. See `REVISIONS.md` for the
scope and QA record. Web onboarding now has a desktop 2:1 carousel/form layout;
both public directories omit Staff; Home shows active job-seeking requests in
role-based order; and the shared department workspace has distinct metrics,
action tiles, support statuses and a team rail. Staff signup, profiles and
Department Officials remain. Moments behavior was not changed.

## Latest follow-up: Markdown Moments revisions (6 October 2026)

The subsequent `Ugrads Moments Section Revisions.md` replaces the earlier PDF's
swipe carousel with a tap-to-advance horizontal depth deck, replaces the right-side
reaction strip with a horizontal dock above Reply, makes viewing/capture fit one
viewport, and adds compact frame controls with corner captions and a floating
share pill. Photo Moments and sender captures now expire after 24 hours; the older
one-year archive no longer applies. Freeform caption positioning is removed from
the active editor. See `INSTANTS.md` and current shared source for these changes.
The sections below preserve the preceding handoff as historical context.

## 1. Where we left off

The latest implementation request was to implement **Ugrads Moments Section
Revisions.pdf**. All six groups of revisions were completed in both the mobile
prototype and the web app. The assistant reported completion after browser QA,
tests, lint checks and production builds.

The user's next request was to create this `context.md` so a new chat can continue
with the full project context. There is no unfinished feature request from this
chat waiting for implementation. The next chat should read this file and the
relevant source, then work on the user's next request rather than restarting the
completed Moments implementation.

Repository state checked while writing this handoff:

- Branch: `main`.
- Latest commit: **`0260124` — `r1`**, containing the completed Moments revisions.
- Earlier commits in the current history include `ebc3d83` (`nr5`), `ef2d4c1`
  (`nr3`) and `fd0e7d0` (`nr1`). Inspect their diffs if historical detail is needed.
- Tracked files were clean before creating this document. The previous turn's
  implementation changes are now committed; do not assume they remain uncommitted.
- `.claude/` is pre-existing, untracked user material. It was not modified by this
  work. Preserve it.
- No `AGENTS.md` was found during this work. Check again if repository instructions
  have changed in the next session.
- No commit, push, PR or deployment was performed by the assistant for the latest
  revision request. The commit above was observed afterward in repository history.

## 2. User intent and working preferences

The user initially asked the assistant to understand the full codebase before
implementing changes, and to work as a senior product designer and UI/UX architect
with extensive edtech community app/webapp experience.

The user explicitly allowed updates to the information architecture and design
system when needed, while requiring consistency with the established product.
They repeatedly asked to resume from the existing state after usage limits
interrupted earlier sessions. Preserve existing work and inspect the repository
instead of starting again or replacing completed features.

The product is **Ugrads**, a North South University verified community/network
prototype. Changes generally need to work on **both surfaces**, not only one.
The user values polished motion, intentional shape/spacing, clear interactions
and close attention to supplied visual references.

The latest revision PDF supersedes contradictory earlier Moments requirements.
In particular, do not restore Stories, the old layered photo reveal, a radial
reaction cluster or user-facing “Instants” terminology just because these appear
in earlier conversation requests or retained legacy code.

## 3. Conversation progression and reference files

### Initial feature work

The conversation began with the request to understand the codebase and implement
the supplied feature document:

- `D:/Downloads/New folder (5)/Ugrads New Feature.pdf`

The repository contains the resulting Department Hub / University Staff scope in
`DEPARTMENT_HUB_IA.md`, shared department components, permission models and tests.
Read those files for the detailed specification instead of inferring permissions
from academic roles. This work was already present before the latest Moments
revisions.

### Original Instants request

The user wanted another functionality within Ugrads Moments, inspired by
Instagram's Instants:

- Keep the then-existing Stories and Notes unchanged.
- Add a third creation option: Notes / Story / Instant.
- Received Instants should be accessed only from the top Moments row.
- Match the supplied Instagram experience, with smooth animation.
- Omit the sidebar-style drag effect.
- Framer Motion was permitted, not mandated.
- Official reference supplied by the user:
  `https://about.instagram.com/blog/announcements/introducing-instants-for-sharing-in-the-moment`

Earlier implementation notes recorded that the supplied Instagram URL returned
HTTP 429 during research and that Meta's announcement was used as another official
reference: `https://about.fb.com/news/2026/05/instants-share-in-the-moment/`.
These URLs are historical research references; this handoff does not assert they
were rechecked while creating this file.

### Shape, captions and demonstration refinements

The user subsequently requested:

- A photo container matching the supplied Instagram organic squircle silhouette.
- More demonstration photos so advancement could be tested.
- Clicking the photo should advance; remove the separate Next Instant button.
- A short, bold, white uppercase note following the curved upper-left edge.

Reference image:
`C:/Users/imooo/AppData/Local/Temp/codex-clipboard-2ac80b1d-8346-4f52-8198-667cbdddeead.jpg`

The image showed a black surround, a full rounded organic square photo, and the
words “WRONG CLASS” following its upper-left curve. The photo itself showed
handwritten notes and a pen. It was a visual reference, not an asset to upload or
publish. A temporary clipboard path may no longer exist in a later session.

### Latest revision request — authoritative current requirements

The user then supplied:
`D:/Downloads/New folder (5)/Ugrads Moments Section Revisions.pdf`

This was a one-page document, extracted and visually inspected with the PDF
skill. Its six requirement groups were:

1. **IA and scope:** Rename the feature from Instants to Moments. Temporarily
   deactivate Stories, preserving their design for a future release. Keep Notes
   and the photo Moments feed active. Clicking a person's avatar opens their
   Moments; clicking their note bubble opens their Note. Keep the separate stack
   entry in the top row.
2. **Microcopy:** Header title must be exactly “Moments”. Keep Close, Info,
   Grid/Feed and Camera utilities. Remove View once, the lightning timestamp icon,
   “Tap the photo…” instruction and “Send one back” CTA. Keep author, timestamp
   and Reply input.
3. **Frames:** Add a post-capture mask selector with branded blob geometry, such
   as a squircle, hexagon, triangle and uneven organic circle.
4. **Captions:** Keep the curved top-left default, but allow placement anywhere
   around the selected mask. Text must follow that mask's outline.
5. **Navigation:** Replace layered card reveal with horizontal paging in both
   directions, edge snapping and pagination indicators.
6. **Reactions:** Replace the radial emoji cluster with a right-aligned vertical
   floating strip, including a plus action for additional reactions.

This newer document intentionally reduces Instagram parity. Current interaction
is swipe/drag paging with dots, not tap-to-reveal a card underneath. There is still
no separate Next button.

## 4. Codebase architecture

This is a React/Vite frontend prototype, not a Next.js application despite the
repository directory name.

| Area | Location / purpose |
| --- | --- |
| Mobile prototype | Root package; `src/App.jsx` is a large single-file app with internal screen and overlay state, designed around a phone canvas. |
| Mobile entry/styles | `src/main.jsx`, `src/index.css`, `src/components/ui/`. |
| Routed web app | Separate Vite package under `webapp/`; React Router with `/webapp/` basename. |
| Web route map | `webapp/src/App.jsx`; auth, home, network, departments, jobs/seeking, events, emergency, messages, profile/settings and Moments. |
| Web layout | `webapp/src/components/layout/`: app shell, sidebar, topbar, mobile navigation, auth layout. |
| Web primitives | `webapp/src/components/ui/`: buttons, cards, modals, fields, Select, segmented controls and other reusable UI. |
| Web theme | `webapp/src/theme/ThemeContext.jsx`: theme tokens `t`, dark/light mode and sidebar state. |
| Web app state | `webapp/src/context/AppStateContext.jsx`: demo authentication and general feature state. |
| Web feature modules | `webapp/src/features/`; route pages under `webapp/src/pages/`; demo data under `webapp/src/data/`. |
| Shared features | `src/shared/`: Moments and Department/Staff UI, models and stores reused by both apps. |
| Tests | `tests/instants.test.mjs`, `tests/department-access.test.mjs`; Node's built-in test runner. |
| Build/deployment config | Root and web `vite.config.js`, root `vercel.json`. |

Dependencies include React 19, Vite 7, Tailwind CSS 4 and Lucide React. The web
package adds React Router 7. No Framer Motion dependency was added. Existing CSS
spring tokens and native browser scrolling provide the motion.

The web Vite configuration allows shared imports from the parent directory and
deduplicates React, React DOM and Lucide. Preserve that configuration to avoid
duplicate React hook dispatchers when using `src/shared/` from `webapp/`.

The documented deployment serves mobile at `/` and web at `/webapp/`. The web
README references `https://nsu-next.vercel.app/webapp`; production was not verified
or deployed as part of the latest revision task.

## 5. Design system constraints

Read **`webapp/DESIGN_SYSTEM.md`** before changing product UI. It is the detailed
design/build contract; it was updated for the current Moments experience.

- Font: Plus Jakarta Sans.
- Brand blue: `#1D9BF0`.
- Normal app surfaces use light/dark theme tokens, restrained glass, rounded
  cards, capsule navigation and subtle borders/shadows.
- Theme token keys shared between surfaces include `bg`, `card`, `surface`,
  `border`, `borderSoft`, `text`, `textMuted`, `glass`, `overlayGlass`, `inputBg`,
  `inputBorder` and `cardShadow`.
- Moments media viewing/capture is intentionally an immersive black surface in
  both themes. The top row and creation chooser retain normal app theme tokens.
- Reuse the existing `--ease-spring-soft` and `--ease-spring-bouncy` motion system.
  Respect `prefers-reduced-motion`.
- Keep existing reusable controls and accessibility behavior. The app has its own
  Select primitive and travelling-pill selection controls; consult the design
  contract rather than introducing unrelated control styles.
- Do not broadly reformat the large `src/App.jsx` when making a small change.

## 6. Current Moments implementation: file map

| File | Responsibility |
| --- | --- |
| `src/shared/InstantExperience.jsx` | Two-option creation picker, stacked top-row entry, native modal shell, Info, camera capture and private archive. Internal Instant component names remain for compatibility. |
| `src/shared/MomentsRail.jsx` | Shared top row. Author-specific avatar/name entry, independent note bubbles, create button and stacked Moments entry. Supports native scrolling and mouse dragging without accidental click-through. |
| `src/shared/MomentsFeed.jsx` | Horizontal snap carousel, per-slide loading/retry, active-photo receipts, keyboard/mouse navigation, dots, author metadata, right reaction strip, extra reactions, Reply and empty/snoozed states. |
| `src/shared/MomentMedia.jsx` | `MomentCaption` and `MomentFrameEditor`; SVG text path, four frame choices, caption-position slider and edge presets. |
| `src/shared/momentFrames.js` | Four shared SVG outline paths, mask styles, presentation normalization, `STORIES_ENABLED = false`. |
| `src/shared/momentPeople.js` | Active author metadata and Notes only. Excludes legacy Story media from active row data. |
| `src/shared/instantModel.js` | Pure lifecycle helpers, TTLs, demo photos, receipt consumption, capture validation, archive filtering and author filtering. |
| `src/shared/instantStore.js` | Session store, subscriptions, persistence/migration, capture, replies, reactions, snooze, archive editing and legacy recap helpers. |
| `src/shared/instants.css` | Shared masks, layouts, modal/camera motion, carousel, reaction dock, rail, frame editor and responsive/reduced-motion rules. Some old inactive CSS remains. |
| `INSTANTS.md` | Current feature behavior, architecture, prototype limits and validation notes. Filename is retained; document title and active UI are Moments. |

Integration points:

- Mobile `src/App.jsx` imports shared rail and active `momentPeople` metadata.
  It no longer mounts the legacy Story viewer or offers Story creation.
- `webapp/src/features/moments/MomentsRow.jsx` is a small shared-rail adapter.
- `webapp/src/pages/HomePage.jsx` uses active metadata without Story recaps.
- `webapp/src/pages/moments/CreateMomentPage.jsx` offers Notes / Moments.
- `webapp/src/pages/moments/MomentNotePage.jsx` uses active Notes metadata.
  Its Close button was also fixed to stop click propagation, avoiding two
  back-navigation calls.
- `webapp/src/pages/moments/MomentViewerPage.jsx` opens the requested author's
  shared Moments dialog. Existing `/moments/:momentId` author URLs still work
  within the `/webapp/` base path.
- The old web viewer was retained in `StoryViewerPage.jsx`, which is not routed.
- Mobile legacy Story data/viewer/composer code is retained but inactive.
  The legacy recap publisher is guarded by `STORIES_ENABLED`.

Do not rename every internal `Instant` identifier or the persistence key merely
to match user-facing branding; current compatibility was intentionally preserved.

## 7. Moments behavior and state details

### Reading and navigation

- Top-row stack opens all available received photos. Avatars and names open only
  the selected author's available photos. Notes have separate buttons.
- Nine demo photos are distributed across seven authors, including multiple
  photos for Maliha and Tahmid. Dr. Aminul currently has no demo photo, providing
  an author-specific empty state.
- Header always says “Moments”; X, Info, archive grid and Camera remain.
- Horizontal carousel uses native `scroll-snap`, adjacent-image preloading,
  mouse drag, left/right arrow keys and clickable pagination dots.
- A photo is marked viewed only once its image loads and it is the active slide.
  Failed images have Retry and are not consumed.
- The dialog holds a snapshot of the available items so backward paging works
  during the same open viewing session, even after receipts are recorded.
- Closing or hiding the document ends that session. Reopening excludes viewed
  photos. This is the deliberate reconciliation of the earlier one-view model
  with the new backward-paging requirement.
- Unopened photos expire after 24 hours. Right-side quick reactions are
  😂, ❤️, 🌸 and 👏, with more behind +. Replies and reactions are saved locally.
- Modal uses native `dialog`, focus containment, Escape and focus restoration.

### Capture and presentation

- Camera uses `getUserMedia`, video only, no microphone.
- No gallery upload or filters. Users can switch cameras, retake, add a caption,
  choose mutual followers / close friends and share.
- Frame choices: `squircle` (Soft square), `hexagon` (Soft hexagon), `triangle`
  (Soft triangle), `organic` (Organic circle).
- One SVG geometry source drives masks, frame swatches and caption paths.
- Caption is uppercase white text following an inset frame outline. Text path
  repeats the outline to support wrapping across the perimeter's start point.
- Position is a normalized value from 0 to 100; default is 81 (top-left preset).
  Presets and a slider let the user position it around the whole outline.
- Capture records contain `frame` and `captionPosition`; archive editing can
  update both. Invalid values fall back safely or are clamped.
- Camera tracks stop on capture, close/unmount, camera switching and document
  hiding. Late async camera permission results are discarded after leaving.
- Share has a ten-second Undo. Sender archive lifetime is modeled as one year;
  delete/unsend and 24-hour snooze controls remain.

### Persistence and prototype boundary

- Storage key remains **`ugrads-instants-v1`** in `sessionStorage`.
- Store includes received and sent photos, opened receipts, reactions, replies,
  snooze state and retained legacy recaps.
- Existing saved demos are enriched with author IDs and frame/caption defaults
  without resetting opened receipts or captured photos.
- Demo revision is currently 2. Old sessions may show fewer photos because their
  receipts persist; an empty feed is not necessarily a rendering bug.
- There is no authenticated media backend, real social graph, recipient delivery,
  durable archive, messaging service or server-side expiry enforcement here.
- Captures and replies stay in the current browser session. Audiences and
  delete/unsend are prototype behavior, not backend privacy guarantees.
- Storage is per tab/origin and quota-limited, with in-memory fallback. Mobile
  and web served on different local ports also have separate storage origins.
- Browser screenshots/recording cannot reliably be blocked. The Info panel says
  so; do not promise screenshot protection.

## 8. Existing Department / Staff feature context

This is adjacent completed functionality that should not regress while editing
Moments. Read `DEPARTMENT_HUB_IA.md`, `src/shared/DepartmentExperience.jsx`,
`departmentModel.js` and `departmentStore.js` for implementation details.

- University Staff / Official is an additional identity/signup/directory path.
- Department hubs include public information, broadcasts, Help Desk and an
  assigned-team management workspace.
- Academic identity and department permissions are separate. Faculty/staff status
  alone does not grant management access.
- Permissions are resolved from identity, ownership and explicit assignments:
  Super Admin/owner, Primary Admin, Broadcast/Event Publisher, Help Desk Operator.
- Ownership requests do not automatically grant access. Ownership transfer leaves
  one owner and demotes the previous owner to Primary Admin.
- Per-action capabilities govern broadcasting, events, Help Desk, metadata,
  delegation and ownership transfer.
- This is also a local prototype: verification/email, permissions and publishing
  are simulated. Production needs backend identity, authorization and audit.
- The Prototype control can switch review identities, open Home/Department,
  change the demo theme and reset demo changes. Reset is explicit; do not reset
  the user's state as a routine testing shortcut.

## 9. Commands and build order

Run from `D:\nsu-next` unless otherwise stated:

```powershell
# Mobile prototype
npm run dev -- --host 127.0.0.1 --port 5173

# Web app, separate terminal
npm run dev --prefix webapp -- --host 127.0.0.1 --port 5174

# All model tests
npm test

# Web lint
npm run lint --prefix webapp

# Production builds — this order is important
npm run build
npm run build --prefix webapp
```

Local URLs for those explicit ports are `http://127.0.0.1:5173/` and
`http://127.0.0.1:5174/webapp/`. Recheck running processes/ports before starting;
do not assume a dev server from the previous chat still exists.

Root build writes `dist/` and can clear it. Web build writes `dist/webapp/`.
Always build root first, then web. Run heavyweight checks sequentially; earlier
work encountered memory pressure when too many lint/build processes overlapped.

Targeted lint for the shared Moments implementation:

```powershell
node node_modules/eslint/bin/eslint.js src/shared/InstantExperience.jsx src/shared/MomentsFeed.jsx src/shared/MomentsRail.jsx src/shared/MomentMedia.jsx src/shared/momentFrames.js src/shared/momentPeople.js src/shared/instantModel.js src/shared/instantStore.js tests/instants.test.mjs
```

Cached Prettier was used for shared files via
`npm exec --offline --yes --package=prettier -- prettier --write <files>`.
It required access to the npm cache in this environment. Do not install an
unnecessary new formatter or reformat unrelated source.

## 10. Verification already completed

These results are from the completed implementation turn, not a new test run
performed while writing this handoff:

- **22 tests passed** across department permissions and Moments models.
- Shared Moments component/model lint passed.
- Full web package lint passed.
- Mobile and web production builds both passed.
- `git diff --check` passed before the revisions were committed.
- Root `src/App.jsx` lint still reports its pre-existing **15 errors and 1 warning**
  (unused variables, purity/hooks and other legacy issues). This baseline was not
  expanded by the revisions. Do not claim the full root lint suite is clean.
- Builds report large bundle warnings; root also reports stale Browserslist data.
  These were warnings, not build failures, and were not unrelated cleanup targets.

Browser QA exercised:

- Author-filtered photo lists, empty author state and global stack entry.
- Separate Notes routing and the two-option creation picker.
- Forward/backward paging, keyboard navigation and mouse drag with snapping.
- Top-row dragging without opening a profile accidentally.
- Caption geometry for square, hexagon and triangle photos; all four selector
  options, position presets and slider behavior.
- Reactions, expanded reaction palette and Reply feedback.
- Synthetic camera capture, chosen frame and caption position in the archive,
  archive presentation edits and persistence after reload.
- Mobile prototype at **390 × 844** and centered desktop viewer.
- No captured browser console errors in the main app checks.

Camera testing used a temporary HTML harness with a canvas-generated video stream,
not the user's real webcam. The harness and rendered PDF inspection image were
removed. Temporary browser tabs were closed and viewport overrides reset.

If testing again, use the browser automation capabilities actually available in
the new session. During this work, UI interactions used the Codex in-app browser
through CUA. Do not assume old tab IDs, tool variables or temporary harness files
still exist. The native modal closes when the document becomes hidden, which can
affect tests that switch tabs. Allow entry/exit animations to finish before
judging screenshots or clicking underlying page controls.

## 11. Suggested reading order for the next chat

1. This file, current `git status`, and any newly applicable repository instructions.
2. `INSTANTS.md` for current Moments product behavior and prototype boundaries.
3. `webapp/DESIGN_SYSTEM.md` for the visual and interaction contract.
4. The shared Moments file map above, then the mobile/web integration points.
5. `DEPARTMENT_HUB_IA.md` and department shared code if the next request touches
   staff, departments, permissions or shared navigation.
6. The relevant original PDF if the user asks about exact requirements.

Treat this as context, not a new request to refactor the whole project. Preserve
the completed revisions and follow the user's next instruction.

## 12. Latest onboarding / department follow-up — 6 October 2026

Onboarding now has a capped 400–460px desktop right panel with 336px-wide form
controls, visible light/dark borders and icons, vertically grouped content, and
the actual Ugrads logo at top left. The 1024×640 laptop check remains scroll-free
for alumni signup, staff signup and role selection. See `webapp/DESIGN_SYSTEM.md`.

Staff stays absent from the public directory, but department owners (`isOfficial`)
now regain the Staff tab on mobile and web. It reacts to live identity/ownership
changes; staff profiles remain linked through Department Officials. Admin identity
and Student Help Desk panels no longer have colored top strokes. Four overview
KPI cards now place icons beside the counts and are about 113px tall on desktop.

## 13. Seven PDF revisions — 7 October 2026

Implemented `Ugrads Revisions (1).pdf`; see `REVISIONS.md` for the item map.
Moments now advance right to left, with queued cards right and seen cards left.
Owner-only department Home/Admin links use live ownership and appear in the
sidebar and compact web pages. Admin opens the owned department’s manage route.
Emergency donor/request contacts display selectable phone numbers, copy and
contact-specific messaging; the user explicitly requested Bangladesh-format
sample donor numbers without prototype labels in the UI. Donor profile links
carry `?from=emergency` to preserve contact actions. `ChatView` renders emergency
handoff context without the unrelated seeded conversation.

Auth uses `HogwartsCampus.jsx` with local campus artwork, theme colours and campus
wording. The authenticated TopBar’s NSU tagline and KPI corner rings were removed.
The previously compact onboarding dimensions and owner-only Staff tab remain.

## 14. Sidebar, donor actions and welcome artwork — 7 October 2026

Desktop sidebar links retain 48px heights; an independent thin-scrollbar menu
keeps the Settings/profile footer fixed when owner navigation exceeds the height.
Emergency donor cards place Message and Request Blood in one equal-width row,
including the Request Sent state. Other contact panels keep a full-width Message.
The welcome shell now uses a detailed generated Hogwarts architectural panorama
(`webapp/src/assets/hogwarts-campus-lineart.png`) across the lower left panel,
with a soft edge fade and light/dark blend treatments. Prompt provenance lives
in `output/revisions/hogwarts-illustration-prompt.md`.

# Ugrads Admin — Phase 2 handoff

Date: **7 October 2026 · Asia/Dhaka**

## Implemented

- `/admin` Vite/React Router entry in the same repository and deployment as `/` and `/webapp`.
- Modular Geist-inspired UI with local Geist Sans/Mono fonts, existing Ugrads mark, light/dark/system themes, responsive navigation, tables, forms, typed confirmations and native dialogs.
- Overview with derived counts, actionable queues, ownership coverage and real local decision history.
- Members: search/filter/sort/pagination, profile corrections, identity/access/history tabs, reasoned suspension/reactivation and owner safeguards. Staff remains a separate identity.
- Verification: evidence summaries, missing-evidence state, approval, rejection and information requests, with reviewer/time/reason and separate member verification state.
- Departments: register, creation, metadata/contact/cover-URL editing, lifecycle, delegated access oversight, owner-only recovery and ownership claim review. Assignment closes competing claims in one transition.
- Hiring and Seeking: separate registers, details, status filters, approval/rejection/change requests and eligible closure/removal. Expired, paused, unverified and restricted-author states are guarded.
- Versioned local storage repository, capability checks at route and mutation levels, stale-revision rejection, cross-tab updates, browser write lock and audit recording. Write failure preserves the prior persisted state.
- Combined local preview script and deployment orchestration. The old nested Git repository was moved to an ignored recoverable backup so the admin is now a regular directory in the main codebase.

## Validation record

- **35 Node model tests passed:** 10 new admin tests plus 25 existing Department/Moments tests.
- **Admin lint passed. Web lint passed.** Root's historical mobile lint issues are outside this change; no claim of a clean root lint run.
- **All three production builds passed** in one combined output; admin-only builds repeated after final UI fixes. Existing mobile/web chunk-size notices and the stale Browserslist dataset notice remain.
- HTTP checks verified mobile, web, admin and deep-link HTML, including unknown admin paths, plus JS/CSS asset responses with correct content types.
- Browser review covered 1440×900 desktop, 1024×640 short desktop and 390×844 compact layouts; light/dark theme switching and persistence; contained register scrolling without page-wide horizontal overflow.
- Exercised verification approval followed by reload; department claim approval with competing pending claims reduced to zero; Hiring and Seeking approval; Staff filtering and return-to-list filter preservation; profile editing; department creation; account reactivation/suspension with exact typed confirmation; Escape dismissal and restored trigger focus.
- A Moderator direct link to a member record showed Access denied with no member details rendered.
- No browser console errors or warnings were captured during the reviewed flows. Screenshots are saved in `output/admin/phase2-overview.png`, `output/admin/phase2-short-desktop.png` and `output/admin/phase2-mobile-dark.png`.
- Resumption check confirmed `/admin` still returns HTTP 200 from the combined preview at `http://127.0.0.1:5182/admin`. Restart it with `npm run preview:all` after building if needed.

This is scoped Phase 2 QA, not a production accessibility certification or exhaustive browser/device matrix. Full cross-surface regression, 200% zoom and the remaining module workflows belong to the Phase 3 QA pass. New local QA records/decisions may be visible on the preview origin; fresh browser storage receives the original fixtures. No real messages, invitations or notifications were sent.

## Design / implementation clarifications

- Search is scoped beside each register, rather than duplicated in the header.
- The two career tabs have direct sidebar entries in this phase. They can be grouped with the expanded Phase 3 navigation later.
- Department cover editing accepts a URL. It does not imply a file storage backend. Public-hub links are shown only for departments that already exist in the community fixtures.
- Evidence summaries are explicitly synthetic; there is no fake certificate image or stored sensitive document.
- Record history surfaces audit events now. The standalone filterable Audit Log is still Phase 3.
- Phase 2 is fully local to admin. Public-side changes from approvals/restrictions are intentionally pending the Phase 3 data adapters.

## Next: Phase 3

Follow `infoArch.md` for Events, Moderation, Emergency, Campaigns, Analytics, Settings and the full Audit Log. Reuse the existing controls, capability model and transition boundary. Add new schemas/fixtures intentionally; do not overwrite existing persisted records. Version and migrate the store if its contract changes.

Complete the public/admin local integration matrix in IA Section 8.2 using stable IDs. Importing the same module into multiple app bundles does not synchronize data. Preserve Department owner rules, separate role dimensions, Staff directory visibility, inactive Stories and 24-hour Moments expiry.

Do not rerun the full Phase 1 audit. Read current git status first and preserve `context.md`, `.claude/`, imported source backups and all existing user changes. Production auth/API/media/delivery services remain a separate backend deliverable.

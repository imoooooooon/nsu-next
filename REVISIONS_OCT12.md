# Ugrads new revisions — implementation handoff

Implemented 12 October 2026 from `Ugrads New Revisions.pdf` (four pages; the document itself is labelled “Oct 17 - New Revisions”). This extends the existing mobile, web and admin prototypes in one codebase.

## Requirement coverage

| Revision | Implemented behavior |
| --- | --- |
| Two alumni verification paths | Shared signup offers Degree certificate, RDS screenshot or RFID evidence, or a selected active verified member. Document uploads accept PDF/JPG/PNG up to 5 MB. Both paths enter a locked pending account. |
| Peer accountability | Home and Notifications show requests only to the selected voucher. Approve requires explicit responsibility acknowledgment. Approval immediately verifies the applicant and saves both IDs, names at the time, timestamp, request ID, policy version and full agreement. |
| Admin investigation | Member detail prominently shows Verified By with a link, plus endorsement history on both applicant and voucher profiles. Account restrictions remain individual, reasoned admin decisions. No automatic cascade. |
| Document review | Admin verification opens the uploaded file, supports approve/reject/request information, and refuses approval when the browser no longer has the file. Rejected and information-requested applicants can resubmit. Existing admin permissions remain unchanged. |
| Control Center | Removed Applications, Profile Views and the unsupported Profile Insight card on mobile and web. Connections opens the accepted network. |
| My Connections | Directory toggle and profile shortcut show accepted relationships; pending Connect requests do not become accepted connections. Search, card/list modes and empty states work. New applicants start with zero connections. |
| Messaging | All Chats / Archived / Help Desk are the three tabs for all roles. Requests lives in the filter menu. Per-viewer archive/unarchive persists across reloads and synchronizes across the two apps on the same origin. Explicit row menus support touch and keyboard access. |
| Home ads | One shared 3:1 carousel immediately after Moments on both surfaces. Campus promotion styling, useful destinations, keyboard slide selection, pause and reduced-motion handling. Active admin campaigns govern visibility, audience and schedule; paused/expired campaigns are not resurrected. |
| Collapsible right sidebar | Desktop Home has an independent, labelled Show/Hide campus sidebar toggle. The choice persists, and the main column expands when hidden. |

## Architecture and storage

- `src/shared/verificationService.js`: pure verification transitions, selected-voucher checks, local persistence, IndexedDB file storage and tab-scoped applicant identity.
- `src/shared/AlumniVerification.jsx`: signup, pending/rejected/suspended gate and peer inbox shared by both public apps.
- `src/shared/communityPreferences.js`: accepted connection lookup, archived chat preferences and shared inbox selection.
- `src/shared/PromotionCarousel.jsx`: identical banner ratio/creative layout across mobile and web.
- Existing `ugrads-admin-data-v1` records gain optional `endorsements`, `verifiedBy`, `verificationPath` and evidence metadata without resetting prior decisions. Verification writes use the admin repository's existing lock and audit shape.
- `ugrads-alumni-applicant` is sessionStorage so a reviewer and applicant can be demonstrated in separate tabs. Returning through local login with the same applicant email resumes the saved account. Prototype role controls intentionally exit applicant mode.
- The demo Alumni identity is aligned with canonical member 1, Sarah Rahman, so a voucher's displayed identity matches the audit record.

## Verification

- 59 Node tests pass, including seven new tests for submission eligibility, consent, selected-voucher enforcement, stale decisions, retry, retained relationships, no cascading suspensions, document review and archive filtering/persistence.
- All three production builds pass. Existing bundle-size and Browserslist-age warnings remain.
- Web and admin lint pass; new shared revision modules pass focused lint. The mobile monolith has 15 pre-existing errors and one warning (compared directly with HEAD: 16 errors and one warning); this batch introduces no new mobile lint finding.
- Browser checks: web connection search, Control Center cleanup, persistent archive and restore, Requests filter, Home sidebar collapse, shared banner position, alumni signup choices, pending deep-link lock, selected-voucher notification, disabled approval until acknowledgment, live applicant unlock, and admin Verified By/history.
- Mobile checks: Home banner, simplified profile, My Connections shortcut and accepted results, revised tabs and explicit chat menu. Archive/restore and switching from Archived to the Requests filter also passed. Search/menu state now survives parent updates; this fixes the prior nested-component remount behavior.
- Screenshot proof: `output/revisions-oct12/admin-endorsement.png`. The local QA record is clearly named `QA Alumni Revision` and uses an `example.test` email.

## Production boundary

This remains the repository's local frontend prototype. No production account, password authentication, email, server upload or notification delivery is created. localStorage and IndexedDB are editable browser data, not a security boundary or permanent server audit. Files remain on the same browser/origin and are not included in JSON backups. Production requires authenticated sessions, server-enforced identity/role checks and transactions, secure document storage/access/retention, durable endorsement records and notification delivery. The signup disclosure makes this limitation explicit; do not use real identity documents for a demo.

Preview: `npm run build:all`, then `npm run preview:all`; mobile `/`, web `/webapp`, admin `/admin` on port 5182. No deployment or commit was performed.

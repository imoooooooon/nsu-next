# Ugrads Admin — Phase 3 handoff

Completed frontend implementation: 7 October 2026. This continues Phase 2 in the same repository at `/admin`; mobile `/` and web `/webapp/` retain their own visual systems. No deployment, commit or live external messages were performed.

## Delivered

- Events: register and date-derived status, create/edit, organizers versus publisher, multi-day activities, venue/capacity/deadlines, feature, cancellation/removal and registration controls. Participation distinguishes recorded registrations, Going and Interested from attendance.
- Moderation: searchable/filterable cases, evidence availability, assignment, internal notes, escalation, dismissal, removal, separate resolution and reopening. Expired Moments cannot be recovered.
- Emergency: requests, corrections, resolution/reopening/removal, donor listing restrictions independent of donor availability. A shared local blood-request form now creates usable public submissions.
- Campaigns: drafts, schedule/publish, edits, pause/resume/archive, audience/priority, safe destinations and desktop/mobile creative previews using the existing 3:1 Home placement.
- Analytics: period/department filters, defined measures, unavailable metrics and aggregate CSV with formula-prefix neutralization. Audit: actor/module/action/date/search filters and immutable-in-UI record details.
- Settings: consumed workspace identity/support fields, administrator invitation drafts, explicit local activation, roles/revocation and last-owner/self protection; read-only review policies; admin theme/density preferences.
- Geist Sans/Mono, neutral semantic tokens, shared control/dialog/register patterns, independent navigation scrolling and responsive layouts extend the Phase 2 design system.

## Data and local integration

`ugrads-admin-data-v1` now contains schema version 2. Migration preserves existing saved core records and audit; it adds the Phase 3 collections. Public submissions use `ugrads-public-submissions-v1`. Imports are idempotent and revisions protect admin decisions from stale review actions. Writes fail visibly rather than claiming success. Browser storage events refresh same-origin tabs; timers refresh time-derived availability while a page is open.

| Domain | Implemented local connection |
| --- | --- |
| Members / departments | Verification/profile/restriction read models and department ownership/assignment/metadata outcomes use canonical IDs. New department hubs have safe public defaults. Existing domain permission rules remain in force. |
| Hiring / Seeking | Public forms submit review records; approvals/restrictions govern public listings. Own Seeking review outcomes, pause/resume/renew/withdraw are translated to public states. Withdrawn posts stay hidden and renewal returns to review. Web drafts persist locally. |
| Events | Admin metadata/status changes feed public event data; department event publishing enters the local queue. Web participation is recorded locally with idempotent counts and closed/capacity guards. |
| Emergency | Request submission and admin resolution/removal feed public lists and Home emergency cards. Donor listing restrictions feed directories. |
| Campaigns | Eligible scheduled campaigns feed both Home carousels; audience and priority are applied. |
| Moderation | Restrictions hide canonical career/event/request/note records and eligible shared Moments; web message tombstones and web/mobile department broadcast filtering use stable references. No private inbox/media is copied into the admin store. |

This transport is for a same-origin frontend prototype. Different Vite dev ports do not share localStorage. It does not provide cross-device consistency or trusted permissions, and simultaneous public writes are not a transactional server queue. Use the combined preview for connected review.

## Fixtures and deliberate scope limits

- Seeded reports/evidence are synthetic review scenarios, not submitted user reports. The message and expired-Moment cases are synthetic references without a real private conversation/media target. Current public report affordances do not generate a live moderation inbox.
- Operational dates, request/donor contacts, initial counts, review histories and invitation identities include demo data. Initial events keep their actual fixture dates and may appear Past. Existing public notification history and aggregate donor counts remain demo content; no delivery, donation or attendance is inferred.
- Native dates are Dhaka dates; schedule text remains compatible with the approved public UI. Events use a register with status filters rather than a separate calendar. Detail sections replace additional tabs.
- Campaign/event/department images use hosted URLs. Preview failure has a fallback; upload storage and server MIME/size validation are not implemented. No click/impression tracking is fabricated.
- Browser-local invitation creation stays inactive until explicit demo activation. This is not email delivery or real authentication. Stories remain disabled and Moment retention remains 24 hours.
- Production needs authenticated sessions, server-enforced capabilities, transactional state changes, a durable database/audit trail, media policies, expiry jobs and notification providers. No claim of production readiness is made.

## Verification record

- `npm test`: **52 passed**, including migration preservation, core permissions/revisions/ownership, event creation/validation/cancellation, participation idempotence/capacity, evidence expiry/removal, emergency expiry, donor independence, campaign schedules, team protection, analytics/CSV and public adapter outcomes. Existing Department/Moments suites pass.
- `npm run lint:admin` and `npm run lint --prefix webapp`: passed. Historical mobile root lint issues remain outside this work; no claim of a clean full-root lint run.
- `npm run build:all`: passed for all three applications. Existing mobile/web bundle-size notices and outdated Browserslist-data notice remain. Admin output is about 421 kB before compression.
- `git diff --check`: passed (Git reports line-ending normalization warnings only).
- Browser actions: existing event venue edit persisted; synthetic campus note removal then resolution produced separate audit entries; expired evidence offered no removal/recovery; request resolution removed Apollo from the public Emergency page across tabs; campaign pause hid the public carousel item and resume restored the active state; department analytics changed values and export control was exercised; invitation remained Invited/inactive; Moderator direct Team URL showed Access denied; decisions survived reload.
- Responsive/theme QA: desktop overview, 1024×640 event register, 390×844 compact overview/navigation/events, and 720×450 reflow. Measured document widths stayed within each viewport. Dark theme persisted through reload. Screenshots: `phase3-overview.png`, `phase3-mobile-dark.png`, `phase3-mobile-events.png`, `phase3-short-desktop.png` and `phase3-reflow.png` under `output/admin/`. Audit pagination and module filtering were also exercised. No warning/error console entries appeared in the final admin browser check. These checks complement the desktop/keyboard/core-flow Phase 2 QA.
- Verification limits: the automation adapter could not populate native date inputs, so event creation was covered by the domain/adapter test rather than a claimed successful browser submission. Existing event editing was exercised. Reduced viewport checks are not a true 200% browser-zoom or assistive-technology certification. This is a scoped browser review, not an exhaustive device/browser matrix.

Local QA decisions remain visible in the preview storage: resolved Apollo request, resolved/restricted synthetic note, inactive `QA Review Analyst` invitation, campaign pause/resume history and edited AI-talk venue. No real contacts were called and no invitations or alerts were delivered.

## Run and review

From the root: `npm run build:all`, then `npm run preview:all`. Open `http://127.0.0.1:5182/admin/`. Choose a prototype review session if prompted. `npm run dev:admin` serves only the admin package. All three deployment outputs share `dist`; build mobile first, then web/admin as the combined script does.

The original admin source archive and ignored repository-metadata backup remain under `output/admin`. `context.md` and unrelated user changes were preserved. `infoArch.md` and the admin README/design contract now point to this completed frontend handoff.

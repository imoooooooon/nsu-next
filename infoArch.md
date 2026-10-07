# Ugrads Admin — Information Architecture and Delivery Plan

Prepared: **7 October 2026 · Asia/Dhaka**  
Entry point: **`/admin`**  
Status: **All three frontend implementation phases complete.** See `ADMIN_PHASE3.md` for the final implementation, integration coverage, exact QA record and production dependencies. `ADMIN_PHASE2.md` remains the historical core-workflow checkpoint.

This is the working contract for the complementary platform administration dashboard for the approved Ugrads product. It covers both product phases and replaces the legacy NSU Next admin architecture. It does not replace the existing department management workspace.

## 1. Delivery in three bounded phases

The user requested separate work phases to manage usage. Stop at each completed phase and leave a concrete handoff; do not automatically start the next phase in the same turn. These delivery phases are separate from the client's completed product Phase 1 and Phase 2.

| Delivery phase | Deliverable | Completion boundary |
| --- | --- | --- |
| **1 — Audit and IA** | Legacy capability audit, current-product coverage map, sitemap, route and workflow specifications, permissions, Geist design direction, integration plan | This document; no application changes |
| **2 — Foundation and core operations** | Integrated `/admin` application; Geist primitives and shell; access states; Overview; Members; Verification; Departments and ownership review; Hiring and Seeking review; audit recording | Core routes and decisions work with persistent local state; focused tests, builds and browser review; handoff lists precisely what remains |
| **3 — Remaining operations and final QA** | Events; Moderation including Moments/Notes and reported messages; Emergency; Campaigns; Analytics; remaining Settings; full Audit Log interface; product data bridges and regression review | All routes and workflows below are implemented; no inert controls; documented integration coverage and production boundaries |

Build reusable review/list/detail patterns in Phase 2, then reuse them in Phase 3. Do not spend Phase 2 building placeholder pages for every later module. Show only completed destinations in the working navigation until Phase 3 adds the remainder.

**Delivery basis:** The existing product and legacy admin are frontend prototypes. These phases deliver a complete interactive admin frontend with local data, realistic validation, permissions and decision history. Production authentication, APIs, document/media storage, background scheduling and real notification delivery require a backend implementation beyond these frontend phases. Client-side access controls are not production security.

## 2. Audit evidence and precedence

Reviewed source locations:

| Evidence | What it establishes |
| --- | --- |
| `context.md` | Product history, latest revisions, existing work to preserve and prototype limitations |
| `webapp/src/App.jsx` | Current routed product surface |
| `src/App.jsx`, `src/shared/`, `webapp/src/` | Mobile, shared and web architecture |
| `nsunext-admin/src/App.jsx` | Entire legacy admin: approximately 1,877 lines, inline fixtures, views, shell and detail panels |
| Root, web and legacy `package.json` / `vite.config.js`; `vercel.json` | Separate Vite packages; existing single-output deployment for `/` and `/webapp/` |
| `PHASE_2_QUOTATION_SCOPE.md` | Broad delivered product coverage; historical details must be reconciled with later revisions |
| `DEPARTMENT_HUB_IA.md`, `src/shared/departmentModel.js`, `departmentStore.js` | Department permissions, ownership claims, assignment and event publishing |
| `INSTANTS.md`, `src/shared/instantModel.js`, `instantStore.js`, `momentFrames.js` | Current Moments lifecycle and inactive Stories |
| `REVISIONS.md`, `webapp/DESIGN_SYSTEM.md` | Staff visibility, current home/department behavior and existing product design constraints |
| `webapp/src/context/AppStateContext.jsx`, `features/seeking/`, `features/events/eventForm.js`, `data/` | Current local state, canonical entities and form constraints |
| `webapp/src/features/home/AdCarousel.jsx` | Current campaign placement and 3:1 preview geometry |

Precedence: latest user direction → current source and latest revision documents → historical handoff sections → legacy admin. The quotation and older handoff contain superseded Moments behavior. Do not restore a one-year archive, active Stories, or the earlier vertical reaction strip.

This phase is a **source and interaction-handler audit**, not a claim that the old dashboard was run through browser QA. No `AGENTS.md` was found in the repository scan. Existing modifications to `context.md`, untracked `.claude/` and the user-supplied `nsunext-admin/` are preserved.

### 2.1 Legacy dashboard findings

| Legacy area | Present in source | Gap / decision |
| --- | --- | --- |
| Dashboard | Eight fixed KPIs, pending items, activity and simple charts | Replace unrelated totals with derived counts and actionable queues. “View all” currently always opens Alumni Verification. |
| Users | Search, role/status/verification filters, tables/cards, detail drawer | Suspend/reactivate controls have no mutation handlers. Staff identity is absent from fixtures; “Admin” is mixed into academic roles. Add separate account, identity and access dimensions. |
| Alumni Verification | Search/filters, certificate preview, pending/approved/rejected displays | Approve/reject controls are inert. Add reasons, missing-information state, reviewer, decision time and history. Do not require alumni evidence from staff. |
| Jobs | Hiring listings, filters, detail drawer, approval affordances | Approval/rejection is inert. No Seeking Work queue or lifecycle. Keep Hiring and Seeking separate under one Jobs section. |
| Emergency Support | Donors and requests, filters, details | Resolve/remove controls are inert. Add request lifecycle, reasoned removals, donor availability and permission-sensitive contacts. |
| Ads | Search/filters, campaign drawer, create/edit affordances | Save/create only closes the drawer; upload and lifecycle controls do not implement a publishing workflow. Preview is 21:9, whereas current Home uses 3:1. |
| Reports | Reports & Analytics screen with fixed chart data and date selection | This means analytics, not abuse reports. Rename Analytics and introduce a distinct Moderation queue. Date filtering must affect the displayed dataset. |
| Settings | Navigation item | No Settings view is rendered. Implement configuration and platform access screens. |
| Application shell | Responsive navigation, theme, detail overlays | Navigation uses `activeTab`, without route history or deep links. Most data is constant; theme is the principal persisted value. No platform session or action permission model. |
| Review infrastructure | Basic drawers and status badges | No unified case model, decision audit, conflict handling or persisted workflow. Dialog focus/keyboard behavior needs rebuilding. |

Retain the useful concepts: searchable registers, status filters, review detail panels, emergency priority and light/dark support. Rebuild their implementation as routed modules with shared primitives and explicit state transitions. Do not transplant the legacy monolith or its fabricated headline totals.

### 2.2 Coverage against the current product

| Current product capability | Required administrative companion | Legacy coverage |
| --- | --- | --- |
| Student, Alumni, Faculty and University Staff accounts | Member register, identity verification, account restrictions and history | Partial; Staff missing |
| Public profiles and directories | Reported-profile review; controlled identity/affiliation corrections | Partial |
| Department hubs and offices | Department lifecycle, metadata, affiliation and public preview | Missing |
| Ownership request / delegated team | Ownership review, single-owner resolution, access visibility and exceptional recovery | Missing |
| Broadcasts / private Help Desk | Department activity and support backlog; restricted escalation review | Missing |
| Hiring posts | Pre-publication review, decisions, expiry and removal | Visual only |
| Seeking Work | Pending review, visibility, category, availability and expiry management | Missing |
| Events / calendar / participation | Event management, organizers, registration state, schedule and featuring | Missing |
| Notes and 24-hour photo Moments | Report-based content moderation with unavailable/expired evidence states | Missing |
| Direct messages | Review submitted abuse evidence, not an unrestricted inbox | Missing |
| Blood requests / donor discovery | Request integrity, open/resolved status and donor-entry management | Visual only |
| Home promotional carousel | Campaign creative, schedule, targeting, placement and preview | Partial visual UI |
| In-app notifications / review outcomes | Decision-outcome records and delivery status where supported | Missing |
| Platform management | Admin roles, scoped capabilities, configuration and audit | Missing |

### 2.3 Product rules to preserve

- Ugrads is the product name. NSU remains valid institutional data; do not rename genuine North South University identifiers or email domains.
- Academic identity, account verification, department assignment and platform access are four separate concepts.
- Public Directory excludes Staff for ordinary users; the existing department-owner exception and Department Officials access remain. Authorized platform staff can find staff accounts in Members.
- A verified faculty member can request an **unowned** department. Submitting a claim does not grant access. Existing ownership transfers keep one owner and make the previous owner a Primary Admin.
- Department owners/Primary Admins/Publishers/Help Desk Operators keep their current action-specific permissions. Their existing `/webapp/departments/:deptId/manage` experience remains intact.
- Hiring and Seeking are distinct. Hiring submission promises admin review; Seeking submission enters Pending review. Students create Seeking posts. Department posting identities remain explicit.
- Events distinguish **Organized by** from **Posted by**. Preserve multiple organizer types, multi-day schedules, the 31-day maximum and deadline validation.
- Stories remain disabled. Notes and photo Moments remain active. Photo Moments, including sender captures, expire after 24 hours. Admin cannot create an enduring photo archive as a side effect of moderation.
- Keep emergency contact context and Bangladesh-format fixture numbers. Do not expose medical/contact details in unrelated global search or analytics exports.
- Preserve the approved mobile/web visual system. Geist is an admin-specific design contract.

## 3. Administrative operating model

The dashboard helps a small operations team answer: **What needs attention? What evidence supports a decision? What changed after I acted?**

Prioritize urgent open blood requests and high-severity abuse cases, followed by ownership/verification queues and pending career content. Show oldest waiting items within equal priority. Labels such as “Overdue” require an explicitly configured target; do not invent an SLA.

Every decision follows the same shape: queue → entity and evidence → applicable action → reason/confirmation → persisted result → updated queue/counts → audit entry. The activity log records mutations, not just decorative sample events.

### 3.1 Platform permissions (proposed admin policy)

These are new platform roles proposed for implementation, not claims about existing approved backend policy. Use capabilities internally so the UI is not coupled to role names.

| Capability | Platform Owner | Operations Admin | Moderator | Analyst |
| --- | --- | --- | --- | --- |
| Overview and aggregate analytics | Yes | Yes | Own workload | Yes |
| Member operational records / verification evidence | Yes | Yes | Minimum case-related identity; no certificates | Aggregates only |
| Verify identity / review department claims | Yes | Yes | No | No |
| Suspend/reactivate ordinary member accounts | Yes | Yes | No; escalate from a case | No |
| Departments, Hiring, Seeking, Events | Manage | Manage | Reported-content review only | Aggregates only |
| Moderation cases / reported content removal | Yes | Yes | Yes | No |
| Emergency requests and donor entries | Manage | Manage | Reported-case evidence only | Aggregates only |
| Campaigns and operational configuration | Yes | Yes | No | No |
| Invite/revoke platform admins, change platform roles | Yes | No | No | No |
| Ownership recovery overriding an existing owner | Yes; reason required | Escalate | No | No |
| Audit | Full | Operational scope | Own cases/actions | Aggregate outcomes only |

Protect the last active Platform Owner from revocation, suspension or demotion. Ordinary account suspension cannot be used to bypass this rule. Department owners do **not** automatically gain `/admin` access. A platform role does not silently make someone a department teammate.

Phase 2 implements this capability model, one seeded owner session and an explicit review/demo mechanism to exercise other roles. It does not pretend the web app's `ugrads-session` is a secure admin identity. Guard both route access and mutation functions; restricted direct URLs show Access denied.

### 3.2 Privacy and review boundaries

The proposed admin policy uses case-scoped access to private content. Moderators see only content submitted with a report and the context necessary to decide it. Help Desk overview defaults to counts, assignment and status; conversation bodies require a scoped support escalation. No global “read all private messages” tool.

Store report category, timestamps and decision metadata separately from ephemeral media. Once a Moment expires, show **Media expired** and keep only non-media case metadata; do not duplicate photo data into audit entries or local storage. Do not resolve an abuse case automatically just because the content expired.

## 4. Navigation and route architecture

Use a stable sidebar grouped by operator task, with local tabs for related registers. Counts appear only for actionable queues. The platform label is **Ugrads Admin**, with North South University shown as the current institution. No fake multi-campus switcher.

```text
Ugrads Admin
├── Overview
├── Community
│   ├── Members
│   ├── Verification
│   └── Departments
├── Content & safety
│   ├── Jobs                 [Hiring | Seeking]
│   ├── Events
│   ├── Moderation           [Open | In review | Resolved]
│   └── Emergency            [Requests | Donors]
├── Engagement
│   └── Campaigns
└── Administration
    ├── Analytics
    ├── Audit log
    └── Settings             [General | Team & access | Review policies | Preferences]
```

Breadcrumbs express location and entity, not filter state. The top bar contains breadcrumb, scoped search, theme control and admin account. Overview is the work inbox; avoid an additional duplicate “All queues” destination. A “View Ugrads” link opens `/webapp/`.

All routes below are absolute. List state uses query parameters: `q`, `status`, `role`, `department`, `category`, `assignee`, `from`, `to`, `sort`, `page` as appropriate. Back navigation restores filters and position. Detail routes can appear in a desktop split view, but must render independently on direct navigation and at narrow widths.

| Route | Screen / purpose | Phase |
| --- | --- | --- |
| `/admin` | Overview; canonical landing page | 2 |
| `/admin/login` | Admin session entry / explicit prototype access | 2 |
| `/admin/access-denied` | Permission explanation and safe return | 2 |
| `/admin/members`, `/admin/members/:memberId` | Member register and account workspace | 2 |
| `/admin/verification`, `/admin/verification/:requestId` | Verification queue and evidence review | 2 |
| `/admin/departments`, `/admin/departments/new` | Department register and creation | 2 |
| `/admin/departments/claims`, `/admin/departments/claims/:claimId` | Ownership claim queue and review | 2 |
| `/admin/departments/:deptId` | Overview, Team & access, Page settings, Activity tabs | 2 |
| `/admin/jobs` | Redirect to `/admin/jobs/hiring` | 2 |
| `/admin/jobs/hiring`, `/admin/jobs/hiring/:jobId` | Hiring queue and review | 2 |
| `/admin/jobs/seeking`, `/admin/jobs/seeking/:postId` | Seeking queue and review | 2 |
| `/admin/events`, `/admin/events/new`, `/admin/events/:eventId` | Event register, creation and workspace | 3 |
| `/admin/moderation`, `/admin/moderation/:caseId` | Abuse queue and case workspace | 3 |
| `/admin/emergency` | Redirect to `/admin/emergency/requests` | 3 |
| `/admin/emergency/requests`, `/admin/emergency/requests/:requestId` | Blood request triage and detail | 3 |
| `/admin/emergency/donors`, `/admin/emergency/donors/:memberId` | Donor register and entry detail | 3 |
| `/admin/campaigns`, `/admin/campaigns/new`, `/admin/campaigns/:campaignId` | Campaign register, editor and preview | 3 |
| `/admin/analytics` | Period-filtered aggregate reporting | 3 |
| `/admin/audit`, `/admin/audit/:entryId` | Filterable action history and detail | 3; writes start in 2 |
| `/admin/settings/general` | Institution/product configuration | 3 |
| `/admin/settings/team` | Platform admin roster, invitation and role management | 3 |
| `/admin/settings/policies` | Review policies and current feature availability | 3 |
| `/admin/settings/preferences` | Theme and display preferences | 3; theme starts in 2 |
| `/admin/settings` | Redirect to first permitted settings tab | 3 |
| `/admin/*` | Useful Not found state inside admin shell | 2 |

Specific paths such as `new` and `claims` must not be treated as entity IDs. Invalid IDs show Not found, not another person's fixture. Unauthorized routes must not briefly render protected content.

## 5. Module specifications

### 5.1 Overview

- Four primary metrics: pending verifications, pending ownership claims, pending Hiring/Seeking items and open high-priority cases. Each links to its filtered queue. Phase 2 shows only implemented sources.
- Attention list: urgency, type, subject, waiting time and one Review action. Emergency items show operational urgency without implying Ugrads is an emergency-response service.
- Secondary sections: queue health by module, recent decisions and department ownership coverage. Small trend charts require timestamped data; otherwise show a current snapshot.
- Every count is derived from the same records as its destination. Empty means zero, unavailable means unavailable; do not manufacture percentage changes.

### 5.2 Members

Register columns: member, academic identity, affiliation, verification, account status and joined date. Search by name, member ID or permitted email. Filters: identity, department, verification and account status.

Detail tabs: **Profile**, **Verification**, **Access**, **Activity**. Profile shows identity-specific fields: staff designation/office/extension rather than batch or major. Access displays department assignments separately from platform privileges. Activity links to authored content and decisions, excluding unrestricted private-message history.

Actions: correct permitted profile/affiliation data, open verification case, suspend with reason and reactivate with reason. Do not add account impersonation or permanent account deletion to this delivery. Suspension preserves authored records and history; publishing eligibility follows account state once connected to the public data adapter.

### 5.3 Verification

Views: **Pending**, **Needs information**, **Approved**, **Rejected**. Filter by identity, department and submission date. Default Pending, oldest first.

Review layout: applicant and identity facts; relevant evidence with loading/error/unavailable states; request history; decision panel. Alumni document review is supported. Faculty/Staff official-email verification remains distinct; Staff requires the exact institutional domain already defined by `officialEmail`. Do not grant a verified badge merely from a client-side email string.

Actions: Approve, Request information, Reject. The latter two require a reason; all decisions record reviewer and time. Approval changes verification independently of account suspension and does not grant platform or department privileges. Re-submission creates a new revision linked to the earlier decision.

### 5.4 Departments

Register columns: department/code, school, owner, delegated-team count, ownership state and operational status. Filters: school, owned/unowned and active/archived. Owner gaps are actionable; academic affiliations are not permission grants.

Workspace:

- **Overview:** public identity, contact summary, ownership, publication/support counts and public-hub link.
- **Team & access:** owner plus explicit assignments with the current department capability names. Platform view is oversight; routine delegation remains in the existing owner workspace. Exceptional platform access changes require an authorized operation, reason and audit.
- **Page settings:** name, code, school, description, cover, office, hours, email, phone and website. Create/archive/reactivate are platform operations. Archiving preserves references and blocks new publishing; it does not erase memberships or old events.
- **Activity:** metadata, ownership, access and publishing history. Support counts can link to authorized escalations without exposing private conversations to every admin.

Ownership review shows applicant identity/verification/affiliation, reason, request time, current owner and competing claims. Approve only if the applicant is eligible and the department remains unowned. One operation assigns the owner, resolves that claim and closes competing pending claims with an explanation. A stale decision shows a conflict, never overwrites a newly assigned owner. Reject/request information require reasons. Recovery of an already owned department is a separate Platform Owner action with named-recipient confirmation; it must not reuse ordinary claim approval.

### 5.5 Jobs — Hiring and Seeking

Use two local tabs sharing review primitives, with distinct field schemas and status rules.

| | Hiring | Seeking |
| --- | --- | --- |
| Main row | Title, company, poster/department, type, submitted, status | Headline, student, department, category, availability, expires, status |
| Review evidence | Description, requirements, salary/location, deadline, application link and posting identity | Introduction, skills, availability, commitment, compensation, links, visibility, duration and author verification |
| Main actions | Approve, reject, request changes, close, remove with reason | Approve, reject, request changes, remove with reason; inspect author pause/expiry states |
| Filters | Status, type, department, company, submission date | Status, category, department, availability, work mode, expiry |

Preserve Seeking's eight categories, eight-skill maximum, 60-character headline, 400-character introduction, visibility options and 14/30/60-day durations. Admin review must not make a paused/unavailable author active or renew an expired post implicitly. Drafts are author-private and do not enter the review queue. Review the submitted revision, not an unsent draft. Approval after deadline/expiry is blocked until a valid revised submission exists.

### 5.6 Events

Views: **Upcoming**, **Past**, **Cancelled**; a Calendar view is secondary. Separate publication/moderation status from date/registration state. Current department events publish directly; do not impose a new universal approval gate without a future policy decision.

Register: title, organizer summary, Posted by, department, dates, registration state and featured state. Detail tabs: **Details & schedule**, **Participation**, **Activity**. Participation distinguishes Registered, Going and Interested; it is not measured attendance.

Actions: create/edit valid event, feature/unfeature, cancel with reason and remove for a moderation decision. Preserve organizer types, the publishing account, daily activities, venue, capacity and deadlines. Surface the effect of a date change on the schedule before save. No ticket payments, refunds or check-in system are implied. A cancellation outcome can be recorded locally; do not claim attendee notifications were delivered.

### 5.7 Moderation

One case queue across **Profiles, Hiring, Seeking, Events, Notes, Moments, reported Messages and department Broadcasts**. Reports are different from Analytics. Filters: content type, reason, severity, assignee and case state.

Case workspace: report summary; reporter and reported account with permission-sensitive fields; submitted evidence; related cases; internal notes; action history; decision panel. Evidence can be available, missing, deleted or expired. Keep the decision panel usable when media is unavailable.

Actions: assign/reassign, start review, dismiss with reason, remove eligible content with reason, escalate account restriction, resolve and reopen with reason. Content removal and case resolution are separate transitions. Prevent duplicate removals from creating contradictory records. Never extend a Moment's 24-hour lifetime through review, restore expired media or browse every member's private Moments.

### 5.8 Emergency

**Requests:** critical/current items first; columns for hospital, blood group, units, urgency, requested time and state. Detail includes location, request owner, patient/request contact, related department and action history. Copy/contact controls preserve the correct request context.

Actions: correct a request, mark resolved, reopen if still valid, remove fraudulent/inappropriate listing with reason. Resolution and moderation removal are different outcomes.

**Donors:** searchable by member, blood group, location and availability. Inspect profile and donation metadata; restrict contact visibility by capability. Remove/reinstate a directory entry with reason without suspending the whole account. Do not infer clinical eligibility or override a donor's stated unavailability.

### 5.9 Campaigns

Rename Ads to **Campaigns** to include campus promotions and sponsored placements already represented on Home. Start with the real **Home carousel** placement; do not advertise non-existent product slots.

Register: creative/title, placement, audience, start/end, priority and status. Editor: title, supporting copy/alt text, image, destination, audience, schedule, placement, internal notes and mobile/desktop preview. Use the current **3:1** Home slot, not legacy 21:9. Validate image type/size, destination and date ordering; preserve safe crop and text legibility.

Actions: save draft, publish now/schedule, edit, pause/resume and archive. A scheduled state reflects data and current time, not proof of a running background service. Do not fabricate click/impression analytics. Notification broadcasts and email campaigns are not added merely because in-app notifications exist; this scope records operational decision outcomes only.

### 5.10 Analytics

Period and department filters apply to the actual reporting dataset. Sections: community/verification, departments/ownership, career review, events, safety response, emergency requests and campaign availability. Give every metric a definition and time basis.

Examples: pending = currently awaiting decision; approved in period = decisions with `decidedAt` within the selected range; median turnaround = median of decided-minus-submitted for eligible cases; resolved blood requests = recorded resolutions, not donations made; event registrations = registration records, not attendees. Deduplicate entities; label fixture-derived counts in the review documentation. Show unavailable metrics when there is no data source.

Export aggregated, filtered CSV only for permitted roles. Include period/timezone and column definitions; do not export certificates, phone numbers, private messages or Moment media. Neutralize spreadsheet-formula prefixes in user-supplied CSV cells.

### 5.11 Audit log and Settings

Audit filters: actor, action, module, subject, result and time. Detail records timestamp, actor ID/role, entity reference, action, reason, non-sensitive before/after summary and revision. Links return to the entity or an unavailable-record state. The UI has no edit/delete audit controls. A local prototype log is not a tamper-proof production ledger.

Settings:

- **General:** Ugrads identity, institution name, timezone (Asia/Dhaka) and support contact. Configuration must have a defined consumer before exposing an editable control.
- **Team & access:** platform admin roster, invitation draft/status, role changes and revoke/reactivate. Invitation delivery is simulated until a provider exists. Block removal of the last owner.
- **Review policies:** document which content requires review, approved reason categories and current feature availability. Stories stays disabled/read-only in this release; no accidental enable switch. Photo retention stays 24 hours.
- **Preferences:** light/dark/system theme and register density; persist in admin-specific keys.

## 6. State and interaction contracts

The following target states are proposed administrative models. Some extend the current prototype; adapters must translate them rather than passing unsupported strings into existing views.

| Entity | State contract |
| --- | --- |
| Member account | Active ↔ Suspended; verification is independent |
| Verification request | Pending → Approved / Rejected / Needs information; resubmission → new Pending revision |
| Ownership claim | Pending → Approved / Rejected / Needs information / Closed because assigned; assignment is atomic |
| Department | Active ↔ Archived; Owned/Unowned is a separate dimension |
| Hiring | Pending → Published / Rejected / Changes requested; Published → Closed / Expired / Removed |
| Seeking | Existing Draft / Pending / Active / Paused / Expired; add review decision metadata for rejection/change requests/removal without inventing an active public status |
| Event | Scheduled/Live/Past derived from dates; Cancelled and moderation removal are explicit; registration open/closed is separate |
| Moderation case | Open → In review → Resolved; reopen → In review; Escalated retains owner/reason |
| Moment evidence | Available until original expiry → Expired; Removed is possible earlier; no restoration after expiry |
| Blood request | Open ↔ Resolved; Open → Removed; keep resolution time/reason |
| Donor entry | Availability supplied by donor; Listed/Removed controlled separately |
| Campaign | Draft → Scheduled / Active; Active ↔ Paused; time-based Ended; Archive preserves history |

Every mutation validates capability, current entity revision and valid source state. On success, persist once, update details/list/counts and append an audit record. On failure, keep the user's input, explain the failure and offer retry. Do not show a success toast before state is committed. Prevent duplicate submissions while pending.

Use a reason field for rejection, restrictions, removal, cancellation and ownership intervention. Routine saves use normal validation. Serious destructive actions use a named confirmation with appropriate friction; do not interrupt harmless filtering or every draft save with a modal.

Lists need initial loading, no records, no filter matches, load error, selection, sorting and pagination. Details need loading, missing/deleted entity, forbidden access, stale revision and missing evidence. Forms need dirty-state handling, inline field errors, saving, save failure and success. Keep counts in sync after filtering and page changes; clear selections that no longer belong to the visible result set.

Bulk operations are intentionally limited to low-risk actions such as case assignment and campaign archival. Verification, ownership, suspension and content-removal decisions require individual review in this release.

## 7. Geist design and component contract

Use [Vercel's Geist introduction](https://vercel.com/geist/introduction) as the visual authority. The supplied [geist-org organization](https://github.com/geist-org) identifies its own open-source implementation and currently marks its main repositories archived. Do not assume that installing that library supplies Vercel's current components. Implement reusable local React primitives against the official reference; only add a dependency after checking its maintenance, license and React compatibility.

Official references reviewed on 7 October 2026:

- [Colors](https://vercel.com/geist/colors): semantic, theme-aware backgrounds, borders and foreground roles.
- [Typography](https://vercel.com/geist/typography): separate heading, label, button and copy styles; use Geist Sans, with Geist Mono/tabular numerals for appropriate data.
- [Table](https://vercel.com/geist/table): semantic comparable rows, sortable headers, numerical alignment and explicit empty states.
- [Destructive Action Modal](https://vercel.com/geist/destructive-action-modal): resource-specific confirmations, deliberate typed gates for serious actions, loading/error handling and focus behavior.

The following dimensions are **Ugrads admin layout decisions**, not claims that Vercel mandates these exact values:

| Area | Implementation direction |
| --- | --- |
| Typography | Geist Sans; 24px page title, 16–20px section titles, 14px body/control text, 12–13px supporting labels; Mono for IDs where useful |
| Color | Neutral white/near-black canvases, subtle gray surfaces and borders; restrained semantic blue, amber, red and green. Brand logo remains Ugrads. Status always has text. |
| Shape | 6px control radius, 8px panel radius, 1px borders; flatter operational surfaces and restrained overlay elevation |
| Layout | Approximately 240px sidebar, 56px header, 24–32px desktop content padding; independently scrollable navigation without shrinking rows |
| Density | 36–40px desktop controls and 48–56px default table rows; larger touch targets on compact layouts; avoid decorative KPI walls |
| Hierarchy | Page title + short purpose + one primary action; filter bar; register; pagination. Detail metadata uses description lists. |
| Responsive behavior | Sidebar becomes an accessible drawer; filters wrap/collapse; detail panes become full pages; tables get contained scrolling or purposeful compact rows |
| Motion | Brief state transitions, reduced-motion support, no ambient orbs or large decorative animation |
| Themes | Light/dark/system scoped to admin root; admin tokens and storage keys cannot alter the student-facing theme |

Create one token layer for color, typography, spacing, radius and elevation; no per-page hardcoded theme palettes. Build reusable Button, IconButton, Input, Textarea, Select/Combobox, Checkbox, Badge/StatusDot, Tabs, Table, Pagination, DescriptionList, EmptyState, Skeleton, Note/Banner, Toast, Dialog, Drawer and DestructiveActionDialog. Use existing Lucide assets consistently where suitable, without claiming they are the official Geist icon set.

Accessibility acceptance: semantic landmarks and tables, one page heading, labelled controls, visible focus, keyboard-operable filters/menus, dialog focus containment/restoration, Escape dismissal when safe, announced errors/success, non-color status labels and contrast checks in both themes. Check 200% zoom and reduced motion. Essential actions cannot rely on hover.

## 8. Codebase and deployment integration

### 8.1 One repository and one deployed origin

Retain the existing multi-entry Vite approach:

```text
src/                         mobile prototype at /
src/shared/                  shared domain rules and product adapters
webapp/                      routed community app at /webapp/
nsunext-admin/               refactored Ugrads admin package at /admin/
  src/
    app/                     router, providers, route guards
    components/layout/       shell, navigation, page structure
    components/ui/           Geist primitives
    features/                domain lists, detail pages, forms
    data/                    fixtures and repository adapters
    lib/                     capabilities, transitions, filters, dates
    styles/                  tokens and admin-only styles
  DESIGN_SYSTEM.md           concrete implementation reference, created in Phase 2
tests/                       shared and admin domain tests
infoArch.md                  this architecture and phase checkpoint
```

Keep `nsunext-admin/` as the source directory to avoid an unnecessary migration; change its package/display identity to Ugrads Admin. Its directory name is not a public route. Refactor the supplied code directly after preserving a recoverable reference; do not delete the untracked original without preserving it first.

Phase 2 configuration:

1. Align admin tooling with the established React 19 / Vite 7 packages, add the compatible router and record lockfile changes. The supplied admin currently has Vite 5 and no router.
2. Set admin Vite `base: '/admin/'`, output to `../dist/admin`, and React Router basename `/admin`. Deduplicate shared React/React DOM/icon dependencies as the web package does.
3. Add explicit root convenience scripts such as `dev:admin`, `build:admin`, `lint:admin`, and a documented combined build. Preserve existing root/mobile commands.
4. Extend installation/build orchestration to include the admin. Build mobile first, then web and admin, because the root build clears `dist`.
5. Add `/admin` and `/admin/:path*` rewrites to `/admin/index.html` while retaining `/webapp` rewrites. Verify static assets are served correctly, not rewritten into HTML.
6. Verify common-origin behavior with the combined output preview: `/`, `/webapp`, `/admin` and refreshed detail routes. A dev server for just one Vite package is not evidence that all three entry points work.

Do not introduce Next.js or a separate repository/deployment. Root lint must avoid accidentally treating generated/legacy admin output as new failures; run package-specific lint and report known existing mobile lint failures separately.

### 8.2 Data ownership and prototype integration

The current apps do **not** share a durable database. `departmentStore` is in-memory, web Seeking state sits in `AppStateContext`, Hiring submission is primarily form/confirmation UI, and Moments uses per-tab session storage. Importing a shared module into separate Vite apps does not synchronize their runtime state.

Phase 2 creates a versioned admin repository adapter with seeded data and persistent local mutations, stable entity IDs, capability checks and append-only UI audit records. Storage failure has an explicit error or disclosed in-memory fallback. Do not persist verification documents or private media in the admin store. Use admin-specific preferences/session keys; never overwrite `ugrads-session` or `ugrads-instants-v1`.

Use current product fixtures and pure rules where possible; move neutral schemas/constants to shared modules when needed rather than importing whole page components. The legacy admin's user IDs/names conflict with current product records, so they are not an authoritative identity source. Add missing operational metadata through adapters: timestamps, status, revision, submitter, reviewer and reasons.

Phase 3 completes the local integration explicitly:

| Domain | Local integration contract |
| --- | --- |
| Identity / department | Stable member IDs; approved verification and ownership decisions feed the shared public read model; preserve existing owner/assignment resolver rules |
| Hiring / Seeking | Submission/review metadata and approved public records use an adapter; status changes are reflected in public availability and own-post state |
| Events | Preserve event IDs, organizer/publisher separation and department association; edits/cancellation update the public event read model |
| Emergency | Resolution/removal updates public request availability; donor availability remains separate from administrative listing state |
| Campaigns | Active eligible records feed the existing Home carousel geometry rather than a disconnected admin-only list |
| Moderation | Content restrictions reference canonical entity IDs; Moments media remains governed by its existing TTL and privacy scope |

Implement a narrow versioned local data bridge for these records, with same-origin read/refresh behavior and storage-event subscriptions where live tab updates are needed. Keep writes behind domain actions. Test the same-origin path and document separate-port development limitations. Do not indiscriminately persist the entire app context or mirror private messaging content.

Some report/evidence cases need synthetic fixtures because user-facing report controls are currently demo affordances. Record that provenance in developer/review documentation. Do not describe seeded cases as reports actually submitted by users.

Production adapter requirements: authenticated API sessions, server-enforced roles and transitions, transactional claim decisions, durable audit, storage policies, scheduled expiry and delivery providers. The prototype must never claim those services are operational.

## 9. Validation and completion criteria

### Phase 1 — completed in this document

- [x] Read handoff and current route/feature contracts; identify conflicting historical details.
- [x] Audit legacy views and action handlers against both product phases.
- [x] Define complete sitemap, workflows, role boundaries, state model and integration approach.
- [x] Verify supplied Geist references and record the component strategy.
- [x] Define bounded implementation phases and handoff requirements.

### Phase 2 — complete

- [x] `/admin` and all Phase 2 deep links work in the combined deployment output.
- [x] Geist shell/primitives, theme, responsive layouts, access-denied and not-found states are consistent.
- [x] Verification, suspension, ownership and career review change state, update counts and create audit entries.
- [x] Permission checks cover mutations and direct URLs; academic identities cannot implicitly gain platform access.
- [x] Domain tests cover forbidden actions, stale decisions, single-owner assignment, last-owner protection where applicable and invalid transitions.
- [x] Admin lint/build, existing shared tests and mobile/web builds pass or clearly identify unrelated pre-existing failures.
- [x] Browser checks cover desktop 1440×900, short desktop 1024×640 and compact 390×844; both themes, keyboard review and refresh/back navigation.

Phase 2 clarifications: search is kept beside each register; the current sidebar exposes Hiring and Seeking directly; cover editing accepts an image URL. The standalone repository metadata is preserved in ignored `output/admin/legacy-repository.git/`, and the original source/configuration in `output/admin/legacy-admin-phase1.zip`. See `nsunext-admin/DESIGN_SYSTEM.md` for the implemented component contract. Phase 3 now connects these decisions through the same-origin public-data bridge.

### Phase 3 — frontend implementation complete

- [x] Events, Moderation, Emergency, Campaigns, Analytics, Audit and Settings are implemented with real local actions, permission guards and empty/error states.
- [x] Event schedule/organizer rules, evidence expiry, emergency outcomes and campaign lifecycle are validated.
- [x] Platform access protects the last owner; analytics and aggregate CSV derive from filtered records.
- [x] Version-two migration preserves saved Phase 2 decisions; same-origin adapters connect the public surfaces described in Section 8.2.
- [x] 52 domain/adapter tests pass, including the existing Department and Moments tests; admin/web lint and all three builds pass.
- [x] Browser checks cover moderation removal/resolution, missing evidence, request resolution across tabs, campaign pause/resume, filtered analytics/export, inactive invitations, restricted direct URLs, reload, dark theme and compact navigation.
- [x] Documentation records the tested scope and limitations. This is frontend acceptance, not a production or exhaustive accessibility certification.

Implementation refinements approved within the user's IA/design discretion: use one event register with status filters instead of a second calendar; details use stacked sections rather than extra tabs; image creatives accept hosted URLs with previews rather than implying a media upload service; audit lists committed decisions only, so it has no misleading result filter. Campaign image MIME/size validation belongs to the future media service. The register is searchable and sortable without exposing every proposed filter as a separate control. Native date entry and true browser zoom have the verification limits recorded in `ADMIN_PHASE3.md`.

## 10. Scope limits and continuation

No payments, fees, transcripts, grades, attendance tracking, course administration, unrestricted private-inbox surveillance or multi-university tenancy are inferred from this community product. No automatic Story reactivation. No deployment is performed merely to review a frontend phase.

**Frontend handoff:** the three planned phases are implemented. Review `/admin` with `npm run build:all` and `npm run preview:all`. Read `ADMIN_PHASE3.md` for the connected local state, fixture boundaries and QA evidence. Production authentication, database transactions, media storage, delivery and durable audit require a separate backend implementation; the local bridge is not a security boundary. Preserve the existing user changes and original-source backups.

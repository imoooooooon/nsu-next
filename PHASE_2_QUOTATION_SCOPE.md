# Ugrads — Phase 2 Work Breakdown for Client Quotation

Prepared: **6 October 2026**  
Scope: **Departments, Moments (including Stories), Jobs — Seeking Work, Events, and the full web app.**

This document records the design and frontend implementation work represented in the codebase, using `context.md` and the current source as evidence. The five Phase 2 categories follow the client's supplied scope; this is a quotation preparation document, not a comparison against an independently verified Phase 1 contract. Pricing, effort estimates and payment terms are left for the commercial quotation.

**Delivery basis:** The repository contains an interactive mobile prototype and a responsive web app. Features below describe implemented screens, interactions and local/demo state. They do not imply a completed production backend. Stories were developed and retained, then temporarily deactivated in the latest revision; Notes and photo Moments remain active.

## 1. Departments and University Staff

**Quotation description:** Design and frontend implementation of official department hubs, department communication, delegated management permissions, and university staff onboarding across the mobile prototype and web app.

### 1.1 Department discovery and public hubs

- Added Departments as a dedicated directory segment, with departments grouped by school.
- Created register/list and card views, department code tiles, official identity treatment and department summary information.
- Built public department pages with a cover banner, description, school affiliation and member counts.
- Added searchable Students, Alumni and Faculty tabs within each department, with list/card display options and links to member profiles.
- Displayed department leadership and assigned administrators.
- Added office location, office hours, email, phone and website information.
- Connected department pages to their events, jobs and blood requests.
- Added direct entry points to the department's Broadcast Channel and Help Desk.

### 1.2 Department communication

- Built one-way broadcast channels within the existing Messages experience, with reading access for members and posting controls for authorized publishers.
- Added broadcast composition, an optional email-notification toggle and audience-reach confirmation in the demo flow.
- Built private member-to-department Help Desk conversations.
- Added an assigned support team's conversation backlog, replies, open/resolved states and reopening controls.
- Preserved department reply history while navigating within the current session.

### 1.3 Department management workspace

- Created Public View / Admin View switching for assigned teammates.
- Built **Overview**, **Team & access** and **Page settings** sections.
- Added permission-dependent shortcuts for broadcasting, event creation, support conversations and page editing.
- Added page editing for description, cover banner, office location, office hours, email and contact/extension.
- Added banner upload with image preview and JPG, PNG or WebP validation up to 5 MB.
- Connected authorized department event creation to the shared event collection, department hub, event browse screens and campus calendar.
- Reused the existing job and blood-request modules for eligible department administrators.

### 1.4 Ownership and delegated access

- Separated academic identity from department permissions; faculty or staff status alone does not grant management access.
- Implemented the frontend permission model for **Super Admin/owner**, **Primary Admin**, **Broadcast/Event Publisher** and **Help Desk Operator**.
- Added verified-member search, teammate assignment, permission selection, permission changes and access removal with confirmation.
- Restricted delegation and ownership transfer to the owner; non-owners can view the team roster according to their access.
- Added ownership requests for verified faculty viewing an unowned department, with an optional reason and pending-review state.
- Added ownership transfer with named-recipient confirmation, a single remaining owner and the previous owner becoming a Primary Admin.

### 1.5 University Staff / Official journey

- Added University Staff / Official to account role selection and registration.
- Built staff-specific fields for full name, designation, department/office affiliation, office location and optional extension.
- Added validation for the exact `@northsouth.edu` email domain and a demo OTP flow with invalid-code feedback and simulated resend.
- Added a Staff directory and staff profiles emphasizing designation, affiliation, office and official contact details.
- Added staff home entry points for assigned department workspaces and an explanatory state for unassigned staff.
- Created a separate prototype review panel for testing identities, permissions, assignment states and themes.

**Delivery note:** Department verification, email delivery, ownership review, publishing and permissions are simulated locally. A platform-wide department creation/approval console and server-enforced authorization are not implemented here.

## 2. Moments, Notes and Stories

**Quotation description:** Design and frontend implementation of the Moments experience, including short Notes, the original Stories interface, camera-based photo Moments, reactions, replies, personal archive controls and the subsequent Moments design revisions on both surfaces.

### 2.1 Home entry and Notes

- Built the horizontal Moments row with member avatars, names, note bubbles, a creation entry and a separate stacked-photo entry.
- Separated the interactions: an avatar/name opens that author's available photo Moments; a note bubble opens their Note; the stack opens all available received Moments.
- Added touch scrolling and desktop mouse dragging to the row.
- Built a short Note composer with a 60-character limit, character counter and empty-input prevention.
- Built the Note viewer with author identity, note bubble and reply input.
- Integrated creation and viewing with mobile overlays and web navigation.

### 2.2 Stories — work completed, currently inactive

- Developed the original full-screen Story viewer with timed progress indicators, automatic advancement and previous/next navigation across media and authors.
- Added press-and-hold pause behavior and pause behavior while using viewer controls.
- Added author information, timestamps, likes with animation, reply input and a sample viewers list with view/reaction counts.
- Designed the Story media composition/preview interface and share, copy-link, mute and report menu controls.
- Retained the mobile Story components, web Story viewer, sample media and related recap helpers for future reuse.
- Applied the latest requested revision by removing active Story creation/viewing entry points while preserving the earlier work.

**Current release status:** Stories are temporarily disabled. The active creation options are **Notes / Moments**. Story media publishing, viewer statistics and menu actions are prototype UI/demo behavior, not a live publishing or analytics service.

### 2.3 Camera-based photo Moments

- Built an immersive photo viewer with author identity, timestamp, Reply and Close, Info, Archive and Camera controls.
- Implemented author-specific viewing and the combined received-photo feed.
- Added forward/backward horizontal paging, edge snapping, pagination dots, mouse dragging and keyboard navigation.
- Added image loading/retry states and adjacent-image preloading.
- Modeled unread/viewed behavior: only a successfully loaded active photo is marked viewed; backward navigation remains available during the open viewing session; reopening excludes viewed photos.
- Modeled 24-hour expiry for unopened photos and empty/snoozed feed states.
- Added a right-aligned vertical reaction strip, an expanded emoji selector and animated reaction feedback.
- Added locally recorded photo replies and reactions.

### 2.4 Capture, frames and captions

- Implemented browser camera capture, camera switching and retake controls, with camera cleanup when leaving the experience.
- Added post-capture frame selection: **Soft square, Soft hexagon, Soft triangle and Organic circle**.
- Added uppercase curved captions that follow the selected frame outline.
- Added caption placement presets and a continuous position slider around the frame perimeter.
- Added mutual-followers / close-friends audience selection in the prototype sharing flow.
- Added a ten-second Undo after sharing.

### 2.5 Personal archive and revisions

- Built a sender archive with a modeled one-year retention period, presentation editing and delete/unsend controls.
- Added frame and caption-position editing for archived captures.
- Added a 24-hour snooze control.
- Stored captures, receipts, reactions, replies and presentation settings in browser session storage with an in-memory fallback.
- Renamed the active photo experience from **Instants** to **Moments** and revised its header and action wording.
- Replaced the earlier layered photo reveal with horizontal paging and the radial reaction arrangement with a vertical strip.
- Added responsive viewing layouts, modal focus handling, Escape dismissal, accessible control labels and reduced-motion support.

**Delivery note:** Camera capture is implemented in the browser. Photo sharing, audiences, archive retention and unsend are local prototype behavior without authenticated media storage or recipient delivery. Note sharing/reply controls provide demo feedback. No screenshot prevention, durable cloud archive or live messaging delivery is included.

## 3. Jobs — Seeking Work

**Quotation description:** Addition of a student Seeking Work module within Jobs, allowing students to present their skills and work preferences and allowing the university community to discover, save and initiate contact with student talent.

### 3.1 Seeking discovery and filtering

- Added a **Hiring / Seeking** mode switch within Jobs.
- Built the Seeking feed with **All**, **Relevant** and **Saved** views.
- Added categories for Internship, Tuition, Part-Time, Full-Time, Freelance / Project, TA, RA and Campus Ambassador.
- Added search across headlines, student names, categories, introductions and skills.
- Added filters for category, work mode, availability, department, verified profiles, portfolio availability and resume availability.
- Added Relevant, Most Recent and Available Now sorting, filter counts and clear-filter controls.
- Built talent cards with identity, verification, skills, work preferences, availability and save/message entry points.
- Added tailored states for no results, no saved profiles, no relevant profiles and an empty feed.

### 3.2 Talent details and contact flow

- Built talent detail pages/overlays with the student's introduction, skills and work preferences.
- Displayed work mode, location, availability, commitment, preferred duration, compensation, visibility and post age/expiry information.
- Added fields and displayed controls for resume, portfolio, LinkedIn, GitHub and other links.
- Added save/unsave behavior and a Messages handoff carrying the selected talent/post context and suggested opening messages.
- Added own-post and unavailable-post states that adjust the contact action.
- Designed share, copy-link and report options with prototype feedback.

### 3.3 Create and edit a Seeking post

- Added a student-only create/edit flow with a form, preview step and submission confirmation.
- Added category, headline, introduction, skills and work-preference fields.
- Added custom skills, suggested skills, removal, duplicate prevention and a maximum of eight skills.
- Added required-field checks and character limits for headline and introduction.
- Added work mode, location, availability, commitment, preferred duration and compensation preferences.
- Added supporting profile URLs, audience visibility choices and 14/30/60-day duration options.
- Submitted new or edited posts into a **Pending review** state in local app state.

### 3.4 My Seeking Posts

- Built management views for **Active**, **Pending**, **Paused**, **Expired** and **Drafts**, with counts and status-specific empty states.
- Added view/preview, edit, pause, resume, mark unavailable, withdraw, renew, duplicate-as-draft and delete actions as appropriate to each status.
- Added views, saves and messages statistic displays using demo values.
- Implemented matching mobile overlays and web routes, including responsive talent-card grids.

**Delivery note:** Seeking review/approval, analytics, visibility enforcement and timed expiry are not production services. External-link opening, sharing, copy-link and reporting include demo-only controls. The Phase 2 feature item here is the Seeking addition; the existing Hiring screens are also covered by the web adaptation in Section 5.

## 4. Events

**Quotation description:** Design and frontend implementation of campus event discovery, event details, calendar browsing, participation states and event creation, including multi-day schedules and department publishing integration.

### 4.1 Discovery and browsing

- Built an Events landing page with featured, upcoming, recommended and popular event sections.
- Added event/organizer search, category selection, closing-soon discovery and past-event access.
- Built a browse page with search, category filters and All, Upcoming, Closing Soon and Past status filters.
- Created reusable event cards and a featured-events carousel with category, date, organizer and registration-state information.

### 4.2 Event details and participation

- Built event detail screens with cover image, category/status, description, dates, times, venue and venue details.
- Added registration information, deadline display, schedule timeline and cancellation messaging.
- Separated **Organized by** from **Posted by**, including support for multiple organizers.
- Added organizer information, follow/unfollow state, department-hub links where applicable and related-event suggestions.
- Implemented local register/cancel, Going, Interested and reminder-toggle interactions.
- Adapted calls to action for event availability and past/cancelled states, with desktop and mobile action layouts.

### 4.3 Calendar and My Events

- Built a monthly calendar with previous/next month navigation, event indicators and selected-day event listings.
- Built **My Events** with Going, Interested, Registered and Past views.
- Connected participation selections to the relevant My Events lists within the current app session.

### 4.4 Event creation and schedule builder

- Built an event creation form covering title, category, optional custom category, capacity, organizers, date range, registration deadline, schedule, venue and descriptive details.
- Added multiple organizer entries with Club, Department, University Office, External Partner and Individual types.
- Added organizer removal, duplicate prevention and an explicit Add myself shortcut; the publishing account remains separate read-only metadata.
- Added start/end date selection and single-day or multi-day duration summaries.
- Generated one schedule section per event day, with activity start time, end time and details.
- Added activity creation/removal and preserved day-number schedules when the date range changes.
- Added validation for required title/organizers/dates, reversed date ranges, the 31-day event limit, deadline constraints and invalid activity time ordering.
- Added cover-image URL, description and registration-information fields.
- Added publishing confirmation with event, organizer, date-range, deadline and activity-count details.
- Supported publishing as a department when the current identity has permission, with created records available to the shared event screens during the session.

**Delivery note:** Registration, organizer following and reminder settings use local state. Live attendance records, ticketing/payments, scheduled notification delivery and external calendar synchronization are not implemented. Featured/recommended content uses demo data rather than a recommendation service.

## 5. Full Web Version of the App

**Quotation description:** Creation of a separate, responsive, routed web application covering the existing Ugrads product and the Phase 2 modules, with desktop layouts, shared styling/components and configuration to serve alongside the mobile prototype.

### 5.1 Web foundation and responsive design

- Created a separate React/Vite web app under `webapp/`, served under `/webapp/`.
- Replaced mobile-only screen/overlay navigation with browser routes and direct links to individual screens.
- Built a desktop app shell with sidebar, top bar, wider content areas and multi-column layouts.
- Added smaller-screen layouts with the mobile-style bottom navigation.
- Adapted forms, detail pages, modals, cards and messaging for browser use.
- Established reusable UI components, layout components, theme tokens and feature modules.
- Implemented light/dark themes and consistent typography, brand colors, spacing and interaction styling.
- Documented the web design system and build conventions.

### 5.2 Product coverage delivered on the web

| Area | Web screens and journeys |
| --- | --- |
| Account access | Welcome, role selection, login, signup and demo OTP, including the added Staff journey. |
| Home | Dashboard, Moments row, notification previews, promotional carousel and emergency summary. |
| Network | People directory, role-based directory segments, search/filter views and member profiles. |
| Departments | Department discovery, public hubs, staff profiles, ownership flows and management workspace. |
| Jobs — Hiring | Job browsing, search/filtering, job details and job-posting form/status screens. |
| Jobs — Seeking | Talent feed, filters, saved profiles, talent details, create/edit/preview and My Seeking Posts. |
| Events | Landing, browse, calendar, My Events, event details and creation. |
| Emergency | Emergency overview, blood-group donor directory and request details. |
| Messages | Conversation list, desktop split-pane chat, individual chats, department broadcasts and Help Desk conversations. |
| Notifications | Dedicated notification listing. |
| Profile and settings | Profile and settings screens for personal information, email/phone, password, language, visibility and sessions. |
| Moments | Active Notes and photo Moments creation/viewing, camera and archive; retained inactive Story viewer. |

### 5.3 Integration and delivery configuration

- Shared Department and Moments implementations between mobile and web where applicable.
- Added web app state for demo authentication, saved talent, Seeking post management and event participation selections.
- Connected feature journeys through routes, including Seeking-to-Messages and Department-to-Events/Help Desk.
- Configured builds for mobile at `/` and the web app at `/webapp/` in one static output.
- Added hosting rewrites for web deep links and documented local development/build steps.

**Delivery note:** Full web version means broad product-screen and interaction coverage in the frontend. Demo authentication, job applications, settings and other simulated actions do not become production services through the web conversion. This document does not certify a live deployment.

## 6. Suggested Quotation Line Items

| Item | Quotation-ready scope summary |
| --- | --- |
| Departments & Staff | Department directory and public hubs; broadcasts and Help Desk; management workspace; ownership and delegated access; staff onboarding, directory and profiles. |
| Moments, Notes & Stories | Notes and original Story interfaces; photo Moments viewer and camera capture; custom frames and curved captions; reactions, replies, archive and sharing controls; latest design revisions and temporary Story deactivation. |
| Jobs — Seeking Work | Student talent discovery, search/filtering, detail profiles, saved talent, contact handoff, post creation/preview and status-based post management. |
| Events | Discovery, event details, participation states, calendar, My Events, multi-organizer creation, multi-day schedules and department publishing integration. |
| Full Web App | Responsive web implementation of existing and Phase 2 app journeys; desktop navigation/layouts, routes, reusable components, themes and build/hosting configuration. |

For pricing, Sections 1–4 describe the feature design and behavior. Section 5 describes the additional web foundation, desktop adaptation, routing and integration work. Allocate shared work once when costing these line items. Existing app areas brought to the web should be described as web adaptation, rather than being presented as entirely new Phase 2 product features.

## 7. Evidence and Verification Notes

The scope was checked against the handoff and source files below. This documentation task did not rerun the app, tests or deployment.

| Scope | Repository evidence |
| --- | --- |
| Previous work and revision history | [context.md](context.md) |
| Department requirements and boundaries | [DEPARTMENT_HUB_IA.md](DEPARTMENT_HUB_IA.md) |
| Shared department flows and permissions | [DepartmentExperience.jsx](src/shared/DepartmentExperience.jsx), [departmentModel.js](src/shared/departmentModel.js), [departmentStore.js](src/shared/departmentStore.js) |
| Public department hub | [DepartmentHubPage.jsx](webapp/src/pages/departments/DepartmentHubPage.jsx), [department features](webapp/src/features/departments/) |
| Current Moments behavior | [INSTANTS.md](INSTANTS.md), [shared implementation](src/shared/) |
| Notes and retained Stories | [web Moments pages](webapp/src/pages/moments/), [mobile app](src/App.jsx) |
| Seeking Work | [mobile Seeking components](src/components/seeking/), [web Seeking components](webapp/src/features/seeking/), [web Jobs pages](webapp/src/pages/jobs/) |
| Events | [mobile event components](src/components/events/), [web Events pages](webapp/src/pages/events/), [event form logic](webapp/src/features/events/eventForm.js) |
| Web coverage and local state | [route map](webapp/src/App.jsx), [AppStateContext.jsx](webapp/src/context/AppStateContext.jsx) |
| Web design and delivery setup | [web README](webapp/README.md), [DESIGN_SYSTEM.md](webapp/DESIGN_SYSTEM.md), [vercel.json](vercel.json) |

The prior handoff records 22 passing model tests, successful mobile/web builds, web and shared Moments lint checks, and browser review of the Department/Moments journeys. It also records existing root-app lint issues. These are historical verification results, not a new whole-product acceptance test.

# Combined portal revisions — 6 October 2026

Sources: `Shared File__Ugrads - Alumni Portal Startup Stages.pdf` and
`Ugrads Revisions.pdf`. Repeated directory and admin requests are merged below.
The more specific role ordering in the first document takes precedence over its
introductory “below latest jobs” sentence. The isolated “3.” in the second PDF
labels an embedded admin screenshot; it does not describe another feature.

| Requirement | Implementation | Surfaces |
| --- | --- | --- |
| Desktop onboarding should feel like a web experience | Full-height split composition with a capped 400–460px right panel with the existing NSU line art, three manually controlled carousel slides and the existing authentication routes in the right column. Long forms remain scrollable. | Web; responsive single column below 1024px |
| Hide Staff from Directory | Four public lenses, plus Staff for department owners only; legacy web Staff links fall back to Alumni for non-owners. Staff accounts, signup, profiles, assigned officials and team lookup remain available. | Mobile + web |
| Polish department admin view | Distinct count cards, coloured/icon-led action tiles, support queue with open/resolved labels, team summary rail, role chips and grouped permission guidance. Open conversations sort before resolved ones. | Shared mobile + web workspace |
| Add job-seeking requests to Home | Three active requests, details and save actions, plus Seeking feed links. Alumni/faculty: requests then offerings. Students: offerings then requests. | Shared mobile + web preview |

## Implementation

- `src/shared/HomeCareerSections.jsx`: shared ordering and compact request register.
- `src/shared/DepartmentExperience.jsx`, `department-workspace.css`: department workspace.
- `webapp/src/components/layout/AuthLayout.jsx`, `auth.css`: persistent onboarding carousel and form shell.
- `webapp/src/pages/auth/WelcomePage.jsx`: web welcome composition.
- `src/App.jsx`, `webapp/src/pages/HomePage.jsx`, `webapp/src/pages/network/NetworkPage.jsx`: integration and directory cleanup.

The implementation retains Plus Jakarta Sans, Ugrads blue, theme surfaces,
restrained shadows, rounded controls and the existing segmented-pill motion.
No backend authentication, permissions or delivery behavior was added.

## Verification

- All 25 existing model tests passed.
- Web lint and changed shared-component lint passed.
- Both production builds passed; existing bundle-size warnings remain.
- Root `src/App.jsx` retains its pre-existing 15 lint errors and 1 warning.
- Browser checks: desktop onboarding split/carousel; role selection, signup and
  OTP; mobile-width OTP; light/dark workspace; support resolution counts; team
  and settings navigation; staff retained under Department Officials; four
  public directory tabs; student/faculty Home ordering; saved requests reflected
  in the Seeking feed; mobile Home links and ordering.
- Prototype state was exercised only on local test origins. No deployment.

## Follow-up polish — 6 October 2026

- Capped onboarding controls at 336px on desktop; centered shorter page groups.
- Real Ugrads logo in the upper left, including the mobile web header.
- Visible input icons, light/dark field boundaries and secondary actions; stronger
  primary-button and warning-text contrast.
- Restored owner-only Staff discovery on both surfaces using live ownership access.
- Removed identity/help-desk accent strokes and reduced desktop KPI cards to about 113px.
- Verified 1024×640 alumni/staff signup and role selection without overflow; mobile
  OTP layout, owner Staff search/profile navigation and student tab exclusion.

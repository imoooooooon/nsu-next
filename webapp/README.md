# NSUNEXT Web App

The desktop/web version of the NSUNEXT mobile app, served at
**https://nsu-next.vercel.app/webapp**. It is a fully separate Vite + React
project inside `webapp/` — the mobile prototype at the repo root is untouched
and still serves at the root URL for phone testing.

## What this is

- Same product, same design language, same demo data as the shipped mobile app —
  rebuilt as a real multi-route web application.
- **Proper routing**: every screen the mobile app modeled as a view/overlay is a
  URL here (see the route map in `DESIGN_SYSTEM.md` §4). Deep links work.
- **Reusable component system**: design tokens in `src/theme/ThemeContext.jsx`,
  primitives in `src/components/ui/`, shared feature components in `src/features/`.
  The formal spec lives in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
- **Responsive**: ≥1024px gets the desktop shell (floating glass sidebar +
  topbar, multi-column grids, split-pane messaging); below that, testers get the
  familiar mobile layout with the floating capsule bottom nav.

## Project layout

```
webapp/
├─ DESIGN_SYSTEM.md          ← binding design + build contract
├─ src/
│  ├─ theme/ThemeContext.jsx  ← design tokens (t), light/dark, persistence
│  ├─ context/AppStateContext ← global demo state (auth role, events, seeking…)
│  ├─ components/
│  │  ├─ ui/                  ← primitives (Button, Card, Modal, forms…)
│  │  ├─ layout/              ← AppShell, Sidebar, TopBar, MobileNav, AuthLayout
│  │  └─ icons/               ← custom NSUNEXT line icons
│  ├─ features/               ← reusable feature components (events, jobs,
│  │                            network, seeking, moments, home, messages)
│  ├─ pages/                  ← one component per route
│  ├─ data/                   ← demo data, identical records to mobile
│  └─ lib/                    ← role styles, navigation helpers
└─ vite.config.js             ← base '/webapp/', builds to ../dist/webapp
```

## Local development

```bash
cd webapp
npm install
npm run dev        # http://localhost:5173/webapp/
```

The mobile prototype still runs independently from the repo root (`npm run dev`).

## Deployment (Vercel)

The root `vercel.json` builds both apps into one static output:

1. `npm run build` (root) → mobile prototype → `dist/`
2. `npm run build --prefix webapp` → web app → `dist/webapp/`
3. Rewrites send `/webapp/*` (non-file paths) to `/webapp/index.html` so the
   SPA router handles deep links. Everything else serves the mobile prototype.

Nothing about the existing deployment URL or the mobile prototype changes.

## Demo auth

Log In / OTP flows are demo-only, like the mobile app: pick a role
(student / alumni / faculty) via **Create New Account → role**, or just Log In
(defaults to student). Role changes what you see — job posting is
alumni/faculty, Seeking-Work posting is student, exactly as on mobile.

# Ugrads Admin

The Ugrads platform admin lives in this repository and is served at **`/admin`**. The directory keeps its original name for continuity; it is no longer a separate Git repository or deployment.

## Run

From the repository root:

```powershell
npm install --prefix nsunext-admin
npm run dev:admin
```

Open the Vite URL with `/admin/`. For a common-origin preview containing mobile, web and admin:

```powershell
npm run build:all
npm run preview:all
```

Open `http://127.0.0.1:5182/admin/`. `PORT` can override the preview port. Root `npm run dev` continues to serve the mobile application; use the combined preview to test all three entry points together. Vercel's configuration installs/builds all packages and handles admin deep links.

## Review sessions

The entry page explicitly selects a local prototype session. Platform Owner and Operations Admin can use the operational workflows. Moderator has Moderation and scoped Audit access; Analyst has aggregate Analytics. Preferences remain available to each role. Academic identities and department permissions do not grant platform access.

The repository adapter stores operational state in `ugrads-admin-data-v1`; the session and theme use independent `ugrads-admin-session-v1` and `ugrads-admin-theme-v1` keys. Decisions survive reload and same-origin tabs refresh on storage events. Browser locks serialize writes when available; stale entity revisions are rejected. Storage failures do not report a successful write or silently erase saved records.

The version-two workspace connects to the public apps through `src/shared/adminBridge.js` and the `ugrads-public-submissions-v1` queue. Use the combined preview: different development ports have different browser storage. Public availability reflects local decisions, but no emails are sent and no real account access is enforced. Production requires authenticated services, server authorization and durable storage.

## Implementation map

- `src/app/`: provider, context and route scroll/focus behavior.
- `src/components/`: shared Geist controls and responsive shell.
- `src/features/`: all community, career, safety, engagement and administration workspaces.
- `src/data/`: versioned repository and deterministic seed builder; snapshot of current product fixtures.
- `src/lib/model.js`: pure capability and transition rules; every write passes through this module.
- `src/styles/admin.css`: theme tokens and responsive component styling.
- `../tests/admin.test.mjs`: permission, concurrency, ownership, state transition and persistence checks.
- `../infoArch.md`: full scope and phased handoff; `DESIGN_SYSTEM.md`: admin design contract.

`product-snapshot.json` is generated from literal fixture arrays with `node scripts/seed-admin-snapshot.mjs` from the repository root. This command never imports application modules and does not change saved browser state. The snapshot seeds the workspace; the shared bridge overlays saved decisions and imports new local public submissions. Dates, operational statuses, generated contact emails, verification summaries and claims are synthetic review metadata. Verification documents and private media are not stored.

## Original source preservation

`../output/admin/legacy-admin-phase1.zip` preserves the supplied source/configuration before replacement. The original nested Git metadata is preserved in ignored `../output/admin/legacy-repository.git/`. Do not copy that directory back into the active admin package: doing so would make it a separate repository again. Nothing was committed, pushed or deployed during this implementation.

## Validation

Run `npm test`, `npm run lint:admin`, `npm run lint --prefix webapp` and `npm run build:all` from the root. See `../ADMIN_PHASE3.md` for final QA, screenshots, known limits and backend requirements. The historical Phase 2 QA remains in `../ADMIN_PHASE2.md`.

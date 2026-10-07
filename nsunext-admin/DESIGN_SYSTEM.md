# Ugrads Admin — Geist implementation contract

The `/admin` surface uses a local implementation of [Vercel Geist](https://vercel.com/geist/introduction). The community apps retain their approved visual language. Do not import their glass surfaces, capsule navigation or global styles into admin.

## Foundations

- Fonts: self-hosted `@fontsource-variable/geist` and `geist-mono`; loaded from the admin bundle. Sans is the default; Mono is reserved for identifiers. Numeric summaries use tabular figures.
- All semantic colors live in `.ug-admin` in `src/styles/admin.css`. Light/dark themes define canvas, background, subtle/hover surfaces, borders, text and semantic foreground/background pairs. `system` follows the OS preference.
- Standard body/control type is 13–14px, page title 26px, section title 15px. Supplementary labels use 10–12px; they do not carry the only version of an essential action.
- Controls use a 6px radius, panels 8px, dialogs 12px. Default desktop controls are 36px high; compact-layout buttons are 40px. Borders carry hierarchy; shadows are limited to overlays.
- Sidebar is 236px wide, header 64px, content padding 32px. These are Ugrads layout decisions. Below 760px, navigation becomes a native modal drawer. At intermediate widths, details and the overview rail stack.
- Ugrads mark reuses the existing product's Cloudinary asset, with a text fallback. No Vercel branding is used. Lucide supplies the icons.

## Components and interaction

Shared primitives live in `src/components/ui/`: buttons/links, badges, avatars, fields, description lists, panels, empty states, registers, tabs, native dialogs, decision dialogs and editable forms. New feature modules should compose these before adding another primitive.

- Use an actual link for navigation, a button for actions, and a labelled native input/select for forms.
- Register filters, sort and page state belong in URL search parameters. Data rows use semantic tables. Narrow tables scroll inside their own region; the page must not overflow horizontally.
- Search stays beside the register it filters. This intentionally replaces the IA's proposed second search in the top bar, avoiding duplicate search inputs with different scope.
- Navigation includes all implemented community, career, content/safety, engagement and administration modules, filtered by capability.
- Every state badge includes text. Color never conveys the only status information.
- Each destructive dialog names the affected entity, requires a reason and uses an exact typed confirmation where appropriate. Plain approvals and normal saves do not require typing an entity name.
- Native `dialog.showModal()` provides focus containment. Escape and Close restore the trigger. Dirty edit dialogs ask whether to discard; saving errors preserve input.
- One page-level heading, visible focus, skip link, keyboard-accessible controls and reduced-motion styling are required. Empty record and access-denied pages also have a page heading.
- Lists read from the same repository as detail views and overview counts. Do not add standalone sample counters.

## Sources

References checked during implementation: [Colors](https://vercel.com/geist/colors), [Typography](https://vercel.com/geist/typography), [Materials](https://vercel.com/geist/materials), [Buttons](https://vercel.com/geist/button), [Tables](https://vercel.com/geist/table), [Destructive Action Modal](https://vercel.com/geist/destructive-action-modal). The archived `geist-org` package is not installed.

This implements the documented visual/interaction direction in ordinary React; it does not claim to distribute Vercel's private component implementation. Keep primitives and CSS tokens coherent when extending the dashboard.

## Phase 3 extensions

Operation registers/details reuse the same fields, dialogs, tables and semantic tokens. Campaign previews retain the public Home carousel's 3:1 aspect ratio. Schedule lists, evidence states, aggregate metric cards and audit descriptions are composed from shared panels. Comfortable/compact register density is an admin-only preference. Settings documents the unchanged disabled Stories feature and 24-hour photo retention.

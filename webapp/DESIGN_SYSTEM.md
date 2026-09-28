# Ugrads Web — Design System & Build Contract

The web app is a 1:1 visual port of the shipped Ugrads mobile app (`../src/App.jsx`),
re-architected for desktop with proper routing. **Every page must follow this document.**

## 1. Foundations

| Token | Value |
|---|---|
| Font | Plus Jakarta Sans (400–800), loaded globally. Body class `font-jakarta` set by shells. |
| Primary | `#1D9BF0` (hover `#1A8CD8`) |
| Canvas | light `#F2F5F8` / dark `#000000`, with ambient blurred orbs (`AmbientBackground`, already rendered by the shells) |
| Surfaces | glass cards: light `bg-white/70 backdrop-blur-2xl`, dark `bg-[#121212]/60 backdrop-blur-2xl` |
| Text | light `#0F1419` / dark `#E7E9EA`; muted `#6B7280` / `#71767B` |
| Semantic accents | jobs = emerald, emergency = red, alumni = amber, faculty = maroon `#800000` (rose-400 in dark), events/brand = `#1D9BF0` |
| Radii | cards `rounded-2xl`, inputs/buttons `rounded-xl`, chips `rounded-md`/`rounded-lg`, nav capsules `rounded-[2rem]+` |
| Type scale | page titles `text-2xl/3xl font-extrabold tracking-tight`; card titles `text-lg font-extrabold`; body `text-sm font-medium/bold`; micro-labels `text-[10px]/[11px] font-extrabold uppercase tracking-wider` |
| Motion | `animate-fade-in`, `animate-fade-in-up`, `animate-slide-up`, `animate-scale-up`, `active:scale-[0.97]` on pressables (all defined in `src/index.css`); spring curves `--ease-spring-soft` / `--ease-spring-bouncy` for selection controls — see "Motion — springs" below |
| Elevation | **A whisper.** One hairline shadow app-wide (`--ugrads-shadow`); separation comes from borders and the glass surfaces. See "Shadows" below. |

### Shadows — a whisper, the same on both apps

Shadows may only *hint* that a surface sits above the canvas — the page should
read as if there were none. Both apps (`src/index.css` and `../src/index.css`)
end with one rule:

```css
:root { --ugrads-shadow: 0 1px 2px 0 rgb(15 20 25 / 0.05); }
[class*="shadow-"]:not(.shadow-none):not(.shadow-inner) { --tw-shadow: var(--ugrads-shadow) !important; }
```

Every Tailwind shadow utility — sized (`shadow-sm…2xl`), coloured
(`shadow-[#1D9BF0]/40`) or arbitrary (`shadow-[0_-10px_40px_…]`) — writes the
single variable `--tw-shadow`, so this turns all of them into the same hairline
and ignores their colour. You may keep writing `shadow-*` classes; they all
resolve to the whisper. Tune the whole app by editing `--ugrads-shadow`, never
per element.

- **Focus rings survive.** Rings compose through `--tw-ring-shadow`, which the
  rule leaves alone. (The old kill-switch, `box-shadow: none !important`, also
  erased the focus ring on any element that carried a shadow class.)
- `shadow-inner` (wells, progress tracks) and `shadow-none` keep their meaning.
- `t.cardShadow` is `shadow-sm` on both apps — it just opts a card into the
  whisper.
- The nav capsules' drop is `0 2px 8px -2px` at 6% (light) / 30% (dark) — the
  floating bar needs a hint of lift over scrolling content, no more. Their
  **inset** hairlines draw the glass edge and are not cast shadows.
- Text `drop-shadow-*` stays on mobile, where it keeps white text legible over
  photos (the moment viewer), and off on the web, where nothing needs it.

### Motion — springs, not swaps

Selection controls never repaint their active option in place. That blink —
old option off, new option on — is what read as cheap.

- **One travelling pill.** `SegmentedControl`, `ViewModeToggle` and the Jobs
  `Hiring | Seeking` pill render a single `.sliding-pill` that glides to the
  chosen option (`useSlidingPill` in `components/ui/motion.js`), the way a
  Framer Motion `layoutId` indicator does. Options are `relative z-10` above
  it and only change colour. Build any new segmented control on the hook.
- **Springs from physics.** `--ease-spring-soft` (ζ≈0.8, ~1% overshoot, 460ms)
  moves pills; `--ease-spring-bouncy` (ζ≈0.64) settles switch knobs. Both are
  sampled spring curves expressed as CSS `linear()`, with a cubic-bezier
  fallback — no motion library, and it runs on the compositor.
- **Switches squish.** `Toggle` / `SwitchVisual` stretch the knob while
  pressed and glide on the bouncy spring. The squish keys off the named
  group `group/switch`, so a whole pressable strip can own it.
- **Remounts keep the glide.** A control that remounts on selection passes
  `enterFrom` (the key it came from) or `memoryKey` (remembered last key).
  Hiring ⇄ Seeking are two routes, so the page you land on glides in from
  the other mode, and both pages skip their whole-page fade when
  `location.state.jobsModeSwitch` is set — only the feed cross-fades.
- **Tailwind v4 note.** `translate-x-*` writes the CSS `translate` property,
  not `transform`; transition `translate` when animating those utilities.
- `prefers-reduced-motion` zeroes both.

The mobile prototype mirrors this in `../src/components/ui/` (`SegmentedPill`,
`ViewModeSwitch`, `SwitchVisual`).

### Theme access — never hardcode theme conditionals ad hoc

```jsx
import { useTheme } from '../theme/ThemeContext';
const { t, isDark, toggleTheme } = useTheme();
```

`t` has the exact keys the mobile app used: `bg, card, surface, border, borderSoft,
text, textMuted, glass, overlayGlass, inputBg, inputBorder, cardShadow`.
Copy mobile JSX and it just works — `t` and `isDark` mean the same thing.

`useTheme()` also carries the one piece of chrome state that persists like the
theme does: `isSidebarCollapsed` / `toggleSidebar()`.

### Global state

```jsx
import { useAppState } from '../context/AppStateContext';
```
Provides: `authRole, setAuthRole, authMode, setAuthMode, isAuthed, login(), logout(),
toastMsg, showToast(msg), requestedSet, toggleRequested(id),
registeredEventIds/goingEventIds/interestedEventIds/reminderEventIds/followedOrganizerIds (+ setters),
seekingFilters/setSeekingFilters, savedTalentIds, handleToggleSavedTalent(id),
mySeekingPosts, handleSubmitSeekingPost(post), handleMySeekingAction(id, action),
chatContext/setChatContext, isDonorAvailable/setIsDonorAvailable,
departmentAdminIds/grantDepartmentAdmin(deptId,id,name)/revokeDepartmentAdmin(deptId,id,name),
sentBroadcasts/sendDepartmentBroadcast(deptId,msg), departmentAbout/updateDepartmentAbout(deptId,text),
mutedChannelIds/toggleChannelMute(channelId),
pushEnabled/handlePushToggle, appLanguage/setAppLanguage, twoFactorEnabled/handle2FAToggle,
profileVisibility/setProfileVisibility, activeSessions/setActiveSessions`.

Toast is already rendered by the shells — just call `showToast('...')`.

## 2. Primitives (`src/components/ui`, barrel export)

- `Button` — `variant: primary|secondary|soft|danger|success|neutral|ghost`, `size: sm|md|lg`, `full`, `icon`
- `IconButton` — square glass header button: `icon, label, size sm|md|lg, active, badge`
- `Fab` — round floating action button (`icon, label`)
- `Card` — glass card (`interactive`, `padded`)
- `TintedCard` — gradient hero card: `tint: blue|blueSoft|emerald|red`, `interactive`, `contentClassName`
- `CardGlow` — blurred corner glow inside relative cards
- `SegmentedControl` — `options` (strings or `{id,label,badge}`), `value`, `onChange`, optional `memoryKey`; sliding spring pill
- `ViewModeToggle` — icon-only card ⇄ list switch (`value: 'card'|'list'`, `onChange`); SegmentedControl's track, one size down. Lives on a collection's **results line**, never with the filters. Wherever people are listed in bulk (Directory, a department hub's roster) it is present, and the mode is remembered per kind via `useDirectoryView(kind)` (`lib/directoryView.js`).
- `ChipTabs` — solid-accent chip row (`options`, `value`, `onChange`)
- `Pill` — static tinted pill; pass color classes via `className`
- `Toggle` — switch (`checked, onChange, color, size, label`); `SwitchVisual` is the same switch, visual only, for when a larger element is the control
- `useSlidingPill(activeKey, { enterFrom, memoryKey })` — the travelling-pill hook behind every segmented control
- `Dots` — carousel indicators
- `Field, FieldLabel, FieldHint, TextInput (icon), SelectInput, TextArea, SearchInput (value, onChange, onClear)`
- `Avatar` (`size xs–3xl`, `online`), `RoleAvatar` (`role: Student|Alumni|Faculty`), `Verified`, `RoleTag`
- `SectionHeading` (`title, action, onAction`), `MicroHeading`, `EmptyState` (`icon, title, subtitle, action, onAction`), `Toast`
- `SettingsRow` — settings list row (`icon, label, value, isToggle, toggleState, onToggle, isDestructive, onClick`); stack inside `Card padded={false}`
- `Modal` — bottom-sheet on mobile / centered dialog on desktop (`onClose, title, size sm|md|lg|xl`)
- `ActionSheetModal` — `title, actions: [{icon,label,onClick,isDestructive}], onClose`
- `DropdownPanel / DropdownHeading / DropdownItem / DropdownDivider` — anchored menus (wrap trigger in `relative`)

Helpers: `getRoleStyles(role, isDark)`, `getPersonRole(person)`, `getDeptStyle(dept, isDark)`
from `src/lib/roleStyles.js`; `useCloseTo(fallback)` from `src/lib/navigation.js` for
back-buttons on detail routes.

**Entity vs person — a load-bearing distinction.** Departments are *Entity
Profiles*, not accounts. They render with a **rounded-square** `EntityAvatar`
carrying the department's **short code** (`dept.short` → CSE / ECE / BBA / ARC)
in its own accent colour — a department has no face, and "CSE" identifies it
faster than any glyph. The **full department name always sits beside the mark**;
people keep circular `Avatar`/`RoleAvatar`.
One glance separates an official notice from a classmate — in the inbox, in the
directory, in notifications and on job cards. Never give a department a circle,
and never give a person a square.

Department primitives live in `features/departments/DepartmentPrimitives.jsx`
(`EntityAvatar` size `xs–3xl`, `EntityVerified`, `AccessBadge level=official|admin|member`,
`DepartmentStats`, `DepartmentInfoRow`) with the directory lens in
`features/departments/DepartmentDirectory.jsx` (`DepartmentList`, `DepartmentRow`,
`MyDepartmentPanel`) and `DepartmentBloodRequestModal` beside them, and the asymmetric channel view in
`features/messages/DepartmentChannelView.jsx`. Permissions come from **one**
resolver — `getDepartmentAccess(dept, authRole)` in `lib/departmentAccess.js`
(`level, isOfficial, isAdmin, canManage, canBroadcast, canGrantAccess, isMember`).
Never re-derive department permissions inside a screen.

**People are cards; entities are a register.** The blue `TintedCard` is the
*person/post* surface — jobs, people, talent. Departments never use it in a
list. The Departments lens renders as a **register**: one `Card` (plain glass,
no gradient) holding hairline-divided rows, sectioned by school.

| Part | Rule |
|---|---|
| Row | `EntityAvatar md` · name (`text-[15px] font-extrabold`, clamps to 2 lines) · meta `members · room` (mobile) / `members · Est.` + a right-aligned **Office** column (md+) · trailing Message icon button (`rounded-xl`, 40px). Whole row opens the hub — on the web via a stretched `Link` so the Message button stays its own target. |
| Signals | A chip appears **only when true**: upcoming events (brand blue, `CalendarDays`), open roles (emerald, `Briefcase`), blood requests (red, `Droplet`) — the app's semantic colours, same geometry as `AccessBadge`, in the hub rail's order. Rows are meant to differ; never add a chip that is always present. |
| Verification | Stated **once** in the list header ("Verified by NSU"). Rows carry an icon-only `BadgeCheck` glued to the name's last word. Everywhere outside the register (hub hero, messages) the worded `EntityVerified` still applies. |
| Access | Lives on `MyDepartmentPanel`, not on rows — only the viewer's own department ever has a non-visitor level, and the panel sits directly above it. |
| View modes | The Directory's `ViewModeToggle` switches **card ⇄ list** and remembers the mode **per kind of object**: the three people lenses share one (default **card** — `PersonCard` / `PersonList`), Departments keep their own (default **list** — `DepartmentList` / `DepartmentGrid`). A global mode would flip the register into tiles whenever someone browsed people as cards. |
| Card mode (departments) | `DepartmentCard` is still not the person card: plain `Card`, no gradient; code tile + Message button on top, name, `members · Est.`, signal chips, and an **Office / Open hub** footer. Grouped by school; "Verified by NSU" once above the groups. |
| List mode (people) | `PersonRow` inside one `Card`, hairline-divided: circle `Avatar md`, name + `Verified`, `role @ company`, then department chip + batch in a fixed right column (sm/md+), and a compact `ConnectButton` (`className="w-28 shrink-0"`). |
| Your department | `MyDepartmentPanel` leads the lens (mobile: above the list; lg: sticky right rail, `lg:grid-cols-3`). It carries identity + `AccessBadge`, the **latest notice** (seed + session broadcasts, with the "Also emailed" mark) linking to the broadcast channel, and two doors: Open hub + Message (members) or Manage (Official/Admin). |

Department accents (`getDeptStyle` / mobile `getDeptAccent`): CSE blue, ECE
purple, BBA amber, **Architecture teal**. Every department in the demo data has
its own accent — the tile is the only colour a register row owns, so two
departments must never share one.

Shared feature components already built: `features/events/EventPrimitives.jsx`
(`EventStatusBadge`, `EventCard` with `standard|compact|horizontal|recommended`, `useEventStatus`),
`features/events/FeaturedEventsCarousel.jsx`, `features/jobs/JobCard.jsx`, `features/jobs/JobSlider.jsx`,
`features/network/PersonCard.jsx` (+`ConnectButton`), `features/moments/MomentsRow.jsx`,
`features/home/*`. Reuse them — do not fork.

## 3. Layout conventions

Every authenticated page renders inside `AppShell` (sidebar ≥lg, floating capsule
bottom-nav <lg, sticky glass TopBar ≥lg).

- The desktop sidebar uses `rounded-2xl` (its items `rounded-xl`). The floating
  **mobile** capsule keeps its full `rounded-[2.5rem]` — that one is parity with
  the shipped app.
- The TopBar is an **edge-to-edge band pinned at `top-0`**, `h-16` (64px),
  **opaque** (`bg-[#F2F5F8]` / `bg-black`) with a single `border-b`. It is a
  sibling of the content wrapper, so it takes its own 64px of flow and nothing
  needs `100vh - bar` arithmetic.

  It used to be a floating card at `sticky top-4` whose edges aligned with the
  page content. That left a 16px channel above it and translucent glass through
  it, so the page visibly scrolled *past and behind* the bar. Running the
  surface the full viewport width also removes the seam the floating version
  was avoiding: there is no gutter for the surface to die in, because the
  sidebar now starts **below** the bar (`fixed top-[72px]`) instead of beside it.

  Sticky rails inside pages therefore park at `top-20` (64px bar + 16px of air).
  There is no `top-[92px]` any more — if you see one, it predates this change.
- The bar carries the **brand**, not the page title: every page already names
  itself in `PageHeader`, and two stacked headers saying the same word was the
  duplication that made the gap below the bar feel so large.
- TopBar utility buttons (events / theme / notifications) are **ghost**: icon
  only, tint on hover. Boxed buttons float as visible squares on the bar.

### Sidebar width — responsive *and* chosen

`isSidebarCollapsed` (from `useTheme()`, persisted as `ugrads-sidebar`) is the
user's own preference and **wins at every breakpoint**, so "icons only" stays
true on a 4K screen. Without it, width is still responsive: `lg → xl` is an icon
rail because labels do not fit, `xl+` shows labels. The toggle lives in the
TopBar beside the brand, and `AppShell` mirrors the width in its left padding
(`lg:pl-[108px]`, `xl:pl-[280px]` only while expanded).

Rail destinations: **Menu** — Home · Explore · Jobs · Messages;
**Campus** — Events · Departments · Emergency · Notifications; footer —
Settings · the viewer's profile. **Seeking is not a rail item**: it is a mode
of Jobs (the `Hiring | Seeking` pill), so `/jobs/seeking` lights Jobs — a
second row for one surface split it in two. Home's quick actions still offer
it as a shortcut. Active state is **computed per item** (`match(location)`),
not left to `NavLink`: Departments lives at a *query*
(`/network?segment=Departments`) that `NavLink` cannot see. Exactly one row
is ever lit.
- Home's quick-action row carries six destinations — Network, Jobs, Seeking,
  Events, Messages, Emergency — drawn as 32×32 line-art in
  `components/icons/CustomIcons.jsx`. Keep new icons in that style: 2.5 stroke
  for the outer shape, 2 for interior detail, and check them at 36px before
  shipping (fine detail blobs at that size).

Pages must:

```jsx
import { PageContainer, PageHeader } from '../../components/layout/AppShell';

<PageContainer width="default|narrow|wide" className="animate-fade-in">
  <PageHeader title="Jobs" subtitle="...">{/* right-side actions */}</PageHeader>
  ...content...
</PageContainer>
```

**One frame for every route.** `PageContainer` is always `max-w-6xl` — it takes
no width prop. Pages vary their *internal* composition, never their frame, so
the content's left edge never shifts as you navigate (mixed 768/1024/1280
containers were the single biggest source of "unpolished").

- Feeds/dashboards: use the full frame, with grids inside.
- Detail routes: `lg:grid-cols-3` inside the frame — content + sticky rail.
- Forms and long reading: wrap the body in `<FormColumn>` (`max-w-2xl`,
  centred) so fields keep a comfortable measure inside the constant frame.

`main` is `min-h-screen` on mobile and `min-h-[calc(100vh-68px)]` on desktop
(the sticky TopBar owns those 68px). A route that must fill the viewport without
scrolling the page — the messages split view — passes `fullHeight` to
`PageContainer`, which cancels the shell's desktop bottom gutter.

**Detail headers** use `<DetailHeader title onBack accent>{actions}</DetailHeader>`:
one left-aligned cluster. Mobile's centred title spreads apart and loses its
relationship to the back button once the bar is 1000px wide. Don't repeat the
hero card's subtitle in the header.

- Feed pages: card grids `grid grid-cols-1 md:grid-cols-2 gap-5`
  (never a single narrow mobile column on desktop).
- Detail pages: two-column `lg:grid-cols-3` with a
  sticky action rail (`sticky top-[92px]`) replacing the mobile bottom CTA bar; on
  mobile keep a fixed bottom CTA (`fixed bottom-0 inset-x-0 lg:hidden p-4 pb-6 ${t.glass} border-t z-30`).
- A mobile centred stack (avatar over name over meta over actions) must become a
  **row** from `sm` up. Stretched across a 1100px frame it reads as a tall ribbon
  of centred text with a dead band beside it.
- Horizontal rails that overflow their column get `rail-fade` so the cut reads as
  "scroll for more" rather than clipping. `ChipTabs` wraps on `lg` by default
  (`wrap={false}` to keep it a rail).
- Detail pages start with a back control: `IconButton icon={ArrowLeft}` calling `useCloseTo('/parent')`.
- Horizontal mobile rails become grids on `lg`; horizontal scroll only for
  moments and recommended rails.
- Bottom sheets → `Modal` / `ActionSheetModal`; small anchored menus → `DropdownPanel`.
- Never `absolute inset-0` page overlays (that was the phone frame); routes replace overlays.
- Full-screen immersive routes (moment viewer) use `fixed inset-0 z-[95]`.

## 3a. Image ratios — do not re-proportion for desktop

Thumbnails keep the **mobile** proportions at every breakpoint. Mobile derives
them from a 430px frame with `px-5` gutters (390px of content), so on the web
they are expressed as ratios, not fixed heights:

| Surface | Mobile geometry | Web class |
|---|---|---|
| Featured carousel | 390 × 240 | `aspect-[13/8]` |
| Event card (standard) | 390 × 144 | `aspect-[65/24]` |
| Event card (recommended/rail) | 260 × 112 | `aspect-[65/28]` |
| Event details hero | 430 × 260 | `aspect-[43/26]` |
| Event card (compact) thumb | 56 × 56 | `w-14 h-14` |
| Chat image message | 220 × 220 | fixed square |
| Moment viewer | 9:16 | `aspect-[9/16]` |

Two rules keep those ratios from silently breaking:

1. The aspect box is `relative shrink-0 overflow-hidden`, and the image inside is
   `<SmartImage>`, which fills it **absolutely**. An in-flow `<img>` with
   `h-full` feeds its intrinsic height into the flex base-size calculation and
   the box stretches — cards in an equal-height grid row are where this shows up.
2. Never swap a ratio for a taller fixed height on desktop. If the ratio-correct
   height is too large, constrain the *column* (Events home puts the carousel in
   a main + rail grid), not the ratio.

`SmartImage` also degrades a dead URL to a themed placeholder instead of the
browser's broken-image glyph — remote demo assets do expire.

## 4. Route map (basename `/webapp`)

Auth (in `AuthLayout` phone-width panel): `/welcome`, `/auth/role`, `/auth/login`,
`/auth/signup`, `/auth/otp`.

App (in `AppShell`): `/home` · `/network` (`?segment=Alumni|Student|Faculty|Departments`) ·
`/network/:userId` · `/departments` (redirects into the directory segment) ·
`/departments/:deptId` (`?tab=students|alumni|faculty`) ·
`/departments/:deptId/manage` (Official/Admin only; others bounce to the hub) · `/jobs` ·
`/jobs/post` (`?as=:deptId` posts as a department hub) · `/jobs/seeking` · `/jobs/seeking/new` · `/jobs/seeking/my-posts` ·
`/jobs/seeking/:talentId` · `/jobs/:jobId` · `/events` · `/events/browse` ·
`/events/calendar` · `/events/my` · `/events/create` (`?as=:deptId` hosts as a department hub) · `/events/:eventId` ·
`/emergency` · `/emergency/donors/:bloodGroup` · `/emergency/requests/:requestId` ·
`/messages` (index = empty pane, `:chatId` = chat, split-view ≥lg; `:chatId` also
resolves the department channels `dept-:deptId-broadcast` / `dept-:deptId-helpdesk`
and the admin-only help-desk threads `hd-*`) · `/messages/settings` (modal route if added) ·
`/notifications` · `/profile` · `/profile/settings/:section` ·
`/moments/create` · `/moments/note/:momentId` · `/moments/:momentId`.

Navigation is always `useNavigate()` / `Link` — never internal view state for
things the mobile app treated as screens.

## 5. Data

All demo data lives in `src/data/*` (`people, jobs, events, moments, emergency,
notifications, conversations, departments`) with `findXById` helpers, and the seeking module's
`constants/utils/data` in `src/features/seeking/`. Keep copy and records identical
to mobile — clients compare the two surfaces. `data/departments.js` is mirrored
byte-for-byte by the mobile module `../src/components/department/data.js`; edit
both or neither.

Conversation records carry one discriminator, `kind`:
`'dm' | 'broadcast' | 'helpdesk' | 'helpdesk-thread'`, defaulting to `'dm'` so
everything that predates the department hub keeps working. Department channels
are **derived** from the department record (`getDepartmentChannels(deptId)`)
rather than hand-written, so the inbox row, the hub and the thread header can
never disagree about a channel's name, reach or latest notice.

Two things persist to `localStorage` because the web reloads where the app never
did: the theme (`ugrads-theme`) and the demo session (`ugrads-session`, holding
`isAuthed` + `authRole`). Without the latter, refreshing or opening a deep link
would bounce the user back to `/welcome`. Two per-viewer conveniences ride
along: the sidebar width (`ugrads-sidebar`) and the Directory view modes
(`ugrads-directory-view`, `{ people, departments }`). Every read and write is
wrapped in try/catch and falls back to the defaults. Everything else is
in-memory demo state, exactly like mobile.

## 6. Voice & fidelity rules

1. When in doubt, open `../src/App.jsx` and port the exact classes.
2. Light AND dark mode must both be checked for every element (use `t` + `isDark`).
3. Every interactive element: hover state, `active:scale`, `focus-visible` ring, `aria-label` on icon-only buttons.
4. Empty states use `EmptyState` with the same copy as mobile.
5. Role gating matches mobile: post-job = alumni/faculty; seeking-create = student; apply = student.
6. Department gating goes through `getDepartmentAccess` only. The broadcast
   channel is **read-only for members** — show the "Only admins can send
   messages here" notice rather than a bare disabled field, and never offer
   Leave on an auto-enrolled channel (Mute only).
7. Dual-Broadcast (`Send to Registered Email`) is off by default, resets after
   every send, states its blast radius in words when armed, and raises a
   confirm step before sending. Mass irreversible outbound always gets a
   second tap.

The full IA for this surface — roles, placement decisions, the messaging
asymmetry and what was deliberately left out — is
[`../DEPARTMENT_HUB_IA.md`](../DEPARTMENT_HUB_IA.md).

## 7. Checks before you ship

```bash
npm run lint     # react-hooks rules catch conditional hooks, refs/setState in render
npm run build    # must pass clean
```

The lint config exempts PascalCase identifiers from `no-unused-vars` (components
referenced only inside JSX read as unused without `eslint-plugin-react`) and turns
off `react-refresh/only-export-components`, since the design system deliberately
ships tokens and helpers next to their providers.

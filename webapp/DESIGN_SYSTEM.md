# Ugrads Web — Design System & Build Contract

The web app is a 1:1 visual port of the shipped Ugrads mobile app (`../src/App.jsx`),
re-architected for desktop with proper routing. **Every page must follow this document.**

## 1. Foundations

### Moments camera and viewer

The shared Moments experience (`../src/shared/InstantExperience.jsx`) is an
immersive black media surface in either theme, with Ugrads blue state accents and
Plus Jakarta Sans. The top row retains a stacked Moments entry; avatars open that
author's unexpired Moments (including already viewed photos), while the stack
contains only unseen photos. Note bubbles open Notes. Creation offers Notes and Moments;
Stories remain inactive with their design retained for a future release.
The viewer fits one dynamic viewport without vertical scrolling. Its tap-to-advance
depth deck places queued cards on the right, the active card in the centre and
blurred viewed cards on the left. Tapping advances from right to left. Quick reactions form a horizontal pill directly
above Reply. Four compact SVG frame choices use curved corner captions, defaulting
to the top left; there are no freeform caption-position controls. Capture uses a
floating share pill and a flexible media stage, with side-by-side media/controls
on short landscape screens. All Moments, including saved captures, expire after
24 hours. Keep the header title
strictly Moments and retain Close, Info, Archive and Camera utilities.
The mobile prototype's dialog must match its home canvas (430px maximum, full
available height, square edges), even on a desktop monitor. Use the shared
`--ugrads-app-width` token rather than a wider independent modal width.
The row and chooser keep normal theme tokens. Use the existing spring curve for
transform/opacity motion and respect reduced motion. Received Moments remain in
the top-row experience; do not add a feed card or global navigation item.
See `../INSTANTS.md` for behaviour and the browser prototype's limits.

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
- `Field, FieldLabel, FieldHint, TextInput (icon), TextArea, SearchInput (value, onChange, onClear)`
- `Select` — **the product's only dropdown** (`options`, `value` | `defaultValue`, `onChange(value)`, `aria-label`). `SelectInput` is the same component with the old `<option>`-children API. Never ship a native `<select>`: the OS draws its menu (square corners, system font, system-blue highlight), which broke the design system. The panel is the filter-menu panel (`DropdownPanel` / `DropdownItem` styling — rounded-xl, p-2, rounded-lg rows, selected row solid `#1D9BF0` with a check); the trigger keeps input geometry (h-12 rounded-xl) so a row of inputs and selects shares one height. It renders in a portal (never clipped by a modal), flips upward near the viewport bottom, and keeps the native keyboard contract (↑/↓/Home/End, Enter/Space, Esc, type-ahead). Mobile mirror: `../src/components/ui/Select.jsx`.
- Buttons beside inputs use `size="md"` (h-12, the input height) — never `lg` (h-14) in a field row.
- `Avatar` (`size xs–3xl`, `online`), `RoleAvatar` (`role: Student|Alumni|Faculty|Staff`), `Verified`, `RoleTag`
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
- Home's quick-action row carries six destinations — Network, Jobs,
  Departments, Events, Messages, Emergency — drawn as 32×32 line-art in
  `components/icons/CustomIcons.jsx`. Seeking left the row as it left the
  rail (it is a mode of Jobs); Departments took the slot with
  `CustomDepartmentsIcon` and the label "Depts" below `sm`, where six labels
  share ~55px each. Keep new icons in that style: 2.5 stroke
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
| Home ad carousel | 390 × 130 | `aspect-[3/1]`, capped `max-w-3xl`; slide content sized in `cqw` of the 390px design so it scales with the slot |
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

## 3b. Event creation

`/events/create` (and the mobile `CreateEventScreen`) is five numbered
sections in the order an organiser decides things, then the details:

1. **The event** — title, category (`Other` reveals "Name the category"), capacity.
2. **Organizers** — ONLY the entities typed in under "Add an Organizer",
   each with an **Organizer Type** (Club, Department, University Office,
   External Partner, Individual), shown as removable chips "Mahfuz Ahmed ·
   Club". At least one is required. The publishing account is never added
   implicitly; an "Add myself as an organizer" link adds it when it really is
   one.

   **Posted by** is separate, read-only metadata at the top of the form —
   derived from the publishing account (you, or the department with `?as=`),
   never typed and never counted as an organizer. There is no "Host" in this
   flow. On Event Details the two read as **Organized by:** (lead organizer
   + co-organizers) and **Posted by:**. Event records carry `organizer`
   (lead), `coOrganizers[]` and `postedBy { name, role }`;
   `getEventOrganizers(event)` returns the full list.
3. **When** — Starting + Ending date. The range alone sets the length,
   echoed as "3-day event · Thu, Oct 1 – Sat, Oct 3". Picking a start fills
   an empty end with the same day.
4. **Registration deadline** — a date AND a time (default 11:59 PM),
   previewed as "October 1, 2026 - 11:59 PM".
5. **Event schedule** — generated from the range: one section per day
   ("Day 1 · October 1, 2026 · Thursday"), each with any number of
   activities (start time, end time, details). Activities are keyed by day
   number, so correcting the dates keeps Day 1's agenda on Day 1.

The date/schedule rules live in `features/events/eventForm.js` (mirrored by
`../src/components/events/eventForm.js`): local-date parsing, inclusive day
count, a 31-day cap, and `validateEventDraft` (title, "Other" named, range
valid, deadline not after the event ends, no activity ending before it
starts). Errors appear inline and as a summary only after a publish attempt —
except the deadline and an over-long range, which warn as soon as they happen.

## 4. Route map (basename `/webapp`)

Auth (in the responsive split `AuthLayout`): `/welcome`, `/auth/role`, `/auth/login`,
`/auth/signup`, `/auth/otp`.

App (in `AppShell`): `/home` · `/network` (`?segment=Alumni|Student|Faculty|Departments`) ·
`/network/:userId` · `/departments` (redirects into the directory segment) ·
`/departments/:deptId` (`?tab=students|alumni|faculty`) ·
`/departments/:deptId/manage` (Official/Admin only; others bounce to the hub) · `/jobs` ·
`/jobs/post` (`?as=:deptId` posts as a department hub) · `/jobs/seeking` · `/jobs/seeking/new` · `/jobs/seeking/my-posts` ·
`/jobs/seeking/:talentId` · `/jobs/:jobId` · `/events` · `/events/browse` ·
`/events/calendar` · `/events/my` · `/events/create` (`?as=:deptId` posts as a department hub) · `/events/:eventId` ·
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
to mobile — clients compare the two surfaces. `data/departments.js` and the mobile module `../src/components/department/data.js`
keep identical seed records with surface-specific imports. Dynamic metadata, ownership,
assignments, staff identities and new events come from `../src/shared/departmentStore.js`.

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


## 8. Department workspace and university staff

The revised IA in `../DEPARTMENT_HUB_IA.md` supersedes the former faculty-only
Official/Admin rules. Super Admin is the department owner; delegated permissions
are Primary Admin, Broadcast/Event Publisher and Help Desk Operator. Resolve by
identity, never by academic role. Use `canBroadcast`, `canCreateEvent`,
`canHelpDesk`, `canEditMetadata`, `canGrantAccess` and `canTransfer` at each action.

Shared components live in `../src/shared/DepartmentExperience.jsx` and receive
`t` / `isDark` explicitly so they render identically on both surfaces. Staff use
teal circular identity marks; department code marks remain square. Staff profile
and directory cards lead with designation, affiliation and office, not academic
stats. The fourth signup option is University Staff / Official.

Public View / Admin View reuses the travelling segmented pill. Inside the
workspace: Overview, Team & access, Page settings. No new global nav destination.
Shared layouts use container queries so the 430px mobile prototype does not pick
up desktop grids when shown on a wide monitor. The web Vite build scans shared
source and deduplicates React to preserve one hook dispatcher.

Confirmation dialogs use native modal focus containment, Escape dismissal and
return focus. The shared Select portals inside an enclosing dialog when present,
keeping its listbox in the browser top layer. Destructive access removal and
ownership transfer require explicit confirmation; ordinary metadata saving does not.

A small Prototype control is review chrome. It is available on auth and signed-in
screens, labels simulated delivery, and switches identities without resetting
permission changes. Reset is explicit. New prototype state lasts for this page session.


## 9. October 2026 revisions: onboarding, discovery and workspace

The combined scope and verification record is in `../REVISIONS.md`.

- Web onboarding uses a full-height split at desktop widths (1024px+),
  with a 400–460px right panel and a centered 384px inner column (336px controls). The left carousel uses the local Hogwarts-style
  vector line art, three community messages, explicit previous/next buttons
  and labelled pagination. It does not auto-advance. The form column keeps the
  existing welcome → role → signup → OTP and login routes. Long forms scroll
  naturally; below 1024px, only the form column remains. Mobile prototype auth
  is unchanged. The old centred phone-frame auth convention is superseded.
- Public Directory has four lenses: Alumni, Student, Faculty, Departments.
  Staff keep their identity, signup and profiles; assigned staff are discoverable
  through Department Officials, and administrators can find them in team access.
  Department owners additionally see a Staff directory lens, resolved through
  identity-based `isOfficial` access. For everyone else, a legacy `?segment=Staff`
  URL falls back to Alumni without exposing staff results.
- Home uses shared `HomeCareerSections`. Alumni/faculty see job-seeking requests
  before offerings; students see offerings before requests. The compact request
  register shows three active posts, circular person marks, separate save actions
  and a link to the full Seeking feed. DOM order matches visual/keyboard order.
- Department workspace uses the shared `department-workspace.css` tokens:
  blue for broadcasting, violet for calendar tools, amber for support and teal
  for page editing. These are local workspace wayfinding accents; public event
  and entity colours retain their existing meanings. Tone, icon and label work
  together, never colour alone. Count cards, action tiles, support rows and a
  compact team rail have different compositions. The entity mark stays square;
  team avatars stay circular. Container queries keep the phone canvas correct
  on wide screens. Existing permission checks and confirmations still apply.

### Compact web onboarding density

The right onboarding column uses 40px controls, 22px page headings, compact role
cards and 6–10px field gaps on desktop. At viewport heights of 740px or less,
controls reduce to 36px and the utility header to 48px. Password/confirmation
and staff office/contact pairs share rows. Certificate upload uses a compact
horizontal layout. Standard onboarding fits at 1024 × 640 and larger without
scrolling; shorter windows or enlarged text retain natural scrolling to keep
all fields accessible. These overrides are scoped to web auth at 1024px+,
preserving mobile control sizing and the rest of the design system.

### Onboarding contrast and workspace refinement

- The Ugrads logo anchors the upper left on desktop and the mobile auth header.
- Opaque auth fields use `#f7f9fb` / `#1b232b` surfaces and `#cbd5df` / `#3a4855`
  borders in light/dark mode. Muted text uses `#586675` / `#a0acb8`. Field icons
  sit above the input surface. Secondary actions share these visible boundaries.
- Auth primary actions use the deeper Ugrads blue `#0878c4` (`#0768aa` on hover)
  for readable white button labels. Page groups center vertically when space permits.
- Department KPI cards put count and icon on one row, with 16px padding. The
  department identity and Student Help Desk cards have no colored top stroke.

### Campus branding and contact revisions — 7 October 2026

The auth shell uses `HogwartsCampus.jsx`, a local SVG that inherits the light/dark
illustration tone. The brand caption is “Your Campus Network” and the first slide
uses the campus-neutral community copy. The authenticated top bar shows the Ugrads
logotype without an institutional tagline.

Department owners alone receive nested Home/Admin links in the desktop Departments
menu; compact screens show the same links on department pages. Home selects the
Departments directory lens, Admin opens the owned department workspace. Active
state and availability follow live identity-based ownership.

Emergency contact numbers are selectable with a separate copy action; Message is
the communication action. Donor detail pages retain emergency context, and chats
show the selected donor/family and blood request rather than an unrelated thread.
The donor phone fixtures are scoped to emergency support. The mobile web request
contact panel follows the details instead of obscuring content with a fixed bar.
The four workspace KPI cards retain icon tints without decorative corner rings.

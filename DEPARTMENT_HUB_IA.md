# Ugrads — Department Hub: Information Architecture

Covers both surfaces: the mobile prototype (`src/App.jsx` + `src/components/department/`)
and the web app (`webapp/src/…`). Written before any screen, and binding on both.
Design tokens, primitives and layout rules come from
[`webapp/DESIGN_SYSTEM.md`](webapp/DESIGN_SYSTEM.md) — nothing here overrides it.

---

## 1. The problem in one line

Every object in Ugrads so far is **a person** (student, alumni, faculty) or **a
post** (job, event, moment, blood request). The brief introduces a third kind:
an **institution that behaves like an account** — it has a profile, an inbox, a
membership, and it publishes. The IA's job is to give that third kind a home
without inventing a parallel app beside the one we already shipped.

### The three things that make an Entity different from a Person

| | Person profile | **Entity profile (Department)** |
|---|---|---|
| Identity | one human, one owner | an office — **ownership is delegated and survives the human** |
| Relationship | you *connect* (symmetric, opt-in) | you are a **member** (automatic, by enrolment record) |
| Messaging | 1-on-1, symmetric | **asymmetric**: broadcast down, help desk up |

Those three rows drive every decision below. They are also why we do *not*
reuse `PersonCard`, the circular avatar, or the Connect button for departments.

---

## 2. Roles — the chain of command

Four levels, resolved per department (you can be an Official of CSE and a
plain visitor to BBA at the same time):

| Level | Who | Can |
|---|---|---|
| **Official** | one verified faculty — head / lead coordinator | everything an Admin can, **plus** grant & revoke Admin Access, edit the hub profile, hold the Department ID |
| **Admin** | verified faculty of that department, delegated by the Official | broadcast (incl. dual-send), answer Help Desk, post jobs & blood requests as the department |
| **Member** | every student / alumni / faculty enrolled in the department | read the Broadcast channel, open the Help Desk, browse the directory |
| **Visitor** | any signed-in user, other departments | browse the hub and directory, open the Help Desk |

Single resolver, one per app — **never re-derive permissions in a screen**:

```js
getDepartmentAccess(dept, authRole) → { level, isOfficial, isAdmin, canManage, isMember }
```

**Demo mapping** (keeps the prototype honest with three login roles): all three
demo identities belong to CSE. `faculty` → Official of CSE, `student` /
`alumni` → Member of CSE, everyone → Visitor elsewhere. Clients see both the
admin and the read-only surface by switching login role, exactly as they do for
job posting today.

**Revocation is the Official's alone, and the Official cannot be revoked.**
That rule is visible in the UI, not just enforced — the Official's row in Admin
Access carries a master-key mark and no destructive action.

---

## 3. Where the department lives (placement decisions)

### 3.1 Discovery — one directory, four lenses

The Explore/Directory tab already answers "who is in this network". A
department is *in* the network, so it becomes a fourth segment rather than a
fifth tab:

```
Directory ▸  [ Alumni ] [ Students ] [ Faculty ] [ Departments ]
```

**Rejected:** a top-level "Departments" nav item. The bottom capsule holds five
items and is at parity with the shipped app; a sixth breaks it, and departments
are browsed rarely and entered mostly by *link*, not by *hunting*.

### 3.2 Entry points (a hub is arrived at, not searched for)

| From | Affordance |
|---|---|
| Directory ▸ Departments | **Your department** panel + the department register (§3.4) |
| Any person's profile / card | the **department chip is a link** to that hub |
| Messages | the broadcast channel header links to the hub |
| Profile tab | **My Department** row — the one-tap path for members |
| Notifications | a broadcast notification deep-links to the channel |

### 3.3 Route map (web) / overlay map (mobile)

| Web route | Mobile equivalent | Access |
|---|---|---|
| `/network?segment=Departments` | `DirectoryTab` 4th segment | all |
| `/departments` | — | redirect → the segment above |
| `/departments/:deptId` | `DepartmentProfileOverlay` | all |
| `/departments/:deptId/manage` | `DepartmentManageOverlay` | Official / Admin (others bounce to the hub) |
| `/messages/dept-:deptId-broadcast` | `ChatOverlay kind='broadcast'` | members read, admins write |
| `/messages/dept-:deptId-helpdesk` | `ChatOverlay kind='helpdesk'` | any user ↔ admins |
| `/messages/helpdesk-:threadId` | `ChatOverlay kind='helpdesk-thread'` | Admin only |
| `/jobs/post?as=:deptId` | `PostJobOverlay asDepartment` | Official / Admin |
| `/events/create?as=:deptId` | `CreateEventScreen postAsDept` | Official / Admin |

Job posting and blood requests **reuse the existing modules** with a department
identity attached. Forking them would give the campus two job boards, which is
the exact opposite of brief §4 ("full access to the broader ecosystem").

### 3.4 The Departments lens — a register, not a card grid

The first build rendered departments as the same blue gradient card as people,
with a square avatar swapped in. It was correct and monotonous: four departments
looked like four people, which contradicts §1 — a department is a different
*kind* of object, and the directory should show it before the user reads a word.

People are cards because you **size a person up** before connecting. A
department is an office you **look up**, so the lens borrows from the lobby
directory board and from LinkedIn's Pages list rather than from profiles:

```
┌ Your department ───────────────── [Member | Official] ┐
│ [CSE] Computer Science & Engineering                   │
│ 📣 Latest notice · 35m ago · Also emailed              │
│    URGENT: Registration closes tonight…                │
│ [ Open hub ↗ ]  [ Message | Manage ]                   │
└────────────────────────────────────────────────────────┘
┌ All departments ────────────────────── ✓ Verified by NSU ┐
│ SCHOOL OF ENGINEERING & PHYSICAL SCIENCES            2 │
│ [CSE] Computer Science & Engineering ✓   SAC 1042  ✉  › │
│       12,122 members · Est. 1993          OFFICE        │
│       [2 open roles] [1 blood request]                  │
│ [ECE] Electrical & Computer Engineering ✓ SAC 0915 ✉  › │
│ SCHOOL OF BUSINESS & ECONOMICS                       1 │
│ …                                                       │
└─────────────────────────────────────────────────────────┘
```

Decisions worth naming:

1. **Membership leads.** The one relationship a person can't have — you are
   *in* a department — gets its own panel above the list, carrying the thing a
   member checks most (the latest notice) rather than a stat row.
2. **Grouped by school.** It is the university's real org chart and how
   students already navigate campus; it also scales to ~15 departments where a
   flat card grid would become a wall.
3. **Rows differ where departments differ.** Signal chips (upcoming events,
   open roles, blood requests) render only when true, so an active department reads as active at
   a glance. Always-on decoration (Est. year pill, dashed stat strip) moved to
   the hub, where it's context rather than noise.
4. **The room number is a first-class fact.** "Where do I physically go?" is
   the question a directory of offices answers; on desktop it gets its own
   right-aligned column, like a lobby board.
5. **Verification is said once**, in the list header, not per row — every
   department is verified, so repeating it carried no information.
6. **Card ⇄ list is the viewer's choice, remembered per kind.** The
   directory grows every term, so every lens has a view toggle on its results
   line. People default to cards, departments to the register, and each
   keeps its own mode — switching the people lens to a list never turns the
   department register into tiles. Department card mode keeps the register's
   grammar (code tile, signals, office footer, grouped by school), so it
   still reads as an office, not a person.

---

## 4. The Department Hub page — content order

Brief §3 fixes the top of the page. The rest follows the design system's
detail-route rule (`lg:grid-cols-3`, content + sticky rail).

```
┌─ Identity hero (entity) ───────────────────────────────┐
│ NSU crest · Dept name · code · school · ✅ Verified     │
│ Faculty / Students / Alumni  stat row                   │
│ [ ✉ Message Department ]  [ Broadcast ]  [ Share ]      │
│ (Official/Admin only) ── Managing as Official ▸ Manage  │
└─────────────────────────────────────────────────────────┘
┌─ About ── the Department Description (brief §3) ───────┐
└─────────────────────────────────────────────────────────┘
┌─ Directory ── [ Students ] [ Alumni ] [ Faculty ] ─────┐
│ search + scrollable profile cards                       │
└─────────────────────────────────────────────────────────┘
        rail (lg+) / stacked below (mobile):
        · Contact & office hours
        · Department officials (Chair first, then Official + Admins)
        · Upcoming events posted by this department
        · Open positions from this department
        · Active blood requests
```

**UX decisions worth naming**

1. **Directory tabs scroll with the list.** They were pinned at first — on a
   3 000-student department the tab row scrolls away instantly, so keeping the
   cohorts reachable looked like the obvious win. In use it wasn't: a control
   strip that detaches mid-scroll and then hangs over the roster reads as a
   glitch, and what it covered was exactly the cards you came to read. The row
   now sits in the flow as a normal block. If reaching the cohorts from deep in
   a long roster becomes a real complaint, the fix is a scroll-to-top control,
   not a floating strip.
2. **The member count is a fact, not decoration.** The stat row doubles as the
   tab count, so "Students 3,120" and the Students tab never disagree.
3. **Help Desk is the high-contrast primary action** (brief §2 of the flows) —
   it is the only thing a confused student actually needs from this page.
   Broadcast is secondary: you don't "enter" a channel you're already in.
4. **Admins get a strip, not a different page.** The management entry sits in
   the hero as a labelled band ("You are the Department Official"), so an admin
   always sees the public page exactly as students see it, plus one door.
5. **The roster scales.** Departments grow every term, so the web roster
   carries the Directory's card ⇄ list `ViewModeToggle` on its results line
   (sharing the remembered `people` mode) and pages in 12 at a time behind a
   "Show more" button instead of rendering every member at once.
6. **The Chair leads the officials.** Who leads the department (the Chair),
   who holds the hub's master key (the Official) and who helps run it (the
   Admins) are three questions, so three fields — `chairId`, `officialId`,
   `adminIds` — resolved in order by `getDepartmentLeadership`. The Chair is a
   tinted tile at the top, the one a student, parent or recruiter is looking
   for; one person answering two questions is one entry carrying both titles.
7. **Events are published like jobs.** A department posts events on the one
   campus calendar: an event carries `deptId`, so it appears in Events *and*
   on the hub, in the directory's signal chips and in the Manage console —
   never on a second, department-only calendar. Officials/Admins create them
   through `/events/create?as=:deptId`, which makes the department the
   event's **Posted by** account. Organizers are still only what they add
   (the department can be one via "Add CSE Department as an organizer").

---

## 5. Messaging model — the asymmetry, drawn

Three channel kinds land in the **existing** Messages tab. No new tab.

```
Messages
├─ 📌 CSE Department            ← broadcast, auto-enrolled, pinned, read-only
│     "Only admins can send messages here."
├─ 🛟 CSE Help Desk             ← the member's 1-on-1 thread with the admins
└─ … ordinary DMs
        Admin view adds a third segment:
        [ All Chats ] [ Requests ] [ Help Desk ⑶ ]   ← incoming student threads
```

| | Member sees | Admin sees |
|---|---|---|
| Broadcast | composer replaced by a locked notice | full composer **+ `[ Send to Registered Email ]` toggle** |
| Help Desk | one thread, "CSE Department" as the peer | an inbox of student threads, each 1-on-1 |

**Auto-enrolment** is an IA claim, not a feature toggle: the channel is present
in the inbox from account creation, it has no Join button, and its context menu
offers Mute — never Leave. Leaving would break the university's only guaranteed
reach.

### 5.1 The Dual-Broadcast toggle — designed as a weapon with a safety

Sending to every registered email is **mass, outbound and irreversible**. So:

- the toggle sits next to Send, **off by default**, and it is sticky-off — it
  resets after every send, so urgency is opted into per message, not left on;
- when armed, the composer changes colour and states the blast radius in words
  ("Also emails 11,840 members");
- pressing Send while armed raises a **confirm step** naming the audience and
  the count. One tap to write, two to email 12 000 people.
- sent messages that went dual carry an "Emailed" mark in the thread, so the
  channel's own history is the audit log.

### 5.2 Entity avatars

Departments use a **rounded-square** avatar with the NSU crest / building mark
in the department accent; people keep circles. One glance separates an official
notice from a classmate — the distinction is load-bearing across Messages,
Notifications, the directory and job cards.

---

## 6. Manage console — `/departments/:deptId/manage`

Three sections, one page (a wizard would be wrong for something visited to do
one small thing):

| Section | Official | Admin |
|---|---|---|
| **Overview** — help-desk backlog, broadcast reach, quick actions (New broadcast · Open Help Desk · Create event · Post job · Post blood request) | ✅ | ✅ |
| **Admin Access** — current team, grant to a verified faculty member, revoke | ✅ grant + revoke | 👁 read-only roster |
| **Department Profile** — description, contact, office hours, **Department ID** | ✅ | 👁 read-only |

The Department ID is shown as the Official's master-key card: read-only,
copyable, never editable inline. Transferring the Official role is explicitly
**out of scope for this build** — it needs a university verification step, and
faking one in a prototype would misrepresent how secure the handover is.

Help Desk and Broadcast are *not* duplicated here; they live in Messages, per
brief §1 ("Where it goes: inside the user's normal Messages/Inbox tab"). The
Overview links to them.

---

## 7. Data model

```js
department = {
  id, code, name, school, departmentId,     // departmentId = the official ID the Official holds
  verified, about, established,
  chairId,                                  // the Department Chair — tops the officials list
  office, email, phone, website, officeHours,
  accent,                                   // reuses getDeptStyle()
  stats: { students, alumni, faculty },
  officialId, adminIds: [],                 // → people records
  broadcastChannelId, helpDeskId,
  memberCount, emailReach,
}
```

Conversation records gain **one discriminator**, `kind`:
`'dm' | 'broadcast' | 'helpdesk' | 'helpdesk-thread'`, plus `deptId`, `pinned`,
`readOnly`. Everything already in the inbox keeps working because `kind`
defaults to `'dm'`.

Demo data lives in `webapp/src/data/departments.js` and
`src/components/department/data.js` — **identical records**, per the design
system's §5 rule (clients compare the two surfaces side by side).

---

## 8. What this build deliberately leaves out

Flagged rather than silently dropped:

- **Transferring the Official role** — needs real university verification (§6).
- **Per-department notification preferences** beyond Mute — belongs with the
  global notification settings redesign, not here.
- **Broadcast scheduling / drafts** — not in the brief; adds a state machine
  (draft → scheduled → sent) that would need its own IA pass.
- **Multi-department membership** (double majors, joint appointments) — the
  model supports it (`adminIds` is per department, access resolves per
  department), but no screen exposes a department switcher yet.

# Ugrads — Department Hub & Staff: Information Architecture

Applies to the mobile prototype at `/` and the routed web app at `/webapp`.
Updated for **Ugrads New Feature.pdf**. This supersedes the earlier faculty-only
Official/Admin model. Design foundations remain in `webapp/DESIGN_SYSTEM.md`.

## 1. Product scope

A department is an institutional entity inside Ugrads: a public hub, a broadcast
channel, a student Help Desk, and a workspace for assigned teammates. It is not a
separate platform administration product. Department creation and review of
ownership requests remain outside this prototype, with Ugrads platform admins.

The implementation is an interactive UI/UX prototype. Staff email verification,
ownership requests, delegation, transfers, publishing and messages are simulated.
No real email is delivered. New state lives for the current page session; the
existing theme and login-role persistence remain unchanged.

## 2. Identity and permissions

Academic identity and department permission are separate. Being faculty or staff
never grants management access by itself. Access resolves against a person's ID,
the department's single owner, and its explicit assignments.

| Department permission | Broadcast / events | Help Desk | Page metadata | Team delegation | Transfer ownership |
|---|---|---|---|---|---|
| Super Admin (owner) | Yes | Yes | Yes | Yes | Yes |
| Primary Admin | Yes | Yes | Yes | No | No |
| Broadcast / Event Publisher | Yes | No | No | No | No |
| Help Desk Operator | No | Yes | No | No | No |
| Member / visitor | No | Own conversation only | No | No | No |

The shared pure resolver is `src/shared/departmentModel.js`. Both access adapters
call the same `currentAccess` function from `src/shared/departmentStore.js`.
Specific actions use their specific capability, not the general `canManage` flag.
Frontend gates communicate the product rules; production requires backend
identity verification, authorization and audit logging.

## 3. Ownership

An unowned department exposes **Request Ownership** to verified faculty. The
request form provides department context and an optional reason. Submission
changes to a pending-review state without granting access. Owned pages never
show this entry point.

Only the active owner sees **Transfer ownership** in Page settings. Search finds
verified members by name, NSU ID or email. The confirmation names the next owner
and explains the consequence: ownership moves atomically; the previous owner
remains a Primary Admin and loses delegation/transfer controls. There is always
one owner. An owner cannot revoke themselves through the teammate list.

## 4. Navigation and page hierarchy

- Directory lenses: Alumni, Students, Faculty, **Staff**, Departments.
- Departments retain their school-grouped register and optional card view.
- Public hubs preserve identity, description, directory, contact details,
  leadership, events, jobs and blood requests.
- Assigned teammates see an explicit **Public View / Admin View** control.
- Both states retain the same department identity. The workspace has three tabs:
  **Overview**, **Team & access**, **Page settings**.
- On web, public and admin states remain separate URLs. Mobile uses overlays.

| Route | Purpose |
|---|---|
| `/network?segment=Staff` | Staff directory with title, affiliation and office |
| `/network/:userId` | Public person profile; staff use office/contact hierarchy |
| `/departments/:deptId` | Public hub and ownership-request state |
| `/departments/:deptId/manage` | Assigned teammate's workspace |
| `/messages/dept-:deptId-broadcast` | One-way department broadcast |
| `/messages/dept-:deptId-helpdesk` | Member's private conversation |
| `/messages/hd-*` | Assigned support teammate's student conversation |
| `/events/create?as=:deptId` | Department event creation |

## 5. Workspace

**Overview** prioritizes the tasks relevant to the current permission. Publishing
roles see Broadcast and Create event. Support roles see the student backlog.
Owners and Primary Admins can edit page details. Student conversations support
open/resolved status, reopening and replies through the existing Messages UI.
Reply history survives navigating away during the session.

**Team & access** separates the owner from delegated teammates. Search covers
verified faculty, students/TAs, alumni and university staff. Adding a person
requires a permission selection (least-privilege Help Desk Operator by default).
Existing permissions can be changed; removing access requires confirmation and
updates that identity's workspace immediately. Non-owners see the roster read-only.

**Page settings** edits the description, cover banner, office location, office
hours, office email and contact/extension. Banner upload accepts JPG, PNG or WebP
up to 5 MB and previews before saving. Save updates the public hub. Ownership
transfer is a separate, owner-only section so routine editing cannot trigger it.

## 6. Staff journey

Registration adds **University Staff / Official** beside Student, Alumni and
Faculty. Collect full name, designation, department/office affiliation and office
location; extension is optional. Do not ask for a major, batch or course list.
Require the exact `@northsouth.edu` email domain. The prototype OTP is explicitly
labelled `123456`, with invalid-code feedback and a simulated resend.

The signed-in staff home leads with their assigned department workspace(s).
An unassigned staff member sees:

> You are not assigned any role. Please ask your respective official to assign you.

Verification and assignment are separate milestones. The empty state provides
entry points to their profile and the department directory. Public staff profiles
prioritize designation, affiliation, office location and official contact details;
people retain circular avatars, while departments retain square code tiles.

## 7. Communication and publishing

Broadcast and Help Desk remain in Messages. Members cannot write broadcasts.
The email toggle is off by default, resets after sending and retains the existing
confirmation showing audience reach. It simulates delivery only.

Department events use the existing five-section event form. Published records
carry `deptId` and enter the same event collection consumed by the hub, browse
feed and campus calendar. The publishing account and organizer list stay separate.
Jobs and blood requests reuse their existing modules for owners/Primary Admins.

## 8. Shared implementation and review

`src/shared/DepartmentExperience.jsx` contains the shared workspace, staff forms,
profile, directory, ownership entry and reviewer panel. Small wrappers adapt it to
web routes or mobile overlays. Theme tokens, the existing Select and travelling
segmented pill maintain parity; container queries adapt to the actual phone frame,
including when it is reviewed in a desktop browser.

The floating **Prototype** panel switches Student, Alumni, owner, ordinary faculty,
Primary Admin, Publisher, Help Desk, unassigned staff, and faculty viewing an
unclaimed department. It provides Home, Department, Staff signup, theme and reset
controls. These review controls are outside product navigation and clearly labelled.

CSE seeds one owner (Dr. Aminul Islam), a faculty Primary Admin and three assigned
staff identities. Architecture is unowned. Scenario selection changes identity,
not grants: after a transfer or revocation, switching back faithfully shows the
new permissions. Reset restores the initial fixture.

## 9. Verification

`npm test` checks the permission matrix, department isolation, delegation,
revocation, single-owner transfer, ownership claims, metadata and email validation.
Both apps require production builds. Browser review covers desktop and phone
widths, light/dark themes, onboarding, delegation, transfer, publishing and private
support. Platform administration and real delivery are intentionally out of scope.

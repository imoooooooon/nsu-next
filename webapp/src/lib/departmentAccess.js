import { Building2, Landmark, ShieldCheck, KeyRound } from 'lucide-react';

/* ---------------------------------------------------------------------------
   Department access — the single resolver for the chain of command.
   Screens ask this; they never re-derive permissions inline.

   Official → the department head who holds the master key and the Department ID
   Admin    → a verified faculty member the Official delegated access to
   Member   → any student / alumni / faculty enrolled in the department
   Visitor  → any other signed-in user

   Demo mapping: all three demo identities belong to CSE, so a `faculty` login
   is the Official of CSE and `student` / `alumni` are Members of it. Every
   role is a Visitor to the other departments — which is how a client sees the
   read-only surface and the admin surface without leaving the prototype.
--------------------------------------------------------------------------- */

export const VIEWER_DEPARTMENT_ID = 'cse';

export const DEPARTMENT_LEVELS = {
  official: { label: 'Department Official', icon: KeyRound, rank: 3 },
  admin: { label: 'Department Admin', icon: ShieldCheck, rank: 2 },
  member: { label: 'Member', icon: Landmark, rank: 1 },
  visitor: { label: 'Visitor', icon: Building2, rank: 0 },
};

export const getDepartmentAccess = (dept, authRole) => {
  const isOwnDept = !!dept && dept.id === VIEWER_DEPARTMENT_ID;

  let level = 'visitor';
  if (isOwnDept) level = authRole === 'faculty' ? 'official' : 'member';

  const isOfficial = level === 'official';
  const isAdmin = level === 'official' || level === 'admin';

  return {
    level,
    isOfficial,
    isAdmin,
    canManage: isAdmin,
    canBroadcast: isAdmin,
    canGrantAccess: isOfficial,
    isMember: isOfficial || isAdmin || level === 'member',
    label: DEPARTMENT_LEVELS[level].label,
  };
};

/* The hub's officials list, in the order it is read: the Department Chair
   first (the academic head), then the Official if that is someone else, then
   the admins the Official delegated to. One person holding two roles appears
   once, carrying both titles — a Chair who also holds the master key is one
   row, not two. */
export const LEADERSHIP_TITLES = {
  chair: 'Department Chair',
  official: 'Department Official',
  admin: 'Department Admin',
};

export const getDepartmentLeadership = (dept, adminIds) => {
  if (!dept) return [];
  const rows = [];
  const add = (id, role) => {
    if (id == null) return;
    const existing = rows.find(r => r.id === id);
    if (existing) existing.roles.push(role);
    else rows.push({ id, roles: [role] });
  };
  add(dept.chairId, 'chair');
  add(dept.officialId, 'official');
  (adminIds || dept.adminIds || []).forEach(id => add(id, 'admin'));
  return rows;
};

/* The department the signed-in demo user belongs to. */
export const getViewerDepartmentId = () => VIEWER_DEPARTMENT_ID;

/* Formats 12122 → "12,122" for reach counts and stat rows. */
export const formatCount = (n) => Number(n || 0).toLocaleString('en-US');

/* Channel ids are derived, never hand-written, so Messages and the hub can
   never disagree about which thread a department owns. */
export const broadcastChannelId = (deptId) => `dept-${deptId}-broadcast`;
export const helpDeskChannelId = (deptId) => `dept-${deptId}-helpdesk`;

import { currentAccess, liveDepartment, viewerDepartmentId } from '../../../src/shared/departmentStore';
import { Building2, Landmark, ShieldCheck, KeyRound } from 'lucide-react';

/* Both surfaces resolve identity-based access through the shared department model.
   The Super Admin owns delegation and transfer; assigned roles scope publishing,
   student support and metadata editing independently. Academic role is not access. */

export const VIEWER_DEPARTMENT_ID = 'cse';

export const DEPARTMENT_LEVELS = {
  official: { label: 'Super Admin', icon: KeyRound, rank: 3 },
  admin: { label: 'Department Admin', icon: ShieldCheck, rank: 2 },
  member: { label: 'Member', icon: Landmark, rank: 1 },
  visitor: { label: 'Visitor', icon: Building2, rank: 0 },
};

export const getDepartmentAccess = currentAccess;

/* The hub's officials list, in the order it is read: the Department Chair
   first (the academic head), then the Official if that is someone else, then
   the admins the Official delegated to. One person holding two roles appears
   once, carrying both titles — a Chair who also holds the master key is one
   row, not two. */
export const LEADERSHIP_TITLES = {
  chair: 'Department Chair',
  official: 'Super Admin',
  admin: 'Department Admin',
};

export const getDepartmentLeadership = (dept, adminIds) => {
  if (!dept) return [];
  dept = liveDepartment(dept);
  adminIds = dept.adminIds;
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
export const getViewerDepartmentId = viewerDepartmentId;

/* Formats 12122 → "12,122" for reach counts and stat rows. */
export const formatCount = (n) => Number(n || 0).toLocaleString('en-US');

/* Channel ids are derived, never hand-written, so Messages and the hub can
   never disagree about which thread a department owns. */
export const broadcastChannelId = (deptId) => `dept-${deptId}-broadcast`;
export const helpDeskChannelId = (deptId) => `dept-${deptId}-helpdesk`;

import { currentAccess, liveDepartment, viewerDepartmentId } from '../../shared/departmentStore';
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

export const formatCount = (n) => Number(n || 0).toLocaleString('en-US');

/* Department accent chips — same mapping as the app's getDeptStyle, lifted
   into the module so department components don't depend on <App/>. */
export const getDeptAccent = (code, isDark) => {
  const styles = {
    CSE: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200',
    ECE: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200',
    BBA: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200',
    Architecture: isDark ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return styles[code] || (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20');
};

export const getViewerDepartmentId = viewerDepartmentId;

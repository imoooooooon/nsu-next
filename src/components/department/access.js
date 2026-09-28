import { Building2, Landmark, ShieldCheck, KeyRound } from 'lucide-react';

/* ---------------------------------------------------------------------------
   Department access — the single resolver for the chain of command.
   Screens ask this; they never re-derive permissions inline.
   Mirrors `webapp/src/lib/departmentAccess.js`.

   Official → the department head who holds the master key and the Department ID
   Admin    → a verified faculty member the Official delegated access to
   Member   → any student / alumni / faculty enrolled in the department
   Visitor  → any other signed-in user

   Demo mapping: all three demo identities belong to CSE, so a `faculty` login
   is the Official of CSE and `student` / `alumni` are Members of it.
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

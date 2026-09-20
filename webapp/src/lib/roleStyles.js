import { GraduationCap, Briefcase, Landmark, User } from 'lucide-react';

/* Role identity system (same mapping as the mobile app):
   Student → blue graduation cap, Alumni → amber briefcase,
   Faculty → maroon/rose landmark. */
export const getRoleStyles = (role, isDark) => {
  switch (role) {
    case 'Student':
      return { type: 'Student', icon: GraduationCap, colorClass: 'text-[#1D9BF0]', bgClass: 'bg-[#1D9BF0]/10' };
    case 'Alumni':
      return { type: 'Alumni', icon: Briefcase, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };
    case 'Faculty':
      return {
        type: 'Faculty',
        icon: Landmark,
        colorClass: isDark ? 'text-rose-400' : 'text-[#800000]',
        bgClass: isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10',
      };
    default:
      return { type: role || 'Member', icon: User, colorClass: 'text-gray-500', bgClass: 'bg-gray-500/10' };
  }
};

/* Derives a person's role bucket from a directory record. */
export const getPersonRole = (person) =>
  person.batch === 'Faculty' ? 'Faculty' : person.role === 'Student' ? 'Student' : 'Alumni';

/* Department accent chips. */
export const getDeptStyle = (dept, isDark) => {
  const styles = {
    CSE: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200',
    ECE: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200',
    BBA: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200',
  };
  return styles[dept] || (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20');
};

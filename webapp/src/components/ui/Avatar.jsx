import { User, BadgeCheck } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { getRoleStyles } from '../../lib/roleStyles';

/* ---------------------------------------------------------------------------
   Avatars & identity marks.
--------------------------------------------------------------------------- */

const SIZES = {
  xs: { box: 'w-7 h-7', icon: 'w-3.5 h-3.5' },
  sm: { box: 'w-10 h-10', icon: 'w-5 h-5' },
  md: { box: 'w-12 h-12', icon: 'w-6 h-6' },
  lg: { box: 'w-14 h-14', icon: 'w-6 h-6' },
  xl: { box: 'w-16 h-16', icon: 'w-8 h-8' },
  '2xl': { box: 'w-20 h-20', icon: 'w-10 h-10' },
  '3xl': { box: 'w-28 h-28', icon: 'w-12 h-12' },
};

/* Neutral glass avatar (the default person placeholder). */
export const Avatar = ({ size = 'md', online = false, className = '' }) => {
  const { t, isDark } = useTheme();
  const s = SIZES[size] || SIZES.md;
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className={`${s.box} rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white'} border flex items-center justify-center shadow-sm overflow-hidden`}>
        <User className={`${s.icon} ${t.text}`} strokeWidth={1.5} />
      </div>
      {online && (
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 ${isDark ? 'border-[#000000]' : 'border-[#F2F5F8]'} rounded-full`}></div>
      )}
    </div>
  );
};

/* Role-tinted avatar (student blue / alumni amber / faculty maroon). */
export const RoleAvatar = ({ role, size = 'md', online = false, className = '' }) => {
  const { isDark } = useTheme();
  const s = SIZES[size] || SIZES.md;
  const { colorClass, bgClass } = getRoleStyles(role, isDark);
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className={`${s.box} rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shadow-sm`}>
        <User className={`${s.icon} ${colorClass}`} strokeWidth={1.5} />
      </div>
      {online && (
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 ${isDark ? 'border-[#000000]' : 'border-[#F2F5F8]'} rounded-full`}></div>
      )}
    </div>
  );
};

/* Verified check — always the brand blue. */
export const Verified = ({ size = 'w-4 h-4', className = '' }) => (
  <BadgeCheck className={`${size} text-[#1D9BF0] shrink-0 ${className}`} strokeWidth={2.5} />
);

/* Inline role tag (icon + label) used beside names in messages/donor lists. */
export const RoleTag = ({ role }) => {
  const { isDark } = useTheme();
  const { icon: RoleIcon, colorClass, type } = getRoleStyles(role, isDark);
  return (
    <span className="flex items-center space-x-1.5">
      <RoleIcon className={`w-3.5 h-3.5 ${colorClass}`} strokeWidth={2.5} />
      <span className={`text-[11px] font-bold ${colorClass}`}>{type}</span>
    </span>
  );
};

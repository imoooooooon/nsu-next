import { NavLink } from 'react-router-dom';
import { Home, Compass, Briefcase, MessageSquare, User } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   MobileNav — the exact floating liquid-glass capsule from the mobile app,
   shown on small screens (< lg) so phone testers get the familiar pattern.
--------------------------------------------------------------------------- */

const ITEMS = [
  { to: '/home', icon: Home, label: 'Home', canFill: true },
  { to: '/network', icon: Compass, label: 'Explore' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs', hasBadge: true, canFill: true },
  { to: '/messages', icon: MessageSquare, label: 'Chat', canFill: true },
  { to: '/profile', label: 'Profile', isAvatar: true },
];

export const MobileNav = () => {
  const { isDark } = useTheme();

  return (
    <>
      <div className={`lg:hidden fixed bottom-0 left-0 w-full h-32 pointer-events-none z-40 bg-gradient-to-t ${isDark ? 'from-[#000000] via-[#000000]/80' : 'from-[#F2F5F8] via-[#F2F5F8]/80'} to-transparent`}></div>
      <nav className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] h-[76px] ${isDark ? 'nav-capsule-dark' : 'nav-capsule-light'} rounded-[2.5rem] flex justify-between items-center px-2 z-50`}>
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center h-[60px] rounded-[2rem] transition-[width,background-color] duration-300 ease-out overflow-hidden ${
                isActive
                  ? `w-[124px] ${isDark ? 'nav-active-dark text-white' : 'nav-active-light text-black'}`
                  : `w-[60px] bg-transparent ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="w-[60px] h-[60px] shrink-0 flex items-center justify-center">
                  {item.isAvatar ? (
                    <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? `ring-2 ${isDark ? 'ring-white/20' : 'ring-black/10'}` : 'opacity-80 border border-gray-300 dark:border-gray-600'} overflow-hidden shadow-sm backdrop-blur-md bg-gray-200 dark:bg-gray-800`}>
                      <User className="w-[16px] h-[16px] text-gray-500 dark:text-gray-400" strokeWidth={2} />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <item.icon
                        className="w-[24px] h-[24px] transition-colors duration-300"
                        strokeWidth={isActive ? 2.5 : 2}
                        fill={isActive && item.canFill ? 'currentColor' : 'none'}
                      />
                      {item.hasBadge && !isActive && (
                        <div className={`absolute top-[14px] right-[14px] w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center border-[1.5px] ${isDark ? 'border-[#1c1c1e]' : 'border-[#ffffff]'}`}>
                          <span className="text-white text-[7px] font-bold">3</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className={`flex-1 whitespace-nowrap text-left transition-opacity duration-300 ${isActive ? 'opacity-100 delay-100' : 'opacity-0'}`}>
                  <span className="text-[14px] font-extrabold pr-4">{item.label}</span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

import { useTheme } from '../../theme/ThemeContext';

/* The signature ambient backdrop: blue orb top-left, purple orb bottom-right,
   blurred 120px — identical to the mobile canvas, scaled to the viewport. */
export const AmbientBackground = () => {
  const { isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500" aria-hidden="true">
      <div className={`absolute top-[-10%] left-[-8%] w-[45%] h-[55%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[120px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`}></div>
      <div className={`absolute bottom-[-5%] right-[-8%] w-[45%] h-[55%] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] ${isDark ? 'opacity-[0.15]' : 'opacity-10'}`}></div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /welcome — 1:1 port of the mobile WelcomeScreen.
   Centered logo + tagline, bottom-anchored auth CTAs.
--------------------------------------------------------------------------- */

export default function WelcomePage() {
  const { t } = useTheme();
  const { setAuthMode } = useAppState();
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center justify-center h-full px-6 pt-8 pb-8 transition-colors duration-500 animate-fade-in relative z-10`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in-up">
        <img
          src="https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041954/Icon_300x-8_l1gnkq.png"
          alt="Ugrads Logo"
          className="w-36 h-36 mb-6 object-contain"
        />

        <h1 className={`text-xl font-semibold tracking-tight text-center ${t.text}`}>Connect. Grow. Support.</h1>
        <p className={`text-sm mt-2 text-center ${t.textMuted} px-4`}>North South University Verified Network</p>
      </div>

      <div className="w-full mt-auto space-y-3 animate-fade-in delay-150">
        <button
          onClick={() => { setAuthMode('login'); navigate('/auth/login'); }}
          className={`w-full h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-sm hover:bg-[#1A8CD8] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
        >
          Log In
        </button>
        <button
          onClick={() => { setAuthMode('signup'); navigate('/auth/role'); }}
          className={`w-full h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] ${t.card} border ${t.borderSoft} ${t.text} shadow-sm hover:border-[#1D9BF0]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
        >
          Create New Account
        </button>
        <p className={`text-xs tracking-wide text-center pt-2 font-bold ${t.textMuted}`}>Secure • Verified • Institutional</p>
      </div>
    </div>
  );
}

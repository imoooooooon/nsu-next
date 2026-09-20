import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { FieldLabel, TextInput } from '../../components/ui';

/* ---------------------------------------------------------------------------
   /auth/login — 1:1 port of the mobile AuthScreen (login mode).
--------------------------------------------------------------------------- */

const GoogleMark = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function LoginPage() {
  const { t } = useTheme();
  const { login, setAuthMode } = useAppState();
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col h-full relative z-10 animate-fade-in`}>
      <div className={`px-6 pt-8 pb-3 ${t.glass} border-b z-20 sticky top-0 shadow-sm`}>
        <div className="flex items-center">
          <button
            onClick={() => navigate('/welcome')}
            aria-label="Go back"
            className={`-ml-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors mr-3 active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h1 className={`text-lg font-extrabold tracking-tight capitalize ${t.text}`}>Log In</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 relative z-10">
        <div className="animate-fade-in-up">
          <div className="space-y-4">
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <TextInput icon={Mail} type="email" placeholder="yourname@northsouth.edu" />
            </div>

            <div>
              <FieldLabel>Password</FieldLabel>
              <TextInput icon={Lock} type="password" placeholder="••••••••" />
              <div className="text-right mt-2">
                <button type="button" className="text-xs text-[#1D9BF0] cursor-pointer hover:underline font-extrabold outline-none focus-visible:underline">
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => { login(); navigate('/home'); }}
            className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] bg-[#1D9BF0] text-white mt-8 shadow-sm hover:bg-[#1A8CD8] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
          >
            Log In
          </button>

          <div className="flex items-center my-6">
            <div className={`flex-1 border-t ${t.borderSoft}`}></div>
            <span className={`px-4 text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>OR</span>
            <div className={`flex-1 border-t ${t.borderSoft}`}></div>
          </div>

          <button
            type="button"
            className={`w-full h-14 rounded-xl font-extrabold text-[14px] transition-all active:scale-[0.98] ${t.card} border ${t.border} ${t.text} hover:border-[#1D9BF0]/30 shadow-sm flex items-center justify-center space-x-3 mb-6 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <GoogleMark />
            <span>Continue with Google</span>
          </button>

          <p className={`text-center text-xs font-bold ${t.textMuted}`}>
            Don't have an account?{' '}
            <button
              onClick={() => { setAuthMode('signup'); navigate('/auth/role'); }}
              className="text-[#1D9BF0] font-extrabold hover:underline outline-none focus-visible:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /auth/otp — 1:1 port of the mobile OtpScreen, plus auto-advance focus
   between the six digit boxes (web nicety).
--------------------------------------------------------------------------- */

export default function OtpPage() {
  const { t } = useTheme();
  const { login } = useAppState();
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleInput = (index, e) => {
    if (e.target.value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) inputsRef.current[index - 1]?.focus();
  };

  return (
    <div className={`flex flex-col h-full relative z-10 animate-fade-in`}>
      <div className={`px-6 pt-8 pb-3 ${t.glass} border-b z-20 sticky top-0 shadow-sm`}>
        <button
          onClick={() => navigate('/auth/signup')}
          aria-label="Go back"
          className={`-ml-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
        >
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 relative z-10">
        <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Verify Your Email</h1>
        <p className={`text-xs mt-2 font-bold ${t.textMuted}`}>Enter the 6-digit code sent to your email.</p>

        <div className="flex justify-between mt-7 mb-8 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i, index) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              defaultValue={i === 1 ? '1' : i === 2 ? '2' : ''}
              aria-label={`OTP digit ${i}`}
              onInput={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 rounded-xl text-center text-xl font-extrabold transition-all outline-none ${t.inputBg} border ${t.inputBorder} ${t.text} focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}
            />
          ))}
        </div>

        <button
          onClick={() => { login(); navigate('/home'); }}
          className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-sm hover:bg-[#1A8CD8] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
        >
          Verify & Create Account
        </button>

        <p className={`text-center text-xs font-bold mt-5 ${t.textMuted}`}>
          Didn't receive the code? <span className="text-[#1D9BF0] opacity-50 cursor-not-allowed ml-1">Resend in 28s</span>
        </p>
      </div>
    </div>
  );
}

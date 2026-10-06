import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle2, GraduationCap, Lock, Users } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /auth/role — 1:1 port of the mobile RoleGatewayScreen.
   Pick student / alumni / faculty before signing up.
--------------------------------------------------------------------------- */

const ROLES = [
  { id: 'student', title: 'Student', desc: 'Use your official university email', icon: GraduationCap },
  { id: 'alumni', title: 'Alumni', desc: 'Verification required before access', icon: Users },
  { id: 'faculty', title: 'Faculty', desc: 'Sign in with your institutional email', icon: Briefcase },
          { id: 'staff', title: 'University Staff / Official', desc: 'Program officers, coordinators and office staff', icon: Users },
];

export default function RoleSelectPage() {
  const { t, isDark } = useTheme();
  const { authRole, setAuthRole } = useAppState();
  const navigate = useNavigate();

  return (
    <div className={`auth-roles flex flex-col h-full px-6 pt-8 pb-8 transition-colors duration-500 animate-fade-in relative z-10`}>
      <button
        onClick={() => navigate('/welcome')}
        className={`-ml-2 w-10 h-10 mb-6 rounded-lg flex items-center justify-center ${t.card} border ${t.borderSoft} transition-colors active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] shadow-sm`}
        aria-label="Go back"
      >
        <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
      </button>

      <div className="auth-role-heading mb-7">
        <h1 className={`text-[28px] font-extrabold tracking-tight ${t.text} leading-tight`}>Select Your Role</h1>
        <p className={`text-sm mt-1 font-bold ${t.textMuted}`}>Choose how you want to access Ugrads</p>
      </div>

      <div className="space-y-4" role="listbox" aria-label="Select user role">
        {ROLES.map((role, index) => {
          const isSelected = authRole === role.id;

          const baseCardStyle = isSelected
            ? `bg-[#1D9BF0]/10 border-[#1D9BF0]/40 shadow-sm`
            : `${t.card} border ${t.borderSoft} shadow-sm hover:border-[#1D9BF0]/30`;

          const iconStyle = isSelected
            ? 'bg-[#1D9BF0]/10 text-[#1D9BF0]'
            : `${isDark ? 'bg-white/5' : 'bg-black/5'} ${t.textMuted}`;

          return (
            <div
              key={role.id}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => setAuthRole(role.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAuthRole(role.id); } }}
              className={`p-5 rounded-2xl border flex items-center cursor-pointer transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D9BF0] outline-none group animate-fade-in-up ${baseCardStyle}`}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 shrink-0 ${iconStyle}`}>
                <role.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-extrabold ${t.text} mb-0.5`}>{role.title}</h3>
                <p className={`text-xs font-bold ${t.textMuted} line-clamp-2`}>{role.desc}</p>
              </div>
              <div className="shrink-0 ml-3">
                {isSelected ? (
                  <div className="bg-[#1D9BF0] text-white rounded-full flex items-center justify-center animate-scale-up shadow-sm">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                ) : (
                  <CheckCircle2 className={`w-6 h-6 ${t.textMuted} opacity-40 transition-colors duration-300 group-hover:opacity-70`} strokeWidth={2.5} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="auth-role-security mt-auto pt-6 pb-5 text-center flex flex-col items-center justify-center opacity-80 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <div className={`flex items-center justify-center space-x-1.5 text-xs font-extrabold ${t.textMuted}`}>
          <Lock className="w-4 h-4" strokeWidth={2.5} />
          <span>Secured with university authentication</span>
        </div>
      </div>

      <div className="mb-2 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        <button
          disabled={!authRole}
          onClick={() => navigate('/auth/signup')}
          className={`w-full h-14 rounded-xl text-base font-extrabold transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] disabled:opacity-50 disabled:cursor-not-allowed bg-[#1D9BF0] text-white shadow-sm hover:bg-[#1A8CD8]`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

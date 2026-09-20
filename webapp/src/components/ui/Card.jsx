import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   Cards.
   Card       → the standard glass card (t.card + border + shadow)
   TintedCard → the hero-gradient card (white→tint in light, charcoal→tint in
                dark) used for jobs, people and identity cards on mobile.
--------------------------------------------------------------------------- */

export const Card = ({ interactive = false, padded = true, className = '', children, ...rest }) => {
  const { t } = useTheme();
  return (
    <div
      className={`rounded-2xl ${t.card} border ${t.border} ${t.cardShadow} ${padded ? 'p-5' : ''} ${interactive ? 'cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

const TINTS = {
  blue: { dark: 'to-[#1D9BF0]/15', light: 'to-[#1D9BF0]/15' },
  blueSoft: { dark: 'to-[#1D9BF0]/10', light: 'to-[#1D9BF0]/10' },
  emerald: { dark: 'to-emerald-500/10', light: 'to-emerald-500/10' },
  red: { dark: 'to-red-500/10', light: 'to-red-500/10' },
};

export const TintedCard = ({ tint = 'blue', interactive = false, className = '', contentClassName = '', children, ...rest }) => {
  const { t, isDark } = useTheme();
  const tintCfg = TINTS[tint] || TINTS.blue;
  return (
    <div
      className={`rounded-2xl relative overflow-hidden border ${t.border} ${t.cardShadow} ${interactive ? 'cursor-pointer group transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]' : ''} ${className}`}
      {...rest}
    >
      <div className={`absolute inset-0 z-0 ${isDark ? `bg-gradient-to-br from-[#1A1A1A]/90 ${tintCfg.dark}` : `bg-gradient-to-b from-white ${tintCfg.light} backdrop-blur-3xl`}`}></div>
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
};

/* Ambient blurred glow dot used inside insight/emergency cards. */
export const CardGlow = ({ color = 'bg-[#1D9BF0]/10', className = '' }) => (
  <div className={`absolute top-0 right-0 w-32 h-32 ${color} rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none ${className}`}></div>
);

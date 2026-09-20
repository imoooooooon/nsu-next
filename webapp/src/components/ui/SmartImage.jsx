import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   SmartImage — an <img> that degrades to a branded placeholder instead of the
   browser's broken-image glyph and raw alt text. Remote demo assets go dead
   over time; on the web that failure is visible on every card at once, so the
   fallback is part of the design system rather than a per-page patch.

   Fills its parent absolutely — the parent owns the aspect ratio, and an
   in-flow image would otherwise contribute its intrinsic height to flex
   base-size calculations and stretch the box. Parent must be `relative`.
--------------------------------------------------------------------------- */
export const SmartImage = ({ src, alt, className = '', fallbackIcon: Icon = ImageOff, ...rest }) => {
  const { isDark } = useTheme();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 w-full h-full flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-br from-[#1A1A1A] to-[#1D9BF0]/15'
            : 'bg-gradient-to-br from-gray-100 to-[#1D9BF0]/15'
        } ${className}`}
      >
        <Icon className={`w-7 h-7 ${isDark ? 'text-white/25' : 'text-black/20'}`} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      {...rest}
    />
  );
};

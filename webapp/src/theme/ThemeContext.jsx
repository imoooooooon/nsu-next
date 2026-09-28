import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/* ---------------------------------------------------------------------------
   Ugrads Design System — theme tokens
   Extracted verbatim from the shipped mobile prototype so both surfaces stay
   pixel-identical. `t` is the same token object the mobile app passes around;
   every component in the web app consumes it through useTheme().
--------------------------------------------------------------------------- */

export const buildThemeTokens = (isDark) => ({
  bg: isDark ? 'bg-[#000000]' : 'bg-[#F2F5F8]',
  card: isDark ? 'bg-[#121212]/60 backdrop-blur-2xl' : 'bg-white/70 backdrop-blur-2xl',
  surface: isDark ? 'bg-[#121212]' : 'bg-[#FFFFFF]',
  border: isDark ? 'border-white/10' : 'border-white',
  borderSoft: isDark ? 'border-white/[0.05]' : 'border-black/[0.03]',
  text: isDark ? 'text-[#E7E9EA]' : 'text-[#0F1419]',
  textMuted: isDark ? 'text-[#71767B]' : 'text-[#6B7280]',
  glass: isDark ? 'bg-[#000000]/70 backdrop-blur-xl border-white/10' : 'bg-[#F2F5F8]/80 backdrop-blur-xl border-white/40',
  overlayGlass: isDark ? 'bg-black/50 backdrop-blur-md' : 'bg-[#F2F5F8]/50 backdrop-blur-md',
  inputBg: isDark
    ? 'bg-[#202327]/60 backdrop-blur-md focus:bg-black/80 focus:ring-2 focus:ring-[#1D9BF0]/50'
    : 'bg-white/80 backdrop-blur-md focus:bg-white focus:ring-2 focus:ring-[#1D9BF0]/30',
  inputBorder: isDark ? 'border-white/10 focus:border-transparent' : 'border-white focus:border-transparent',
  // Every card carries the app's one whisper shadow — the shadow block in
  // index.css resolves any shadow utility to that hairline, so this token
  // just opts a surface in. Same value as mobile.
  cardShadow: 'shadow-sm',
});

/* Non-class primitives, for the rare inline-style need. */
export const BRAND = {
  primary: '#1D9BF0',
  primaryHover: '#1A8CD8',
  bgLight: '#F2F5F8',
  bgDark: '#000000',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#121212',
  textLight: '#0F1419',
  textDark: '#E7E9EA',
  mutedLight: '#6B7280',
  mutedDark: '#71767B',
};

const STORAGE_KEY = 'ugrads-theme';
/* Sidebar width is a lasting workspace preference, like the theme — it rides
   in this context and persists for the same reason. */
const SIDEBAR_KEY = 'ugrads-sidebar';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'collapsed';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* private mode — theme just won't persist */
    }
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, isSidebarCollapsed ? 'collapsed' : 'expanded');
    } catch {
      /* private mode — the rail width just won't persist */
    }
  }, [isSidebarCollapsed]);

  const value = useMemo(() => ({
    isDark,
    toggleTheme: () => setIsDark(d => !d),
    isSidebarCollapsed,
    toggleSidebar: () => setIsSidebarCollapsed(c => !c),
    t: buildThemeTokens(isDark),
  }), [isDark, isSidebarCollapsed]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

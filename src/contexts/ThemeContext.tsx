import React, { createContext, useContext as _useContext, useEffect, useState } from 'react';

import { safeJsonParse } from '@/lib/utils/data';
import { isDarkMode } from '@/lib/utils/ui';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// Note: ThemeContext export removed as unused

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Get stored theme preference or default to dark using safeJsonParse
    const storedThemeString = localStorage.getItem('theme');
    if (storedThemeString) {
      // Use safeJsonParse for safer parsing, fallback to string parsing
      const storedTheme = safeJsonParse(storedThemeString, storedThemeString) as Theme;
      if (['dark', 'light', 'system'].includes(storedTheme)) {
        setTheme(storedTheme);
      } else {
        // Invalid theme, set dark as default
        localStorage.setItem('theme', 'dark');
      }
    } else {
      // Set dark as default and store it
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    let effectiveTheme: 'dark' | 'light';

    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = theme;
    }

    // Apply the theme class
    root.classList.add(effectiveTheme);
    setActualTheme(effectiveTheme);

    // Store the preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(effectiveTheme);
      setActualTheme(effectiveTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => { mediaQuery.removeEventListener('change', handleChange); };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      actualTheme,
      isDark: isDarkMode() || actualTheme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Note: useTheme hook export removed as unused

import React, { useEffect, useState } from 'react';

import { createStandardContext } from '@/lib/utils/createContext';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
}

// Create standardized context
const { Provider: ThemeContextProvider, useContext: useTheme } =
  createStandardContext<ThemeContextType>({
    name: 'Theme',
    errorMessage: 'useTheme must be used within a ThemeProvider',
  });

export { useTheme };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Get stored theme preference or default to dark
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
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
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return (
    <ThemeContextProvider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContextProvider>
  );
}

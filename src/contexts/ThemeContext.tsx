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

  // Consolidated theme initialization and management
  useEffect(() => {
    // Initialize theme from storage
    const initTheme = () => {
      const storedThemeString = localStorage.getItem('theme');
      let initialTheme: Theme = 'dark';
      
      if (storedThemeString) {
        const storedTheme = safeJsonParse(storedThemeString, storedThemeString) as Theme;
        if (['dark', 'light', 'system'].includes(storedTheme)) {
          initialTheme = storedTheme;
        } else {
          localStorage.setItem('theme', 'dark');
        }
      } else {
        localStorage.setItem('theme', 'dark');
      }
      
      setTheme(initialTheme);
      return initialTheme;
    };

    // Apply theme to DOM
    const applyTheme = (currentTheme: Theme) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      let effectiveTheme: 'dark' | 'light';
      if (currentTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        effectiveTheme = currentTheme;
      }

      root.classList.add(effectiveTheme);
      setActualTheme(effectiveTheme);
      localStorage.setItem('theme', currentTheme);
    };

    // Initialize and apply theme
    const initialTheme = initTheme();
    applyTheme(initialTheme);

    // Set up system theme listener only if using system preference
    let mediaQuery: MediaQueryList | null = null;
    let handleSystemChange: ((e: MediaQueryListEvent) => void) | null = null;

    if (initialTheme === 'system') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      handleSystemChange = () => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleSystemChange);
    }

    return () => {
      if (mediaQuery && handleSystemChange) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      }
    };
  }, []);

  // Handle theme changes after initial load
  useEffect(() => {
    if (theme === 'system') {
      // Set up system listener for new system theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(effectiveTheme);
        setActualTheme(effectiveTheme);
      };
      
      // Apply initial system theme
      handleChange();
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      // Apply non-system theme
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      setActualTheme(theme);
    }
    
    localStorage.setItem('theme', theme);
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

export function useTheme() {
  const context = _useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Note: useTheme hook export removed as unused

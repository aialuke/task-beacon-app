/**
 * Motion Preference Context
 * 
 * Manages user motion preferences for accessibility compliance and smooth
 * animation experience. Automatically detects system preferences and provides
 * manual override capabilities.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SpringConfig } from '@react-spring/web';

export type MotionPreference = 'normal' | 'reduced' | 'disabled';

interface MotionPreferenceContextValue {
  preference: MotionPreference;
  shouldReduceMotion: boolean;
  shouldDisableMotion: boolean;
  setPreference: (preference: MotionPreference) => void;
  getAnimationConfig: (
    normalConfig: SpringConfig,
    reducedConfig?: SpringConfig,
    disabledConfig?: SpringConfig
  ) => SpringConfig;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

interface MotionPreferenceProviderProps {
  children: ReactNode;
  forceReducedMotion?: boolean;
  forceDisabledMotion?: boolean;
}

export function MotionPreferenceProvider({
  children,
  forceReducedMotion = false,
  forceDisabledMotion = false,
}: MotionPreferenceProviderProps) {
  const [preference, setPreference] = useState<MotionPreference>('normal');

  // Detect system motion preference on mount
  useEffect(() => {
    if (forceDisabledMotion) {
      setPreference('disabled');
      return;
    }

    if (forceReducedMotion) {
      setPreference('reduced');
      return;
    }

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPreference(e.matches ? 'reduced' : 'normal');
    };

    // Set initial value
    setPreference(mediaQuery.matches ? 'reduced' : 'normal');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [forceReducedMotion, forceDisabledMotion]);

  const shouldReduceMotion = preference === 'reduced';
  const shouldDisableMotion = preference === 'disabled';

  const getAnimationConfig = (
    normalConfig: SpringConfig,
    reducedConfig: SpringConfig = { tension: 500, friction: 50 },
    disabledConfig: SpringConfig = { tension: 1000, friction: 100 }
  ): SpringConfig => {
    if (shouldDisableMotion) {
      return disabledConfig;
    }
    if (shouldReduceMotion) {
      return reducedConfig;
    }
    return normalConfig;
  };

  const value: MotionPreferenceContextValue = {
    preference,
    shouldReduceMotion,
    shouldDisableMotion,
    setPreference,
    getAnimationConfig,
  };

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreferenceContext(): MotionPreferenceContextValue {
  const context = useContext(MotionPreferenceContext);
  
  if (!context) {
    // Provide safe fallback when context is not available
    console.warn('useMotionPreferenceContext must be used within a MotionPreferenceProvider. Using default values.');
    
    return {
      preference: 'normal',
      shouldReduceMotion: false,
      shouldDisableMotion: false,
      setPreference: () => {},
      getAnimationConfig: (normalConfig) => normalConfig,
    };
  }
  
  return context;
} 
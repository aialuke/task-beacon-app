import React, { createContext, useContext, useEffect, useState } from 'react';

interface MotionPreferenceContextType {
  prefersReducedMotion: boolean;
  isLoaded: boolean;
  shouldReduceMotion: boolean;
  animationMode: 'normal' | 'reduced' | 'disabled';
  setAnimationMode: (mode: 'normal' | 'reduced' | 'disabled') => void;
  getAnimationConfig: <T>(normalConfig: T, reducedConfig: T) => T;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextType | undefined>(undefined);

interface MotionPreferenceProviderProps {
  children: React.ReactNode;
  // Allow override for testing/development
  forceReducedMotion?: boolean;
}

export function MotionPreferenceProvider({ 
  children, 
  forceReducedMotion 
}: MotionPreferenceProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationMode, setAnimationMode] = useState<'normal' | 'reduced' | 'disabled'>('normal');

  useEffect(() => {
    // Check if matchMedia is available (for SSR compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      setIsLoaded(true);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    const shouldReduce = forceReducedMotion ?? mediaQuery.matches;
    setPrefersReducedMotion(shouldReduce);
    setAnimationMode(shouldReduce ? 'reduced' : 'normal');
    setIsLoaded(true);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      if (forceReducedMotion === undefined) {
        setPrefersReducedMotion(event.matches);
        setAnimationMode(event.matches ? 'reduced' : 'normal');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [forceReducedMotion]);

  // Global animation configuration
  const getAnimationConfig = <T,>(normalConfig: T, reducedConfig: T): T => {
    switch (animationMode) {
      case 'disabled':
        return { ...normalConfig, immediate: true } as T;
      case 'reduced':
        return reducedConfig;
      default:
        return normalConfig;
    }
  };

  const contextValue: MotionPreferenceContextType = {
    prefersReducedMotion,
    isLoaded,
    shouldReduceMotion: prefersReducedMotion || animationMode !== 'normal',
    animationMode,
    setAnimationMode,
    getAnimationConfig,
  };

  return (
    <MotionPreferenceContext.Provider value={contextValue}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

/**
 * Hook to access motion preferences from context
 * Falls back to local implementation if context is not available
 */
export function useMotionPreferenceContext() {
  const context = useContext(MotionPreferenceContext);
  
  if (context === undefined) {
    // Fallback warning for development
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'useMotionPreferenceContext must be used within a MotionPreferenceProvider. ' +
        'Falling back to local motion preference detection.'
      );
    }
    
    // Fallback to the original hook for backward compatibility
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useMotionPreferences } = require('@/hooks/useMotionPreferences');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMotionPreferences();
  }
  
  return context;
}

export { MotionPreferenceContext }; 
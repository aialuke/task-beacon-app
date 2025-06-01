import { useState, useEffect } from 'react';

/**
 * Hook to detect and manage user motion preferences
 *
 * @returns Object containing motion preference state and utilities
 */
export function useMotionPreferences() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if matchMedia is available (for SSR compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      setIsLoaded(true);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    setIsLoaded(true);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    prefersReducedMotion,
    isLoaded,
    shouldReduceMotion: prefersReducedMotion,
    getAnimationConfig: (normalConfig: unknown, reducedConfig: unknown) =>
      prefersReducedMotion ? reducedConfig : normalConfig,
  };
}

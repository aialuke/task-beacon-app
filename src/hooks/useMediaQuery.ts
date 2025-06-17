import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  defaultValue?: boolean;
}

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const { defaultValue = false } = options;
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Convenience hook for mobile detection
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

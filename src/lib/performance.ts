
/**
 * Performance optimization utilities
 */

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading utility
export function createLazyComponent<T>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(importFunc);
}

// Memory optimization for large lists
export function createVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = Math.min(5, Math.floor(visibleCount / 4));
  
  return {
    visibleCount: visibleCount + bufferSize * 2,
    startIndex: 0,
    endIndex: visibleCount + bufferSize * 2,
  };
}

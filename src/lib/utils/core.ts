/**
 * Core utility functions that don't fit into specific domains
 */

/**
 * Generates a UUID v4 string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Debounces a function to limit how often it can be called
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per specified interval
 */
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Optimize CSS animations for performance (essential function from css-optimization)
 */
async function optimizeAnimations(): Promise<void> {
  // Import here to avoid circular dependencies
  const { prefersReducedMotion } = await import('./animation');

  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    document.documentElement.style.setProperty('--transition-duration', '0ms');
  }
}

const _debounce = debounce;
const _throttle = throttle;
const _optimizeAnimations = optimizeAnimations;

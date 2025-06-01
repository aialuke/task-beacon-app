
/**
 * Legacy performance file - kept for backward compatibility
 *
 * This file now re-exports from the organized performance modules.
 * For new code, prefer importing directly from the specific modules:
 * - import { performanceMonitor } from "@/lib/performanceUtils";
 * - import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
 */

// Re-export core performance utilities for backward compatibility
export { performanceMonitor } from './performanceUtils';
export { debounce, throttle } from './utils/core';

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

import { useEffect, useCallback } from "react";
import { performanceMonitor } from '@/lib/utils/performance';

/**
 * Simplified hook for component performance monitoring
 */
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    performanceMonitor.start(`${componentName}-mount`);
    return () => {
      performanceMonitor.end(`${componentName}-mount`);
    };
  }, [componentName]);

  const measureOperation = useCallback(
    (operationName: string, operation: () => void) => {
      performanceMonitor.start(`${componentName}-${operationName}`);
      operation();
      performanceMonitor.end(`${componentName}-${operationName}`);
    },
    [componentName]
  );

  return { measureOperation };
}

/**
 * Simple performance measurement wrapper for functions
 */
export function measurePerformance<T extends unknown[], R>(
  name: string,
  fn: (...args: T) => R
): (...args: T) => R {
  return (...args: T): R => {
    performanceMonitor.start(name);
    const result = fn(...args);
    performanceMonitor.end(name);
    return result;
  };
}

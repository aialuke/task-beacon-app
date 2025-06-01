import { useEffect, useCallback } from "react";
import { performanceMonitor } from "@/lib/performanceUtils";

/**
 * Simplified hook for component performance monitoring
 */
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const id = performanceMonitor.startMeasurement(`${componentName}-mount`);
    return () => {
      performanceMonitor.endMeasurement(id); // Fixed: No return value
    };
  }, [componentName]);

  const measureOperation = useCallback(
    (operationName: string, operation: () => void) => {
      const id = performanceMonitor.startMeasurement(
        `${componentName}-${operationName}`
      );
      operation();
      performanceMonitor.endMeasurement(id);
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
    const id = performanceMonitor.startMeasurement(name);
    const result = fn(...args);
    performanceMonitor.endMeasurement(id);
    return result;
  };
}


import { useEffect, useCallback } from 'react';
import { performanceMonitor } from '@/lib/performanceUtils';

/**
 * Hook to measure component performance
 */
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const id = performanceMonitor.startMeasurement(`${componentName}-mount`);

    return () => {
      performanceMonitor.endMeasurement(id);
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
 * HOC to monitor component render performance
 */
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: T) {
    const { measureOperation } = usePerformanceMonitoring(componentName);

    return <Component {...props} />;
  };
}

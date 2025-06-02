
import { useEffect } from 'react';
import { performanceMonitor } from '@/lib/utils/performance';

/**
 * Hook for monitoring component performance
 */
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceMonitor.recordComponentRender(componentName, renderTime);
    };
  }, [componentName]);
}

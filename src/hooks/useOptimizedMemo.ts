

import { useMemo, useCallback, useRef } from 'react';

interface OptimizationOptions {
  name?: string;
  warnOnSlowComputation?: boolean;
  slowComputationThreshold?: number;
  trackDependencyChanges?: boolean;
}

/**
 * Optimized memoization hook with performance monitoring
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList | undefined,
  options?: OptimizationOptions | string
): T {
  const startTime = useRef<number>();
  
  // Handle both string and object formats for backward compatibility
  const debugName = typeof options === 'string' ? options : options?.name;
  const warnOnSlowComputation = typeof options === 'object' ? options.warnOnSlowComputation : false;
  const slowComputationThreshold = typeof options === 'object' ? (options.slowComputationThreshold ?? 10) : 10;
  
  return useMemo(() => {
    if (debugName) {
      startTime.current = performance.now();
    }
    
    const result = factory();
    
    if (debugName && startTime.current) {
      const duration = performance.now() - startTime.current;
      
      if (warnOnSlowComputation && duration > slowComputationThreshold) {
        console.warn(`useOptimizedMemo[${debugName}]: Slow computation detected (${duration.toFixed(2)}ms)`);
      } else {
        console.log(`useOptimizedMemo[${debugName}]: ${duration.toFixed(2)}ms`);
      }
    }
    
    return result;
  }, deps);
}

/**
 * Optimized callback hook
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList | undefined,
  options?: OptimizationOptions | string
): T {
  // Handle both string and object formats for backward compatibility
  const debugName = typeof options === 'string' ? options : options?.name;
  
  return useCallback((...args: Parameters<T>) => {
    const startTime = debugName ? performance.now() : 0;
    
    const result = callback(...args);
    
    if (debugName) {
      const duration = performance.now() - startTime;
      console.log(`useOptimizedCallback[${debugName}]: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }, deps) as T;
}
// CodeRabbit review

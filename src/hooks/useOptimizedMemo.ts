
import { useMemo, useCallback, useRef } from 'react';

/**
 * Optimized memoization hook with performance monitoring
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList | undefined,
  debugName?: string
): T {
  const startTime = useRef<number>();
  
  return useMemo(() => {
    if (debugName) {
      startTime.current = performance.now();
    }
    
    const result = factory();
    
    if (debugName && startTime.current) {
      const duration = performance.now() - startTime.current;
      console.log(`useOptimizedMemo[${debugName}]: ${duration.toFixed(2)}ms`);
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
  debugName?: string
): T {
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

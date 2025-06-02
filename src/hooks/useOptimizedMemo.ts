import { useCallback, useMemo, useRef, useEffect } from 'react';
import { performanceMonitor } from '@/lib/utils/performance';

/**
 * Enhanced useMemo with performance tracking and optimization warnings
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList | undefined,
  options?: {
    name?: string;
    warnOnSlowComputation?: boolean;
    trackDependencyChanges?: boolean;
  }
): T {
  const { name = 'anonymous', warnOnSlowComputation = true, trackDependencyChanges = true } = options || {};
  const prevDepsRef = useRef<React.DependencyList | undefined>();
  const computationCountRef = useRef(0);

  // Track dependency changes for optimization insights
  useEffect(() => {
    if (trackDependencyChanges && prevDepsRef.current) {
      const changedDeps = deps?.filter((dep, index) => dep !== prevDepsRef.current?.[index]) || [];
      if (changedDeps.length > 0) {
        console.debug(`📊 Memo dependencies changed in ${name}:`, { 
          totalDeps: deps?.length,
          changedCount: changedDeps.length,
          computationCount: computationCountRef.current 
        });
      }
    }
    prevDepsRef.current = deps;
  });

  return useMemo(() => {
    const startTime = performance.now();
    computationCountRef.current++;
    
    const result = factory();
    const duration = performance.now() - startTime;
    
    if (warnOnSlowComputation && duration > 5) {
      console.warn(`🐌 Slow memo computation in ${name}: ${duration.toFixed(2)}ms`, {
        computationCount: computationCountRef.current,
        duration
      });
    }
    
    return result;
  }, deps);
}

/**
 * Enhanced useCallback with dependency change tracking
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    trackDependencyChanges?: boolean;
  }
): T {
  const { name = 'anonymous', trackDependencyChanges = true } = options || {};
  const prevDepsRef = useRef<React.DependencyList>();
  const recreationCountRef = useRef(0);

  // Track callback recreations
  useEffect(() => {
    if (trackDependencyChanges && prevDepsRef.current) {
      const changedDeps = deps.filter((dep, index) => dep !== prevDepsRef.current?.[index]);
      if (changedDeps.length > 0) {
        recreationCountRef.current++;
        console.debug(`🔄 Callback recreated in ${name}:`, { 
          totalDeps: deps.length,
          changedCount: changedDeps.length,
          recreationCount: recreationCountRef.current 
        });
      }
    }
    prevDepsRef.current = deps;
  });

  return useCallback(callback, deps);
}

/**
 * Hook for tracking component render performance
 */
export function useRenderTracking(componentName: string, props?: Record<string, any>) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const propsRef = useRef(props);

  useEffect(() => {
    const renderTime = performance.now();
    renderCountRef.current++;
    
    // Check if props changed
    const propsChanged = props && propsRef.current && 
      JSON.stringify(props) !== JSON.stringify(propsRef.current);
    
    // Track render performance
    performanceMonitor.trackComponentRender(componentName, renderTime, !!propsChanged);
    
    // Warn about frequent renders
    if (renderCountRef.current > 5 && renderTime - lastRenderTimeRef.current < 100) {
      console.warn(`🔄 Frequent renders detected in ${componentName}:`, {
        renderCount: renderCountRef.current,
        timeSinceLastRender: renderTime - lastRenderTimeRef.current
      });
    }
    
    lastRenderTimeRef.current = renderTime;
    propsRef.current = props;
  });

  return {
    renderCount: renderCountRef.current,
    markRenderComplete: () => {
      const renderTime = performance.now() - lastRenderTimeRef.current;
      if (renderTime > 16) { // More than one frame
        console.warn(`🐌 Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  };
}

/**
 * Hook for optimizing expensive computations with smart caching
 */
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options?: {
    maxCacheSize?: number;
    ttl?: number; // Time to live in milliseconds
    name?: string;
  }
): T {
  const { maxCacheSize = 10, ttl, name = 'smart-memo' } = options || {};
  const cacheRef = useRef<Map<string, { value: T; timestamp: number }>>(new Map());
  
  return useMemo(() => {
    const key = JSON.stringify(deps);
    const cache = cacheRef.current;
    const now = Date.now();
    
    // Check if we have a valid cached value
    const cached = cache.get(key);
    if (cached) {
      if (!ttl || (now - cached.timestamp) < ttl) {
        return cached.value;
      } else {
        cache.delete(key); // Remove expired entry
      }
    }
    
    // Compute new value
    const startTime = performance.now();
    const value = factory();
    const duration = performance.now() - startTime;
    
    // Cache the result
    cache.set(key, { value, timestamp: now });
    
    // Cleanup old entries if cache is too large
    if (cache.size > maxCacheSize) {
      const entries = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
      const entriesToDelete = entries.slice(0, cache.size - maxCacheSize);
      entriesToDelete.forEach(([k]) => cache.delete(k));
    }
    
    if (duration > 10) {
      console.debug(`⚡ Computed ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return value;
  }, deps);
} 
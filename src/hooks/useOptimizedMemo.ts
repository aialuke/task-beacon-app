import { useRef, useEffect } from 'react';

/**
 * Enhanced useMemo with optimization warnings
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    warnOnSlowComputation?: boolean;
    slowComputationThreshold?: number;
    trackDependencyChanges?: boolean;
  }
): T {
  const {
    name = 'anonymous',
    warnOnSlowComputation = true,
    slowComputationThreshold = 10,
    trackDependencyChanges = true,
  } = options || {};

  const memoizedValueRef = useRef<T>();
  const previousDepsRef = useRef<React.DependencyList>();
  const computationCountRef = useRef(0);
  const isInitialRenderRef = useRef(true);

  // Check if dependencies have changed
  const depsChanged = !previousDepsRef.current || 
    deps.some((dep, index) => !Object.is(dep, previousDepsRef.current![index]));

  if (depsChanged || isInitialRenderRef.current) {
    const startTime = performance.now();
    
    memoizedValueRef.current = factory();
    computationCountRef.current++;
    
    const computationTime = performance.now() - startTime;
    
    // Warn about slow computations in development
    if (process.env.NODE_ENV === 'development' && warnOnSlowComputation && computationTime > slowComputationThreshold) {
      console.warn(
        `🐌 Slow computation detected in useOptimizedMemo (${name}): ${computationTime.toFixed(2)}ms`,
        { computationTime, threshold: slowComputationThreshold, computationCount: computationCountRef.current }
      );
    }
    
    // Log dependency changes in development
    if (process.env.NODE_ENV === 'development' && trackDependencyChanges && !isInitialRenderRef.current) {
      const changedIndices = deps
        .map((dep, index) => (!Object.is(dep, previousDepsRef.current![index]) ? index : -1))
        .filter(index => index !== -1);
        
      if (changedIndices.length > 0) {
        console.debug(
          `📊 Dependencies changed in useOptimizedMemo (${name}):`,
          { changedIndices, computationCount: computationCountRef.current }
        );
      }
    }
    
    previousDepsRef.current = deps;
    isInitialRenderRef.current = false;
  }

  return memoizedValueRef.current!;
}

/**
 * Enhanced useCallback with performance tracking
 */
export function useOptimizedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList,
  options?: {
    name?: string;
    trackDependencyChanges?: boolean;
  }
): T {
  const {
    name = 'anonymous',
    trackDependencyChanges = true,
  } = options || {};

  return useOptimizedMemo(
    () => callback,
    deps,
    { name: `callback-${name}`, trackDependencyChanges, warnOnSlowComputation: false }
  ) as T;
}

/**
 * Hook for tracking render performance
 */
export function useRenderTracking(componentName: string, options?: {
  warnOnSlowRenders?: boolean;
  slowRenderThreshold?: number;
}) {
  const {
    warnOnSlowRenders = true,
    slowRenderThreshold = 16, // 60fps threshold
  } = options || {};

  const renderStartTimeRef = useRef<number>();
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  // Track render start
  if (!renderStartTimeRef.current) {
    renderStartTimeRef.current = performance.now();
  }

  useEffect(() => {
    if (!renderStartTimeRef.current) return;

    const renderTime = performance.now() - renderStartTimeRef.current;
    renderCountRef.current++;
    
    // Warn about slow renders in development
    if (process.env.NODE_ENV === 'development' && warnOnSlowRenders && renderTime > slowRenderThreshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
        { renderTime, threshold: slowRenderThreshold, renderCount: renderCountRef.current }
      );
    }

    lastRenderTimeRef.current = renderTime;
    renderStartTimeRef.current = undefined;
  });

  return {
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTimeRef.current,
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
  
  return useOptimizedMemo(() => {
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
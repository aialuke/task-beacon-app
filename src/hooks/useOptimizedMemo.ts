
import { useRef, useEffect } from 'react';

/**
 * Enhanced useMemo with optimization warnings and performance tracking
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

  // Check if dependencies have changed using Object.is for better comparison
  const depsChanged = !previousDepsRef.current || 
    deps.length !== previousDepsRef.current.length ||
    deps.some((dep, index) => !Object.is(dep, previousDepsRef.current![index]));

  if (depsChanged || isInitialRenderRef.current) {
    const startTime = performance.now();
    
    memoizedValueRef.current = factory();
    computationCountRef.current++;
    
    const computationTime = performance.now() - startTime;
    
    // Performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      if (warnOnSlowComputation && computationTime > slowComputationThreshold) {
        console.warn(
          `🐌 Slow computation in useOptimizedMemo (${name}): ${computationTime.toFixed(2)}ms`,
          { 
            computationTime, 
            threshold: slowComputationThreshold, 
            computationCount: computationCountRef.current,
            deps: deps.length
          }
        );
      }
      
      if (trackDependencyChanges && !isInitialRenderRef.current) {
        const changedIndices = deps
          .map((dep, index) => (!Object.is(dep, previousDepsRef.current![index]) ? index : -1))
          .filter(index => index !== -1);
          
        if (changedIndices.length > 0) {
          console.debug(
            `📊 Dependencies changed in useOptimizedMemo (${name}):`,
            { 
              changedIndices, 
              computationCount: computationCountRef.current,
              totalDeps: deps.length
            }
          );
        }
      }
    }
    
    previousDepsRef.current = [...deps]; // Create a copy to avoid reference issues
    isInitialRenderRef.current = false;
  }

  return memoizedValueRef.current!;
}

/**
 * Enhanced useCallback with performance tracking and stable references
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
    { 
      name: `callback-${name}`, 
      trackDependencyChanges, 
      warnOnSlowComputation: false 
    }
  ) as T;
}

/**
 * Hook for tracking component render performance
 */
export function useRenderTracking(componentName: string, options?: {
  warnOnSlowRenders?: boolean;
  slowRenderThreshold?: number;
  trackProps?: boolean;
}) {
  const {
    warnOnSlowRenders = true,
    slowRenderThreshold = 16, // 60fps threshold
    trackProps = false,
  } = options || {};

  const renderStartTimeRef = useRef<number>();
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const propsRef = useRef<unknown>();

  // Track render start
  if (!renderStartTimeRef.current) {
    renderStartTimeRef.current = performance.now();
  }

  useEffect(() => {
    if (!renderStartTimeRef.current) return;

    const renderTime = performance.now() - renderStartTimeRef.current;
    renderCountRef.current++;
    
    // Performance monitoring in development
    if (process.env.NODE_ENV === 'development' && warnOnSlowRenders && renderTime > slowRenderThreshold) {
      console.warn(
        `🐌 Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`,
        { 
          renderTime, 
          threshold: slowRenderThreshold, 
          renderCount: renderCountRef.current,
          component: componentName
        }
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
 * Smart memoization hook with intelligent caching and TTL support
 */
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options?: {
    maxCacheSize?: number;
    ttl?: number; // Time to live in milliseconds
    name?: string;
    enableDeepEqual?: boolean;
  }
): T {
  const { 
    maxCacheSize = 10, 
    ttl, 
    name = 'smart-memo',
    enableDeepEqual = false
  } = options || {};
  
  const cacheRef = useRef<Map<string, { value: T; timestamp: number }>>(new Map());
  
  return useOptimizedMemo(() => {
    const key = enableDeepEqual ? JSON.stringify(deps) : deps.map(String).join('|');
    const cache = cacheRef.current;
    const now = Date.now();
    
    // Check for valid cached value
    const cached = cache.get(key);
    if (cached) {
      if (!ttl || (now - cached.timestamp) < ttl) {
        return cached.value;
      } else {
        cache.delete(key); // Remove expired entry
      }
    }
    
    // Compute new value with performance tracking
    const startTime = performance.now();
    const value = factory();
    const duration = performance.now() - startTime;
    
    // Cache the result
    cache.set(key, { value, timestamp: now });
    
    // Cleanup old entries if cache is too large
    if (cache.size > maxCacheSize) {
      const entries = Array.from(cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      const entriesToDelete = entries.slice(0, cache.size - maxCacheSize);
      entriesToDelete.forEach(([k]) => cache.delete(k));
    }
    
    // Performance logging in development
    if (process.env.NODE_ENV === 'development' && duration > 5) {
      console.debug(
        `⚡ Computed ${name}: ${duration.toFixed(2)}ms`,
        { duration, cacheSize: cache.size, key: key.slice(0, 50) }
      );
    }
    
    return value;
  }, deps, { name, warnOnSlowComputation: true });
}

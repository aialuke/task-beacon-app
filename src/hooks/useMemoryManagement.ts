import { useEffect, useRef, useCallback } from 'react';

interface MemoryManagementOptions {
  cleanupInterval?: number;
  maxCacheSize?: number;
  enableWeakMapCache?: boolean;
}

/**
 * Memory Management Hook - Phase 4 Implementation
 * 
 * Provides comprehensive memory leak prevention:
 * - Automatic cleanup of event listeners
 * - Memory-efficient caching
 * - WeakMap-based references
 * - Interval cleanup management
 */
export function useMemoryManagement(options: MemoryManagementOptions = {}) {
  const {
    cleanupInterval = 60000, // 1 minute
    maxCacheSize = 100,
    enableWeakMapCache = true,
  } = options;

  const cleanupFunctionsRef = useRef<Set<() => void>>(new Set());
  const cacheRef = useRef(enableWeakMapCache ? new WeakMap() : new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Register cleanup function
  const registerCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctionsRef.current.add(cleanupFn);
    
    return () => {
      cleanupFunctionsRef.current.delete(cleanupFn);
    };
  }, []);

  // Memory-efficient cache management
  const managedCache = useCallback(() => {
    return {
      set: (key: unknown, value: any) => {
        if (enableWeakMapCache && cacheRef.current instanceof WeakMap) {
          cacheRef.current.set(key, value);
        } else if (cacheRef.current instanceof Map) {
          // Cleanup old entries if cache is too large
          if (cacheRef.current.size >= maxCacheSize) {
            const entries = Array.from(cacheRef.current.entries());
            cacheRef.current.clear();
            // Keep most recent half
            entries.slice(-Math.floor(maxCacheSize / 2)).forEach(([k, v]) => {
              (cacheRef.current as Map<unknown, any>).set(k, v);
            });
          }
          cacheRef.current.set(key, value);
        }
      },
      
      get: (key: unknown) => {
        return cacheRef.current.get(key);
      },
      
      has: (key: unknown) => {
        return cacheRef.current.has(key);
      },
      
      delete: (key: unknown) => {
        return cacheRef.current.delete(key);
      },
      
      clear: () => {
        if (cacheRef.current instanceof Map) {
          cacheRef.current.clear();
        }
        // WeakMap doesn't have clear method
      },
    };
  }, [enableWeakMapCache, maxCacheSize]);

  // Periodic cleanup
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Run all registered cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Cleanup function failed:', error);
        }
      });
      
      // Clear Map cache periodically (WeakMap handles itself)
      if (!enableWeakMapCache && cacheRef.current instanceof Map) {
        const cacheSize = cacheRef.current.size;
        if (cacheSize > maxCacheSize * 0.8) {
          managedCache().clear();
        }
      }
    }, cleanupInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cleanupInterval, enableWeakMapCache, maxCacheSize, managedCache]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      // Run all cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Cleanup function failed during unmount:', error);
        }
      });
      
      // Clear references
      cleanupFunctionsRef.current.clear();
      if (cacheRef.current instanceof Map) {
        cacheRef.current.clear();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    registerCleanup,
    cache: managedCache(),
  };
}

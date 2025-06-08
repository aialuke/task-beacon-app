
/**
 * Lazy Loading Utilities - Enhanced Performance Patterns
 * 
 * Provides standardized lazy loading with retry logic and performance tracking.
 */

import { lazy, type ComponentType } from 'react';

export interface LazyLoadingOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface LazyLoadingMetrics {
  componentName: string;
  loadTime: number;
  retryCount: number;
  success: boolean;
}

/**
 * Enhanced lazy component factory with retry logic
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadingOptions = {}
): T {
  const { maxRetries = 3, retryDelay = 1000, timeout = 30000 } = options;
  
  return lazy(() => {
    let retryCount = 0;
    
    const attemptLoad = async (): Promise<{ default: T }> => {
      try {
        // Add timeout to the import
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Import timeout')), timeout);
        });
        
        const result = await Promise.race([importFn(), timeoutPromise]);
        return result;
      } catch (error) {
        retryCount++;
        
        if (retryCount <= maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          return attemptLoad();
        }
        
        throw error;
      }
    };
    
    return attemptLoad();
  }) as T;
}

/**
 * Performance tracking for lazy loaded components
 */
export const lazyLoadingMetrics = {
  metrics: new Map<string, LazyLoadingMetrics>(),
  
  trackComponentLoad: (componentName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    
    const existing = lazyLoadingMetrics.metrics.get(componentName);
    const metric: LazyLoadingMetrics = {
      componentName,
      loadTime,
      retryCount: existing?.retryCount || 0,
      success: true,
    };
    
    lazyLoadingMetrics.metrics.set(componentName, metric);
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LazyLoad] ${componentName}: ${loadTime.toFixed(2)}ms`);
    }
  },
  
  getMetrics: () => Array.from(lazyLoadingMetrics.metrics.values()),
  
  clearMetrics: () => lazyLoadingMetrics.metrics.clear(),
};

/**
 * Preload utility for lazy components
 */
export function preloadLazyComponent(
  importFn: () => Promise<{ default: ComponentType<any> }>
): Promise<void> {
  return importFn().then(() => {
    // Component is now preloaded
  }).catch(error => {
    console.warn('Failed to preload component:', error);
  });
}

/**
 * Bundle utilities for performance optimization
 */
export const bundleUtils = {
  getConnectionQuality: (): 'slow' | 'fast' => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        return effectiveType === '4g' || effectiveType === '3g' ? 'fast' : 'slow';
      }
    }
    return 'fast'; // Default to fast if can't determine
  },
  
  shouldPreload: (connectionQuality: 'slow' | 'fast'): boolean => {
    return connectionQuality === 'fast';
  },
};

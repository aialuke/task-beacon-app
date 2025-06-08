
/**
 * Lazy Loading Utilities - Bundle Optimization
 * 
 * Provides utilities for lazy loading components and features to reduce initial bundle size.
 */

import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with error handling and retries
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    fallback?: React.ComponentType;
  } = {}
): T {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  
  let retryCount = 0;
  
  const retryableImport = async (): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.warn(`Lazy loading failed, retrying... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return retryableImport();
      }
      throw error;
    }
  };
  
  return lazy(retryableImport);
}

/**
 * Preload a lazy component to improve perceived performance
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  // Only preload if the user is not on a slow connection
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return;
    }
  }
  
  // Preload after a short delay to not block initial rendering
  setTimeout(() => {
    importFn().catch(() => {
      // Silently fail preloading
    });
  }, 100);
}

/**
 * Create a lazy component with automatic preloading
 */
export function createPreloadableLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preloadCondition: () => boolean = () => true
): T & { preload: () => void } {
  const LazyComponent = createLazyComponent(importFn);
  
  const preload = () => {
    if (preloadCondition()) {
      preloadComponent(importFn);
    }
  };
  
  return Object.assign(LazyComponent, { preload });
}

/**
 * Lazy load utility functions to reduce initial bundle
 */
export const lazyUtils = {
  /**
   * Lazy load image processing utilities
   */
  loadImageUtils: () => import('../image/lazy-loader'),
  
  /**
   * Lazy load validation utilities
   */
  loadValidationUtils: () => import('./validation').then(module => ({
    validateFieldAsync: module.validateFieldAsync,
    validateFormAsync: module.validateFormAsync,
  })),
  
  /**
   * Lazy load form utilities
   */
  loadFormUtils: () => import('@/hooks/dataValidationUtils'),
  
  /**
   * Lazy load API utilities
   */
  loadApiUtils: () => import('@/lib/api'),
};

/**
 * Bundle analysis utilities
 */
export const bundleUtils = {
  /**
   * Check if code splitting is supported
   */
  isCodeSplittingSupported: () => {
    return typeof window !== 'undefined' && 'import' in window;
  },
  
  /**
   * Get connection quality for adaptive loading
   */
  getConnectionQuality: (): 'fast' | 'slow' | 'unknown' => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.effectiveType === '4g') return 'fast';
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return 'slow';
      }
    }
    return 'unknown';
  },
  
  /**
   * Determine if feature should be lazy loaded based on device capabilities
   */
  shouldLazyLoad: (feature: string): boolean => {
    const quality = bundleUtils.getConnectionQuality();
    
    // Always lazy load on slow connections
    if (quality === 'slow') return true;
    
    // Lazy load heavy features regardless of connection
    const heavyFeatures = ['image-processing', 'virtualization', 'charts'];
    return heavyFeatures.includes(feature);
  },
};

/**
 * Performance monitoring for lazy loading
 */
export const lazyLoadingMetrics = {
  startTime: performance.now(),
  
  /**
   * Track component load time
   */
  trackComponentLoad: (componentName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    console.debug(`Lazy component "${componentName}" loaded in ${loadTime.toFixed(2)}ms`);
    
    // Report to analytics if available
    if ('gtag' in window) {
      (window as any).gtag('event', 'lazy_component_load', {
        component_name: componentName,
        load_time: loadTime,
      });
    }
  },
  
  /**
   * Track preload effectiveness
   */
  trackPreload: (componentName: string, wasPreloaded: boolean) => {
    console.debug(`Component "${componentName}" ${wasPreloaded ? 'was' : 'was not'} preloaded`);
  },
};

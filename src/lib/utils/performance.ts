/**
 * Performance Monitoring and Optimization Utilities
 * 
 * Provides comprehensive performance tracking, memory monitoring, and optimization tools
 * for React components and application performance analysis.
 */

import { performanceLogger } from '../logger';
import { startTransition } from 'react';

/**
 * Performance measurement utilities
 */
export interface PerformanceMeasurement {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceThresholds {
  slow: number;
  warning: number;
  critical: number;
  slowRender: number;
  slowOperation: number;
  highMemoryUsage: number;
  frequentRerenders: number;
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  slow: 100, // 100ms
  warning: 500, // 500ms
  critical: 1000, // 1s
  slowRender: 16, // One frame at 60fps
  slowOperation: 100,
  highMemoryUsage: 80, // Percentage
  frequentRerenders: 10, // Count in short period
};

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ComponentRenderMetrics {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  propsChanges: number;
}

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

interface PerformanceMetrics {
  componentRenders: Map<string, number>;
  slowOperations: Array<{ name: string; duration: number; timestamp: number }>;
  bundleChunks: Map<string, { loaded: boolean; size?: number }>;
}

class PerformanceMonitor {
  private measurements = new Map<string, number>();
  private metrics: PerformanceMetrics = {
    componentRenders: new Map(),
    slowOperations: [],
    bundleChunks: new Map(),
  };
  private componentMetrics: Map<string, ComponentRenderMetrics> = new Map();
  private isEnabled: boolean = process.env.NODE_ENV === 'development';
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (this.isEnabled && typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers for automatic monitoring
   */
  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
            this.metrics.slowOperations.push({
              name: 'long-task',
              duration: entry.duration,
              timestamp: Date.now(),
            });
          }
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.debug('Long task observer not supported');
    }

    // Monitor navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          console.debug('📊 Navigation timing:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
          });
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (error) {
      console.debug('Navigation observer not supported');
    }

    // Monitor resource loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 1000) {
            console.warn(`🐌 Slow resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.debug('Resource observer not supported');
    }
  }

  /**
   * Start measuring a performance metric (new enhanced method)
   */
  startMeasurement(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.metrics.componentRenders.set(name, (this.metrics.componentRenders.get(name) || 0) + 1);
  }

  /**
   * End measuring a performance metric (new enhanced method)
   */
  endMeasurement(name: string): number | null {
    if (!this.isEnabled) return null;

    const currentCount = this.metrics.componentRenders.get(name) || 0;
    const endTime = performance.now();
    const duration = endTime - (this.measurements.get(name) || 0);

    if (duration > PERFORMANCE_THRESHOLDS.slowRender) {
      this.metrics.slowOperations.push({
        name: `render-${name}`,
        duration,
        timestamp: Date.now(),
      });
    }

    return duration;
  }

  /**
   * Legacy start method for backward compatibility
   */
  start(name: string, metadata?: Record<string, unknown>): void {
    const startTime = performance.now();
    this.measurements.set(name, startTime);
    
    performanceLogger.debug(`Performance measurement started: ${name}`, {
      startTime,
      ...metadata
    });
  }

  /**
   * Legacy end method for backward compatibility
   */
  end(name: string, metadata?: Record<string, unknown>): PerformanceMeasurement | null {
    const endTime = performance.now();
    const startTime = this.measurements.get(name);

    if (!startTime) {
      performanceLogger.warn(`No start time found for measurement: ${name}`);
      return null;
    }

    const duration = endTime - startTime;
    const measurement: PerformanceMeasurement = {
      name,
      duration,
      startTime,
      endTime,
      metadata,
    };

    // Log based on performance thresholds
    const logLevel = this.getLogLevel(duration);
    const message = `Performance measurement completed: ${name}`;
    const context = {
      duration: `${duration.toFixed(2)}ms`,
      threshold: this.getThresholdLabel(duration),
      ...metadata
    };

    switch (logLevel) {
      case 'debug':
        performanceLogger.debug(message, context);
        break;
      case 'info':
        performanceLogger.info(message, context);
        break;
      case 'warn':
        performanceLogger.warn(message, context);
        break;
      case 'error':
        performanceLogger.error(message, undefined, context);
        break;
    }

    // Clean up
    this.measurements.delete(name);
    return measurement;
  }

  /**
   * Get appropriate log level based on duration
   */
  private getLogLevel(duration: number): 'debug' | 'info' | 'warn' | 'error' {
    if (duration >= PERFORMANCE_THRESHOLDS.critical) return 'error';
    if (duration >= PERFORMANCE_THRESHOLDS.warning) return 'warn';
    if (duration >= PERFORMANCE_THRESHOLDS.slow) return 'info';
    return 'debug';
  }

  /**
   * Get threshold label for duration
   */
  private getThresholdLabel(duration: number): string {
    if (duration >= PERFORMANCE_THRESHOLDS.critical) return 'critical';
    if (duration >= PERFORMANCE_THRESHOLDS.warning) return 'warning';
    if (duration >= PERFORMANCE_THRESHOLDS.slow) return 'slow';
    return 'fast';
  }

  /**
   * Measure a function's execution time
   */
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startMeasurement(name, metadata);
    try {
      const result = fn();
      this.endMeasurement(name);
      return result;
    } catch (error) {
      this.endMeasurement(name);
      throw error;
    }
  }

  /**
   * Track component render performance
   */
  trackComponentRender(componentName: string, renderTime: number, propsChanged: boolean = false): void {
    if (!this.isEnabled) return;

    const existing = this.componentMetrics.get(componentName) || {
      componentName,
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      propsChanges: 0,
    };

    existing.renderCount++;
    existing.totalRenderTime += renderTime;
    existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
    existing.lastRenderTime = renderTime;
    
    if (propsChanged) {
      existing.propsChanges++;
    }

    this.componentMetrics.set(componentName, existing);

    // Warn about frequent re-renders
    if (existing.renderCount > PERFORMANCE_THRESHOLDS.frequentRerenders && existing.averageRenderTime > 5) {
      console.warn(`🔄 Frequent re-renders detected in ${componentName}:`, {
        renderCount: existing.renderCount,
        averageTime: existing.averageRenderTime.toFixed(2),
        propsChanges: existing.propsChanges,
      });
    }
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage(): MemoryMetrics | null {
    if (!this.isEnabled || !(performance as any).memory) return null;

    const memory = (performance as any).memory;
    const usagePercentage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;

    const metrics: MemoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage,
    };

    // Warn about high memory usage
    if (usagePercentage > PERFORMANCE_THRESHOLDS.highMemoryUsage) {
      console.warn(`🧠 High memory usage: ${usagePercentage.toFixed(1)}%`, metrics);
    }

    return metrics;
  }

  /**
   * Get component performance report
   */
  getComponentReport(): ComponentRenderMetrics[] {
    return Array.from(this.componentMetrics.values())
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.measurements.clear();
    this.componentMetrics.clear();
    this.metrics.componentRenders.clear();
    this.metrics.slowOperations = [];
    this.metrics.bundleChunks.clear();
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clear();
  }

  /**
   * Generate performance report
   */
  generateReport(): void {
    if (!this.isEnabled) return;

    console.group('📊 Performance Report');
    
    // Memory usage
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage) {
      console.log('Memory Usage:', {
        used: `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        percentage: `${memoryUsage.usagePercentage.toFixed(1)}%`,
      });
    }

    // Component renders
    const componentReport = this.getComponentReport();
    if (componentReport.length > 0) {
      console.log('Component Render Performance:', componentReport.slice(0, 10));
    }

    // Recent metrics
    const recentMetrics = this.metrics.slowOperations.slice(-10); // Last 10
    
    if (recentMetrics.length > 0) {
      console.log('Slowest Operations:', recentMetrics);
    }

    console.groupEnd();
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.destroy();
    } else if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  /**
   * Track bundle chunk loading
   */
  trackChunkLoad(chunkName: string, size?: number) {
    this.metrics.bundleChunks.set(chunkName, { loaded: true, size });
    console.debug(`📦 Chunk loaded: ${chunkName}${size ? ` (${size} bytes)` : ''}`);
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      componentRenders: Object.fromEntries(this.metrics.componentRenders),
      slowOperations: this.metrics.slowOperations.slice(-10), // Last 10
      bundleChunks: Object.fromEntries(this.metrics.bundleChunks),
      webVitals: this.getWebVitals(),
    };
  }

  /**
   * Get Web Vitals metrics
   */
  private getWebVitals() {
    if (typeof window === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return {};

    return {
      FCP: navigation.responseStart - navigation.fetchStart,
      LCP: navigation.loadEventEnd - navigation.fetchStart,
      TTFB: navigation.responseStart - navigation.requestStart,
      DOMLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    };
  }
}

/**
 * FPS Monitor for tracking frame rate performance
 */
class FPSMonitor {
  private frames = 0;
  private lastTime = performance.now();
  private currentFPS = 0;
  private isMonitoring = false;

  start(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.frames = 0;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.isMonitoring = false;
  }

  private tick = (): void => {
    if (!this.isMonitoring) return;

    this.frames++;
    const now = performance.now();

    if (now >= this.lastTime + 1000) {
      this.currentFPS = Math.round((this.frames * 1000) / (now - this.lastTime));
      this.frames = 0;
      this.lastTime = now;

      // Warn about low FPS
      if (this.currentFPS < 30) {
        console.warn(`🎯 Low FPS detected: ${this.currentFPS} fps`);
      }
    }

    if (this.isMonitoring) {
      requestAnimationFrame(this.tick);
    }
  };

  getCurrentFPS(): number {
    return this.currentFPS;
  }
}

// Global instances
export const performanceMonitor = new PerformanceMonitor();
export const fpsMonitor = new FPSMonitor();

/**
 * Decorator function to measure function performance
 */
export function measureFunctionPerformance<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  return ((...args: any[]) => {
    const functionName = name || fn.name || 'anonymous';
    performanceMonitor.startMeasurement(functionName);
    try {
      const result = fn(...args);
      performanceMonitor.endMeasurement(functionName);
      return result;
    } catch (error) {
      performanceMonitor.endMeasurement(functionName);
      throw error;
    }
  }) as T;
}

/**
 * Create a performance observer for specific entry types
 */
export function createPerformanceObserver(
  entryTypes: string[],
  callback?: (entries: PerformanceEntry[]) => void
): PerformanceObserver | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    performanceLogger.warn('PerformanceObserver not available');
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      if (callback) {
        callback(entries);
      } else {
        entries.forEach((entry) => {
          performanceLogger.debug(`Performance entry: ${entry.name}`, {
            type: entry.entryType,
            duration: entry.duration,
            startTime: entry.startTime,
          });
        });
      }
    });

    observer.observe({ entryTypes });
    return observer;
  } catch (error) {
    performanceLogger.error('Failed to create PerformanceObserver', error);
    return null;
  }
}

/**
 * Log current performance metrics
 */
export function logPerformanceMetrics(): void {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigation) {
    const metrics = {
      DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
      TCP: navigation.connectEnd - navigation.connectStart,
      SSL: navigation.secureConnectionStart ? navigation.connectEnd - navigation.secureConnectionStart : 0,
      TTFB: navigation.responseStart - navigation.requestStart,
      Download: navigation.responseEnd - navigation.responseStart,
      DOM: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      Load: navigation.loadEventEnd - navigation.loadEventStart,
    };

    performanceLogger.info('Navigation timing metrics', metrics);
  }

  // Get memory usage if available
  const memoryUsage = performanceMonitor.getMemoryUsage();
  if (memoryUsage) {
    performanceLogger.info('Memory usage', {
      used: `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
    });
  }
}

/**
 * Utility function to debounce expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function to throttle expensive operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Performance optimization helpers
export const optimizeComponent = {
  /**
   * Create a memoized equality function for React.memo
   */
  createMemoComparison: <T extends Record<string, any>>(
    keys: (keyof T)[]
  ) => (prevProps: T, nextProps: T): boolean => {
    return keys.every(key => prevProps[key] === nextProps[key]);
  },

  /**
   * Shallow compare function for React.memo
   */
  shallowEqual: <T extends Record<string, any>>(prevProps: T, nextProps: T): boolean => {
    const keys1 = Object.keys(prevProps) as (keyof T)[];
    const keys2 = Object.keys(nextProps) as (keyof T)[];
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => prevProps[key] === nextProps[key]);
  },

  /**
   * Deep compare for complex objects (use sparingly)
   */
  deepEqual: (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => optimizeComponent.deepEqual(a[key], b[key]));
    }
    
    return false;
  },
};

// React hooks for performance monitoring
export const usePerformanceTracking = (componentName: string) => {
  if (typeof window === 'undefined') return { measureRender: () => {} };

  const measureRender = (propsChanged = false) => {
    const renderTime = performance.now();
    performanceMonitor.trackComponentRender(componentName, renderTime, propsChanged);
  };

  return { measureRender };
};

/**
 * High-performance lazy loading utility with preloading
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  options?: {
    chunkName?: string;
    preload?: boolean;
    fallback?: React.ComponentType;
  }
) {
  const { chunkName, preload = false, fallback } = options || {};
  
  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    importFunction().then(() => {
      if (chunkName) {
        performanceMonitor.trackChunkLoad(chunkName);
      }
    });
  }

  const LazyComponent = React.lazy(async () => {
    const startTime = performance.now();
    const module = await importFunction();
    const duration = performance.now() - startTime;
    
    if (chunkName) {
      performanceMonitor.trackChunkLoad(chunkName);
      console.debug(`📦 Loaded ${chunkName} in ${duration.toFixed(2)}ms`);
    }
    
    return module;
  });

  return LazyComponent;
}

/**
 * Optimized state transition utility
 */
export function useOptimizedTransition() {
  return {
    /**
     * Start a non-urgent state update
     */
    startTransition: (callback: () => void) => {
      startTransition(() => {
        callback();
      });
    },
    
    /**
     * Defer an operation to the next idle period
     */
    scheduleIdleWork: (callback: () => void, timeout = 5000) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(callback, 0);
      }
    },
    
    /**
     * Batch multiple state updates
     */
    batchUpdates: (updates: Array<() => void>) => {
      startTransition(() => {
        updates.forEach(update => update());
      });
    },
  };
}

/**
 * Memory optimization utilities
 */
export const memoryOptimizer = {
  /**
   * Cleanup component references
   */
  cleanupComponent: (componentName: string) => {
    // Clear performance marks
    performance.clearMarks(`${componentName}-*`);
    performance.clearMeasures(`${componentName}-*`);
  },

  /**
   * Monitor memory usage
   */
  getMemoryInfo: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100,
      };
    }
    return null;
  },

  /**
   * Trigger garbage collection (dev only)
   */
  forceGC: () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
      console.debug('🗑️ Forced garbage collection');
    }
  },
};

/**
 * Bundle optimization utilities
 */
export const bundleOptimizer = {
  /**
   * Preload critical chunks
   */
  preloadCriticalChunks: (chunkNames: string[]) => {
    chunkNames.forEach(chunkName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `/chunks/${chunkName}.js`;
      link.as = 'script';
      document.head.appendChild(link);
    });
  },

  /**
   * Report bundle size
   */
  reportBundleSize: () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;
    
    scripts.forEach(async (script) => {
      try {
        const response = await fetch((script as HTMLScriptElement).src, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        totalSize += size;
        performanceMonitor.trackChunkLoad((script as HTMLScriptElement).src.split('/').pop() || 'unknown', size);
      } catch (error) {
        console.debug('Could not get bundle size for:', script);
      }
    });
    
    console.debug(`📦 Total bundle size: ${Math.round(totalSize / 1024)} KB`);
  },
};

// Export React import for the lazy component function
import React from 'react'; 
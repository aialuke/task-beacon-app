/**
 * Performance utilities
 * 
 * Comprehensive performance monitoring and optimization utilities.
 * Migrated from src/lib/performanceUtils.ts - use this path going forward.
 */

import { performanceLogger } from '../logger';

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
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  slow: 100, // 100ms
  warning: 500, // 500ms
  critical: 1000, // 1s
};

class PerformanceMonitor {
  private measurements = new Map<string, number>();
  private observers = new Map<string, PerformanceObserver>();

  /**
   * Start measuring performance for a given operation
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
   * End measuring performance and log results
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
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * FPS monitoring utilities
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
    
    performanceLogger.debug('FPS monitoring started');
    this.tick();
  }

  stop(): void {
    this.isMonitoring = false;
    performanceLogger.debug('FPS monitoring stopped', { finalFPS: this.currentFPS });
  }

  private tick = (): void => {
    if (!this.isMonitoring) return;

    this.frames++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) { // Update every second
      this.currentFPS = (this.frames * 1000) / elapsed;
      
      performanceLogger.debug(`Current FPS: ${this.currentFPS.toFixed(1)}`, {
        fps: this.currentFPS,
        frames: this.frames,
        elapsed: `${elapsed.toFixed(2)}ms`
      });

      this.frames = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(this.tick);
  };

  getCurrentFPS(): number {
    return this.currentFPS;
  }
}

export const fpsMonitor = new FPSMonitor();

/**
 * Measure function execution time
 */
export function measureFunctionPerformance<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  const measurementName = name || fn.name || 'anonymous-function';
  
  return ((...args: Parameters<T>) => {
    performanceMonitor.start(measurementName, { args: args.length });
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result
          .then((res) => {
            performanceMonitor.end(measurementName, { success: true });
            return res;
          })
          .catch((error) => {
            performanceMonitor.end(measurementName, { success: false, error: error.message });
            throw error;
          });
      } else {
        performanceMonitor.end(measurementName, { success: true });
        return result;
      }
    } catch (error) {
      performanceMonitor.end(measurementName, { success: false, error: (error as Error).message });
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
  if (!window.PerformanceObserver) {
    performanceLogger.warn('PerformanceObserver not supported in this browser');
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      performanceLogger.debug('Performance entries observed', {
        count: entries.length,
        types: entryTypes
      });
      
      callback?.(entries);
    });

    observer.observe({ entryTypes });
    return observer;
  } catch (error) {
    performanceLogger.error('Failed to create performance observer', error as Error, { entryTypes });
    return null;
  }
}

/**
 * Get memory usage information
 */
export function getMemoryUsage(): Record<string, number> | null {
  if (!('memory' in performance)) {
    performanceLogger.debug('Memory API not available');
    return null;
  }

  const memory = (performance as any).memory;
  const usage = {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };

  performanceLogger.debug('Memory usage retrieved', {
    used: `${(usage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
    total: `${(usage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
    limit: `${(usage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
  });

  return usage;
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics(): void {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        domComplete: navigation.domComplete - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0,
      };

      // Get paint timings
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      performanceLogger.info('Page performance metrics', {
        domContentLoaded: `${metrics.domContentLoaded.toFixed(2)}ms`,
        domComplete: `${metrics.domComplete.toFixed(2)}ms`,
        loadComplete: `${metrics.loadComplete.toFixed(2)}ms`,
        firstPaint: metrics.firstPaint ? `${metrics.firstPaint.toFixed(2)}ms` : 'N/A',
        firstContentfulPaint: metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint.toFixed(2)}ms` : 'N/A',
      });
    }
  }
}

/**
 * Debounce utility for performance optimization
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
 * Throttle utility for performance optimization
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
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Legacy export for backward compatibility
export const performanceUtils = {
  performanceMonitor,
  fpsMonitor,
  measureFunctionPerformance,
  createPerformanceObserver,
  getMemoryUsage,
  logPerformanceMetrics,
  debounce,
  throttle,
  PERFORMANCE_THRESHOLDS,
}; 
import * as React from 'react';

/**
 * Performance monitoring utilities for animations and components
 */

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  fps?: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private frameCount = 0;
  private lastFPSUpdate = 0;
  private currentFPS = 0;

  /**
   * Start measuring performance for a given operation
   */
  startMeasurement(name: string): string {
    const id = `${name}-${Date.now()}`;
    const metric: PerformanceMetrics = {
      name: id,
      startTime: performance.now(),
    };

    this.metrics.push(metric);

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance measurement started: ${name}`);
    }

    return id;
  }

  /**
   * End measurement and calculate duration
   */
  endMeasurement(id: string): number | null {
    const metric = this.metrics.find(m => m.name === id);
    if (!metric) return null;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Add memory usage if available
    if ('memory' in performance) {
      metric.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `⏱️ Performance measurement completed: ${id} - ${metric.duration.toFixed(2)}ms`
      );

      if (metric.duration > 16.67) {
        // More than one frame at 60fps
        console.warn(
          `⚠️ Slow operation detected: ${id} took ${metric.duration.toFixed(2)}ms`
        );
      }
    }

    return metric.duration;
  }

  /**
   * Monitor FPS during animations
   */
  startFPSMonitoring(): () => void {
    let animationId: number;
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();

    const updateFPS = () => {
      this.frameCount++;
      const now = performance.now();

      if (now - this.lastFPSUpdate >= 1000) {
        // Update every second
        this.currentFPS = Math.round(
          (this.frameCount * 1000) / (now - this.lastFPSUpdate)
        );

        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Current FPS: ${this.currentFPS}`);

          if (this.currentFPS < 30) {
            console.warn(`⚠️ Low FPS detected: ${this.currentFPS}`);
          }
        }

        this.frameCount = 0;
        this.lastFPSUpdate = now;
      }

      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);

    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationId);
    };
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceMetrics[] {
    return this.metrics.filter(m => m.duration !== undefined);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.currentFPS;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * HOC to monitor component render performance
 */
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: T) {
    React.useEffect(() => {
      const id = performanceMonitor.startMeasurement(`${componentName}-render`);

      return () => {
        performanceMonitor.endMeasurement(id);
      };
    });

    return React.createElement(Component, props);
  };
}

/**
 * Hook to measure component performance
 */
export function usePerformanceMonitoring(componentName: string) {
  React.useEffect(() => {
    const id = performanceMonitor.startMeasurement(`${componentName}-mount`);

    return () => {
      performanceMonitor.endMeasurement(id);
    };
  }, [componentName]);

  const measureOperation = React.useCallback(
    (operationName: string, operation: () => void) => {
      const id = performanceMonitor.startMeasurement(
        `${componentName}-${operationName}`
      );
      operation();
      performanceMonitor.endMeasurement(id);
    },
    [componentName]
  );

  return { measureOperation };
}

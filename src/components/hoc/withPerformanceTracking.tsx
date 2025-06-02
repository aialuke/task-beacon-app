import { ComponentType, memo, forwardRef, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/utils/performance';
import { useRenderTracking } from '@/hooks/useOptimizedMemo';

interface PerformanceTrackingOptions {
  componentName?: string;
  trackRenders?: boolean;
  trackProps?: boolean;
  warnOnSlowRenders?: boolean;
  slowRenderThreshold?: number;
}

/**
 * Higher-order component that adds automatic performance tracking to any React component
 * 
 * Features:
 * - Automatic render time tracking
 * - Props change detection
 * - Slow render warnings
 * - Memory usage monitoring
 * - Component lifecycle tracking
 */
export function withPerformanceTracking<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  options: PerformanceTrackingOptions = {}
) {
  const {
    componentName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent',
    trackRenders = true,
    trackProps = true,
    warnOnSlowRenders = true,
    slowRenderThreshold = 16, // ms
  } = options;

  const PerformanceTrackedComponent = forwardRef<unknown, P>((props, ref) => {
    const mountTimeRef = useRef<number>(0);
    const renderCountRef = useRef<number>(0);
    const lastPropsRef = useRef<P | null>(null);

    // Use our optimized render tracking hook
    const { renderCount, markRenderComplete } = useRenderTracking(
      componentName,
      trackProps ? props : undefined
    );

    // Track component mount and unmount
    useEffect(() => {
      mountTimeRef.current = performance.now();
      performanceMonitor.start(`${componentName}-mount`);

      return () => {
        const mountDuration = performance.now() - mountTimeRef.current;
        const totalRenders = renderCountRef.current; // Capture current value
        performanceMonitor.end(`${componentName}-mount`);
        
        // Log component lifecycle metrics
        if (process.env.NODE_ENV === 'development') {
          console.debug(`📊 Component ${componentName} lifecycle:`, {
            totalMountTime: `${mountDuration.toFixed(2)}ms`,
            totalRenders: totalRenders,
            averageRenderTime: totalRenders > 0 
              ? `${(mountDuration / totalRenders).toFixed(2)}ms`
              : '0ms'
          });
        }
      };
    }, []); // Remove componentName dependency as it's stable

    // Track individual renders
    useEffect(() => {
      if (!trackRenders) return;

      const renderStartTime = performance.now();
      renderCountRef.current++;

      // Check for props changes
      let propsChanged = false;
      if (trackProps && lastPropsRef.current) {
        propsChanged = JSON.stringify(props) !== JSON.stringify(lastPropsRef.current);
      }
      lastPropsRef.current = props;

      // Use RAF to measure actual render completion
      requestAnimationFrame(() => {
        const renderDuration = performance.now() - renderStartTime;
        
        // Track render performance
        performanceMonitor.trackComponentRender(componentName, renderDuration, propsChanged);
        
        // Warn about slow renders
        if (warnOnSlowRenders && renderDuration > slowRenderThreshold) {
          console.warn(`🐌 Slow render in ${componentName}: ${renderDuration.toFixed(2)}ms`, {
            renderCount: renderCountRef.current,
            propsChanged,
            renderDuration
          });
        }

        markRenderComplete();
      });
    });

    return <WrappedComponent {...props} ref={ref} />;
  });

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${componentName})`;

  // Return memoized component to prevent unnecessary re-renders
  return memo(PerformanceTrackedComponent);
}

/**
 * Decorator function for class components (if needed for legacy support)
 */
export function performanceTracked(options?: PerformanceTrackingOptions) {
  return function <P extends Record<string, unknown>>(target: ComponentType<P>): ComponentType<P> {
    return withPerformanceTracking(target, options);
  };
}

/**
 * Hook version for functional components that prefer hooks over HOCs
 */
export function useComponentPerformanceTracking(
  componentName: string,
  props?: Record<string, unknown>,
  options: Omit<PerformanceTrackingOptions, 'componentName'> = {}
) {
  const {
    trackRenders = true,
    trackProps = true,
    warnOnSlowRenders = true,
    slowRenderThreshold = 16,
  } = options;

  const renderStartRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  // Track render start
  if (trackRenders) {
    renderStartRef.current = performance.now();
  }

  // Use optimized render tracking
  const { renderCount, markRenderComplete } = useRenderTracking(
    componentName,
    trackProps ? props : undefined
  );

  // Track mount
  useEffect(() => {
    mountTimeRef.current = performance.now();
    performanceMonitor.start(`${componentName}-mount`);

    return () => {
      performanceMonitor.end(`${componentName}-mount`);
    };
  }, [componentName]);

  // Track render completion
  useEffect(() => {
    if (!trackRenders) return;

    requestAnimationFrame(() => {
      const renderDuration = performance.now() - renderStartRef.current;
      
      if (warnOnSlowRenders && renderDuration > slowRenderThreshold) {
        console.warn(`🐌 Slow render in ${componentName}: ${renderDuration.toFixed(2)}ms`);
      }

      markRenderComplete();
    });
  });

  return {
    renderCount,
    markRenderComplete,
    componentName,
  };
}

/**
 * Performance tracking utilities for manual instrumentation
 */
export const performanceUtils = {
  /**
   * Mark the start of a performance-critical operation
   */
  startOperation: (name: string, metadata?: Record<string, unknown>) => {
    performanceMonitor.start(name, metadata);
  },

  /**
   * Mark the end of a performance-critical operation
   */
  endOperation: (name: string) => {
    return performanceMonitor.end(name);
  },

  /**
   * Measure a synchronous operation
   */
  measureSync<T>(name: string, operation: () => T, metadata?: Record<string, unknown>): T {
    return performanceMonitor.measure(name, operation, metadata);
  },

  /**
   * Measure an asynchronous operation
   */
  async measureAsync<T>(
    name: string, 
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    performanceMonitor.start(name, metadata);
    try {
      const result = await operation();
      performanceMonitor.end(name);
      return result;
    } catch (error) {
      performanceMonitor.end(name);
      throw error;
    }
  },
}; 
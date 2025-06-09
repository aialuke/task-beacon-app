
/**
 * Lazy Component System - Phase 4 Consolidation
 * 
 * Updated to use unified loading states from single source.
 */

import { lazy, Suspense, ComponentType, useEffect, useCallback, memo } from 'react';
import { LoadingSpinner, PageLoader, CardLoader, InlineLoader } from './loading/UnifiedLoadingStates';

// === INTERFACE DEFINITIONS ===
interface LazyComponentProps {
  fallback?: React.ReactNode;
  className?: string;
}

// === PERFORMANCE MONITORING (Optimized) ===
const lazyLoadingMetrics = {
  trackComponentLoad: (componentName: string, startTime: number) => {
    if (process.env.NODE_ENV === 'development') {
      const loadTime = performance.now() - startTime;
      console.debug(`[LazyLoading] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Performance thresholds
      if (loadTime > 1000) {
        console.warn(`[LazyLoading] Slow loading component: ${componentName} (${loadTime.toFixed(2)}ms)`);
      }
    }
  },
  
  // Bundle size tracking (development only)
  trackBundleSize: (componentName: string) => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.debug(`[LazyLoading] ${componentName} memory usage:`, {
        used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
      });
    }
  },
};

// === OPTIMIZED HIGHER-ORDER COMPONENT ===
export function withLazyLoading<T extends Record<string, any> = Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentProps & { 
    componentName?: string;
    preload?: boolean;
  } = {}
) {
  const { componentName = 'UnknownComponent', preload = false } = options;
  
  const LazyComponent = lazy(() => {
    const startTime = performance.now();
    
    return importFn().then(module => {
      lazyLoadingMetrics.trackComponentLoad(componentName, startTime);
      lazyLoadingMetrics.trackBundleSize(componentName);
      return module;
    });
  });
  
  const WrappedComponent = memo(function WrappedLazyComponent(props: T) {
    const fallback = options.fallback ?? <LoadingSpinner size="md" />;
    
    // Preload optimization
    useEffect(() => {
      if (preload) {
        const timer = setTimeout(() => {
          importFn().catch(() => {
            // Silent fail for preloading
          });
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }, []);
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  });
  
  // Development display name
  if (process.env.NODE_ENV === 'development') {
    WrappedComponent.displayName = `LazyWrapper(${componentName})`;
  }
  
  return WrappedComponent;
}

// === OPTIMIZED COMPONENT FACTORIES ===
export const LazyComponents = {
  /**
   * Create optimized lazy-loaded form component
   */
  createLazyForm: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    formName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyForm_${formName}`,
    fallback: <CardLoader count={1} />,
    preload: false, // Forms are user-initiated
  }),
  
  /**
   * Create optimized lazy-loaded list component
   */
  createLazyList: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    listName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyList_${listName}`,
    fallback: <InlineLoader message="Loading list..." />,
    preload: true, // Lists are commonly accessed
  }),
  
  /**
   * Create optimized lazy-loaded modal component
   */
  createLazyModal: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    modalName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyModal_${modalName}`,
    fallback: (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <LoadingSpinner size="xl" />
        </div>
      </div>
    ),
    preload: false, // Modals are user-initiated
  }),
  
  /**
   * Create optimized lazy-loaded page component
   */
  createLazyPage: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    pageName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyPage_${pageName}`,
    fallback: <PageLoader message={`Loading ${pageName}...`} />,
    preload: true, // Pages benefit from preloading
  }),
};

// === BUNDLE SIZE OPTIMIZATION ===
if (process.env.NODE_ENV === 'production') {
  // Remove development-only code in production builds
  delete (lazyLoadingMetrics as any).trackBundleSize;
  (lazyLoadingMetrics as any).trackComponentLoad = () => {};
}

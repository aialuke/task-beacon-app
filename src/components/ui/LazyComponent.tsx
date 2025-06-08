
import { lazy, Suspense, ComponentType, useEffect } from 'react';
import UnifiedLoadingStates from './loading/UnifiedLoadingStates';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
}

/**
 * Simple metrics tracking for lazy loading performance
 */
const lazyLoadingMetrics = {
  trackComponentLoad: (componentName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    console.debug(`[LazyLoading] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
  },
};

/**
 * Higher-order component for lazy loading with enhanced error handling and performance tracking
 */
export function withLazyLoading<T extends Record<string, any> = Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentProps & { componentName?: string } = {}
) {
  const { componentName = 'UnknownComponent' } = options;
  
  const LazyComponent = lazy(importFn);
  
  return function WrappedLazyComponent(props: T) {
    const fallback = options.fallback ?? <UnifiedLoadingStates variant="spinner" />;
    const loadStartTime = performance.now();
    
    // Track loading performance
    useEffect(() => {
      lazyLoadingMetrics.trackComponentLoad(componentName, loadStartTime);
    }, [componentName, loadStartTime]);
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

/**
 * Generic lazy wrapper component with performance optimization
 */
export function LazyWrapper({ 
  children, 
  fallback = <UnifiedLoadingStates variant="spinner" />,
  componentName = 'LazyWrapper'
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}) {
  const loadStartTime = performance.now();
  
  // Track loading performance
  useEffect(() => {
    lazyLoadingMetrics.trackComponentLoad(componentName, loadStartTime);
  }, [componentName, loadStartTime]);
  
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

/**
 * Optimized lazy loading for specific component types
 */
export const LazyComponents = {
  /**
   * Create lazy-loaded form component
   */
  createLazyForm: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    formName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyForm_${formName}`,
    fallback: (
      <div className="p-6 rounded-xl border border-border bg-card animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    ),
  }),
  
  /**
   * Create lazy-loaded list component
   */
  createLazyList: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    listName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyList_${listName}`,
    fallback: <UnifiedLoadingStates variant="skeleton" message={`Loading ${listName}...`} />,
  }),
  
  /**
   * Create lazy-loaded modal component
   */
  createLazyModal: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    modalName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyModal_${modalName}`,
    fallback: (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <UnifiedLoadingStates variant="spinner" message={`Loading ${modalName}...`} />
        </div>
      </div>
    ),
  }),
};

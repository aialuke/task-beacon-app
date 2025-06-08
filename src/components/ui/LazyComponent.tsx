
import { lazy, Suspense, ComponentType, useEffect } from 'react';
import { LoadingSpinner } from './loading/UnifiedLoadingStates';
import PageLoader from './loading/PageLoader';
import CardLoader from './loading/CardLoader';
import InlineLoader from './loading/InlineLoader';

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
    const fallback = options.fallback ?? <LoadingSpinner size="md" />;
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
  fallback = <LoadingSpinner size="md" />,
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
 * Phase 2: Simplified lazy loading for specific component types
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
    fallback: <CardLoader count={1} />,
  }),
  
  /**
   * Create lazy-loaded list component
   */
  createLazyList: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    listName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyList_${listName}`,
    fallback: <InlineLoader message="Loading list..." />,
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
          <LoadingSpinner size="xl" />
        </div>
      </div>
    ),
  }),
  
  /**
   * Create lazy-loaded page component
   */
  createLazyPage: <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    pageName: string
  ) => withLazyLoading(importFn, {
    componentName: `LazyPage_${pageName}`,
    fallback: <PageLoader message={`Loading ${pageName}...`} />,
  }),
};

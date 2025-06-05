
import { lazy, Suspense, ComponentType } from 'react';
import { LoadingSpinner } from './layout/LoadingSpinner';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
}

/**
 * Higher-order component for lazy loading with error boundary
 */
export function withLazyLoading<T extends Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedLazyComponent(props: T) {
    const fallback = options.fallback || <LoadingSpinner />;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Generic lazy wrapper component
 */
export function LazyWrapper({ 
  children, 
  fallback = <LoadingSpinner /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

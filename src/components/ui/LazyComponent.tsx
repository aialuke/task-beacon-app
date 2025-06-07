
import { lazy, Suspense, ComponentType } from 'react';
import UnifiedLoadingStates from './loading/UnifiedLoadingStates';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
}

/**
 * Higher-order component for lazy loading with error boundary
 */
export function withLazyLoading<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedLazyComponent(props: T) {
    const fallback = options.fallback ?? <UnifiedLoadingStates variant="spinner" />;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...(props as T)} />
      </Suspense>
    );
  };
}

/**
 * Generic lazy wrapper component
 */
export function LazyWrapper({ 
  children, 
  fallback = <UnifiedLoadingStates variant="spinner" /> 
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


/**
 * Component Patterns - Standardized Component Utilities
 * 
 * Provides consistent patterns for component creation, memoization, and structure.
 */

import { memo, forwardRef, type ComponentType, type ForwardRefExoticComponent, type RefAttributes } from 'react';

/**
 * Standardized memoization options
 */
export interface MemoizationOptions<P = any> {
  /**
   * Custom comparison function for memoization
   */
  compare?: (prevProps: P, nextProps: P) => boolean;
  
  /**
   * Display name for the memoized component
   */
  displayName?: string;
  
  /**
   * Whether to enable deep comparison (use sparingly)
   */
  deepCompare?: boolean;
}

/**
 * Standardized memoization utility with consistent patterns
 */
export function memoizeComponent<P extends object>(
  Component: ComponentType<P>,
  options: MemoizationOptions<P> = {}
): ComponentType<P> {
  const { compare, displayName, deepCompare = false } = options;
  
  let compareFunction = compare;
  
  // Use shallow comparison by default
  if (!compareFunction && !deepCompare) {
    compareFunction = (prevProps: P, nextProps: P) => {
      const prevKeys = Object.keys(prevProps);
      const nextKeys = Object.keys(nextProps);
      
      if (prevKeys.length !== nextKeys.length) return false;
      
      return prevKeys.every(key => 
        prevProps[key as keyof P] === nextProps[key as keyof P]
      );
    };
  }
  
  const MemoizedComponent = memo(Component, compareFunction);
  
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  } else if (Component.displayName || Component.name) {
    MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  }
  
  return MemoizedComponent;
}

/**
 * Standardized forwardRef utility with consistent patterns
 */
export function createForwardRefComponent<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  displayName?: string
): ForwardRefExoticComponent<P & RefAttributes<T>> {
  const ForwardRefComponent = forwardRef<T, P>(render);
  
  if (displayName) {
    ForwardRefComponent.displayName = displayName;
  }
  
  return ForwardRefComponent;
}

/**
 * Standard component prop patterns
 */
export interface StandardComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface StandardInteractiveProps extends StandardComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

/**
 * Component lifecycle hooks for consistent behavior
 */
export interface ComponentLifecycleHooks {
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: () => void;
}

/**
 * Standard error boundary props pattern
 */
export interface StandardErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }> | React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

/**
 * Performance optimization utilities
 */
export const ComponentPatterns = {
  /**
   * Create a performance-optimized component with standard patterns
   */
  createOptimizedComponent: <P extends object>(
    Component: ComponentType<P>,
    options: MemoizationOptions<P> & {
      enableProfiling?: boolean;
    } = {}
  ) => {
    const { enableProfiling = false, ...memoOptions } = options;
    
    let OptimizedComponent = memoizeComponent(Component, memoOptions);
    
    // Add performance profiling in development
    if (enableProfiling && process.env.NODE_ENV === 'development') {
      const ProfiledComponent = (props: P) => {
        const startTime = performance.now();
        
        React.useEffect(() => {
          const endTime = performance.now();
          console.log(`${Component.displayName || Component.name} render time: ${endTime - startTime}ms`);
        });
        
        return React.createElement(OptimizedComponent, props);
      };
      
      ProfiledComponent.displayName = `Profiled(${OptimizedComponent.displayName})`;
      OptimizedComponent = ProfiledComponent as ComponentType<P>;
    }
    
    return OptimizedComponent;
  },
  
  /**
   * Standard loading state wrapper
   */
  withLoadingState: <P extends object>(
    Component: ComponentType<P & { isLoading?: boolean }>
  ) => {
    const ComponentWithLoading = (props: P & { isLoading?: boolean; loadingComponent?: React.ReactNode }) => {
      const { isLoading, loadingComponent, ...componentProps } = props;
      
      if (isLoading) {
        return loadingComponent || <div className="animate-pulse">Loading...</div>;
      }
      
      return React.createElement(Component, componentProps as P & { isLoading?: boolean });
    };
    
    ComponentWithLoading.displayName = `WithLoading(${Component.displayName || Component.name})`;
    return ComponentWithLoading;
  },
  
  /**
   * Standard error boundary wrapper
   */
  withErrorBoundary: <P extends object>(
    Component: ComponentType<P>,
    errorBoundaryProps?: Partial<StandardErrorBoundaryProps>
  ) => {
    const ComponentWithErrorBoundary = (props: P) => {
      return React.createElement(
        React.Suspense,
        { fallback: <div>Loading...</div> },
        React.createElement(Component, props)
      );
    };
    
    ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name})`;
    return ComponentWithErrorBoundary;
  },
};

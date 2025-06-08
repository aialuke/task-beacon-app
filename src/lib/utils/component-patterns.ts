
import React, { memo, forwardRef, type ComponentType, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export interface MemoizationOptions<P = any> {
  compare?: (prevProps: P, nextProps: P) => boolean;
  displayName?: string;
  deepCompare?: boolean;
}

export function memoizeComponent<P extends object>(
  Component: ComponentType<P>,
  options: MemoizationOptions<P> = {}
): ComponentType<P> {
  const { compare, displayName, deepCompare = false } = options;
  
  let compareFunction = compare;
  
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
    const componentName = Component.displayName || Component.name;
    MemoizedComponent.displayName = "Memoized(" + componentName + ")";
  }
  
  return MemoizedComponent;
}

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

export interface ComponentLifecycleHooks {
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: () => void;
}

export interface StandardErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }> | React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

function createOptimizedComponent<P extends object>(
  Component: ComponentType<P>,
  options: MemoizationOptions<P> & {
    enableProfiling?: boolean;
  } = {}
): ComponentType<P> {
  const { enableProfiling = false, ...memoOptions } = options;
  
  let OptimizedComponent = memoizeComponent(Component, memoOptions);
  
  if (enableProfiling && process.env.NODE_ENV === 'development') {
    const ProfiledComponent = (props: P) => {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const endTime = performance.now();
        const componentName = Component.displayName || Component.name;
        console.log(componentName + " render time: " + (endTime - startTime) + "ms");
      });
      
      return React.createElement(OptimizedComponent, props);
    };
    
    const originalName = OptimizedComponent.displayName;
    ProfiledComponent.displayName = "Profiled(" + originalName + ")";
    OptimizedComponent = ProfiledComponent as ComponentType<P>;
  }
  
  return OptimizedComponent;
}

function withLoadingState<P extends object>(
  Component: ComponentType<P & { isLoading?: boolean }>
) {
  const ComponentWithLoading = (props: P & { isLoading?: boolean; loadingComponent?: React.ReactNode }) => {
    const { isLoading, loadingComponent, ...componentProps } = props;
    
    if (isLoading) {
      return loadingComponent || React.createElement('div', { className: 'animate-pulse' }, 'Loading...');
    }
    
    return React.createElement(Component, componentProps as P & { isLoading?: boolean });
  };
  
  const originalName = Component.displayName || Component.name;
  ComponentWithLoading.displayName = "WithLoading(" + originalName + ")";
  return ComponentWithLoading;
}

function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Partial<StandardErrorBoundaryProps>
) {
  const ComponentWithErrorBoundary = (props: P) => {
    return React.createElement(
      React.Suspense,
      { fallback: React.createElement('div', null, 'Loading...') },
      React.createElement(Component, props)
    );
  };
  
  const originalName = Component.displayName || Component.name;
  ComponentWithErrorBoundary.displayName = "WithErrorBoundary(" + originalName + ")";
  return ComponentWithErrorBoundary;
}

export const ComponentPatterns = {
  createOptimizedComponent,
  withLoadingState,
  withErrorBoundary,
};

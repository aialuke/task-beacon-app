/**
 * Common React Patterns Utilities
 * 
 * Provides reusable patterns for React components and hooks.
 * Consolidates common patterns to reduce code duplication.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Higher-order component pattern for error boundaries
 */
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const WrappedComponent = (props: T) => {
    const [error, setError] = useState<Error | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const retry = useCallback(() => {
      setError(null);
      setRetryCount(prev => prev + 1);
    }, []);

    if (error && fallback) {
      const FallbackComponent = fallback;
      return React.createElement(FallbackComponent, { error, retry });
    }

    if (error) {
      return React.createElement(
        'div',
        { className: 'p-4 text-center' },
        React.createElement('p', { className: 'text-destructive mb-2' }, 'Something went wrong'),
        React.createElement(
          'button',
          {
            onClick: retry,
            className: 'px-4 py-2 bg-primary text-primary-foreground rounded'
          },
          'Try Again'
        )
      );
    }

    try {
      return React.createElement(Component, { ...props, key: retryCount });
    } catch (caughtError) {
      setError(caughtError as Error);
      return null;
    }
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Higher-order component for loading states
 */
export function withLoading<T extends object>(
  Component: React.ComponentType<T>,
  LoadingComponent?: React.ComponentType
) {
  return function WrappedComponent(props: T & { loading?: boolean }) {
    const { loading, ...restProps } = props;

    if (loading) {
      return LoadingComponent ? 
        React.createElement(LoadingComponent) : 
        React.createElement(
          'div',
          { className: 'flex items-center justify-center p-8' },
          React.createElement('div', { 
            className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary' 
          })
        );
    }

    return React.createElement(Component, restProps as T);
  };
}

/**
 * Conditional rendering pattern
 */
export function ConditionalRender({ 
  condition, 
  children, 
  fallback 
}: {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return condition ? children : fallback || null;
}

/**
 * Render prop pattern for data fetching
 */
export interface RenderDataProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export function DataRenderer<T>({ 
  children,
  ...dataProps
}: RenderDataProps<T> & {
  children: (props: RenderDataProps<T>) => React.ReactNode;
}) {
  return children(dataProps);
}

/**
 * Portal pattern for rendering outside component tree
 */
export function createPortalRenderer(containerId: string) {
  return function PortalRenderer({ children }: { children: React.ReactNode }) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
      let element = document.getElementById(containerId);
      if (!element) {
        element = document.createElement('div');
        element.id = containerId;
        document.body.appendChild(element);
      }
      setContainer(element);

      return () => {
        if (element && element.children.length === 0) {
          document.body.removeChild(element);
        }
      };
    }, []);

    if (!container) return null;

    // Note: In a real implementation, you'd use ReactDOM.createPortal
    // For this utility, we'll just render normally
    return children;
  };
}

/**
 * Compound component pattern helper
 */
export function createCompoundComponent<T extends Record<string, React.ComponentType<unknown>>>(
  components: T
) {
  return Object.assign(
    function CompoundComponent({ children }: { children: React.ReactNode }) {
      return children;
    },
    components
  );
}

/**
 * Render optimization patterns
 */
export function memo<T extends object>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  // This is a placeholder - in real React, you'd use React.memo
  return Component;
}

/**
 * State management patterns
 */
export interface StateManagerOptions<T> {
  initialState: T;
  reducer?: (state: T, action: unknown) => T;
  middleware?: Array<(state: T, action: unknown) => T>;
}

export function createStateManager<T>(options: StateManagerOptions<T>) {
  const { initialState, reducer, middleware = [] } = options;

  return function useStateManager() {
    const [state, setState] = useState<T>(initialState);

    const dispatch = useCallback((action: unknown) => {
      setState(currentState => {
        let newState = reducer ? reducer(currentState, action) : currentState;
        
        // Apply middleware
        for (const middlewareFn of middleware) {
          newState = middlewareFn(newState, action);
        }
        
        return newState;
      });
    }, []);

    return [state, dispatch] as const;
  };
}

/**
 * Event handling patterns
 */
export function useEventCallback<T extends (...args: unknown[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  }, deps);

  return useCallback((...args: unknown[]) => {
    return ref.current(...args);
  }, []) as T;
}

/**
 * Debounced callback pattern
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: unknown[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}

/**
 * Previous value tracking pattern
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Force update pattern
 */
export function useForceUpdate() {
  const [, setToggle] = useState(false);
  return useCallback(() => { setToggle(prev => !prev); }, []);
}

/**
 * Component lifecycle patterns
 */
export function useMount(callback: () => void | (() => void)) {
  useEffect(callback, []);
}

export function useUnmount(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}

/**
 * Async operation patterns
 */
export interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, deps);

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, loading: false, error: null });
    }, []),
  };
}

// Export patterns namespace for organized imports
export const reactPatterns = {
  withErrorBoundary,
  withLoading,
  ConditionalRender,
  DataRenderer,
  createPortalRenderer,
  createCompoundComponent,
  memo,
  createStateManager,
  useEventCallback,
  useDebouncedCallback,
  usePrevious,
  useForceUpdate,
  useMount,
  useUnmount,
  useAsyncOperation,
};

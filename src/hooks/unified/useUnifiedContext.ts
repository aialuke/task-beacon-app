
/**
 * Unified Context Management - Step 2.4 Implementation
 * 
 * Standardizes context creation and usage patterns across the application.
 * Consolidates different context approaches into a consistent system.
 */

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { useOptimizedMemo } from '@/hooks/performance';

// === CONTEXT TYPES ===
interface ContextOptions<T> {
  name: string;
  strict?: boolean;
  defaultValue?: T;
  errorMessage?: string;
}

interface ContextState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface ContextActions<T> {
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type ContextValue<T> = ContextState<T> & ContextActions<T>;

// === CONTEXT REDUCER ===
type ContextActionType<T> = 
  | { type: 'SET_DATA'; payload: T }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET'; payload: T };

function contextReducer<T>(state: ContextState<T>, action: ContextActionType<T>): ContextState<T> {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'RESET':
      return {
        data: action.payload,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

/**
 * Factory for creating unified contexts with consistent patterns
 */
export function createUnifiedContext<T>(
  initialData: T,
  options: ContextOptions<T>
) {
  const { name, strict = true, defaultValue, errorMessage } = options;

  // Create the context
  const Context = createContext<ContextValue<T> | undefined>(undefined);
  Context.displayName = `${name}Context`;

  // Provider component
  function Provider({ children, initialValue }: { 
    children: ReactNode; 
    initialValue?: T;
  }) {
    const [state, dispatch] = useReducer(contextReducer<T>, {
      data: initialValue || initialData,
      loading: false,
      error: null,
    });

    const actions: ContextActions<T> = useOptimizedMemo(
      () => ({
        setData: (data: T) => dispatch({ type: 'SET_DATA', payload: data }),
        setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
        setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
        reset: () => dispatch({ type: 'RESET', payload: initialValue || initialData }),
      }),
      [initialValue],
      { name: `${name}ContextActions` }
    );

    const value: ContextValue<T> = useOptimizedMemo(
      () => ({
        ...state,
        ...actions,
      }),
      [state, actions],
      { name: `${name}ContextValue` }
    );

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }

  Provider.displayName = `${name}Provider`;

  // Hook to use the context
  function useContextHook(): ContextValue<T> {
    const context = useContext(Context);

    if (strict && context === undefined) {
      const message = errorMessage ?? `use${name} must be used within a ${name}Provider`;
      throw new Error(message);
    }

    if (!strict && context === undefined) {
      if (defaultValue !== undefined) {
        // Return a mock context value for non-strict mode
        return {
          data: defaultValue,
          loading: false,
          error: null,
          setData: () => {},
          setLoading: () => {},
          setError: () => {},
          reset: () => {},
        };
      }
      throw new Error(`use${name} called outside provider and no defaultValue provided`);
    }

    return context as ContextValue<T>;
  }

  return {
    Context,
    Provider,
    useContext: useContextHook,
  };
}

/**
 * HOC for providing unified context to components
 */
export function withUnifiedContext<T, P extends object>(
  Component: React.ComponentType<P>,
  contextFactory: () => ReturnType<typeof createUnifiedContext<T>>,
  initialData: T
) {
  const { Provider } = contextFactory();

  const WrappedComponent = (props: P) => (
    <Provider initialValue={initialData}>
      <Component {...props} />
    </Provider>
  );

  WrappedComponent.displayName = `withUnifiedContext(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

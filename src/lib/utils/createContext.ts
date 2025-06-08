
/**
 * Standardized Context Creation Utility
 * 
 * Provides consistent patterns for creating React contexts with proper error handling.
 */

import { createContext, useContext, type Context } from 'react';

export interface StandardContextOptions {
  name: string;
  errorMessage?: string;
  strict?: boolean;
}

/**
 * Creates a standardized context with proper error handling and TypeScript support
 */
export function createStandardContext<T>(options: StandardContextOptions) {
  const { name, errorMessage, strict = true } = options;
  
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = name;
  
  function useStandardContext(): T {
    const context = useContext(Context);
    
    if (strict && context === undefined) {
      const error = new Error(
        errorMessage || `use${name} must be used within a ${name}Provider`
      );
      error.name = 'ContextError';
      throw error;
    }
    
    return context as T;
  }
  
  return {
    Context,
    Provider: Context.Provider,
    useContext: useStandardContext,
  };
}

/**
 * Higher-order component for context provision with error boundaries
 */
export function withContextProvider<T, P extends object>(
  ContextProvider: React.ComponentType<{ value: T; children: React.ReactNode }>,
  useContextValue: () => T,
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode }>
) {
  return function WrappedProvider({ children, ...props }: P & { children: React.ReactNode }) {
    const contextValue = useContextValue();
    
    const content = (
      <ContextProvider value={contextValue}>
        {children}
      </ContextProvider>
    );
    
    if (ErrorBoundary) {
      return <ErrorBoundary>{content}</ErrorBoundary>;
    }
    
    return content;
  };
}

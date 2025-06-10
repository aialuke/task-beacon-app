import React, { createContext, useContext, ReactNode } from "react";

interface CreateContextOptions<T> {
  /**
   * The display name for the context (used in DevTools and error messages)
   */
  name: string;

  /**
   * Whether to throw an error when the hook is used outside the provider
   * @default true
   */
  strict?: boolean;

  /**
   * Default value for non-strict mode
   */
  defaultValue?: T;

  /**
   * Custom error message when used outside provider
   */
  errorMessage?: string;
}

interface ContextReturn<T> {
  /**
   * The React context
   */
  Context: React.Context<T | undefined>;

  /**
   * Provider component
   */
  Provider: React.ComponentType<{
    children: ReactNode;
    value: T;
  }>;

  /**
   * Hook to access context value
   */
  useContext: () => T;
}

/**
 * Lightweight context creation utility - simplified for better performance
 */
export function createStandardContext<T>(
  options: CreateContextOptions<T>
): ContextReturn<T> {
  const { name, strict = true, defaultValue, errorMessage } = options;

  // Create the context with undefined as initial value
  const Context = createContext<T | undefined>(undefined);

  // Set display name for DevTools
  Context.displayName = `${name}Context`;

  // Lightweight Provider component - no additional wrapper overhead
  const Provider = Context.Provider as React.ComponentType<{
    children: ReactNode;
    value: T;
  }>;

  // Set display name for Provider
  Provider.displayName = `${name}Provider`;

  // Optimized hook to access context - minimal error handling overhead
  const useContextHook = (): T => {
    const context = useContext(Context);

    // Streamlined error handling
    if (context === undefined) {
      if (!strict && defaultValue !== undefined) {
        return defaultValue;
      }
      
      const message = errorMessage ?? `use${name} must be used within a ${name}Provider`;
      throw new Error(message);
    }

    return context as T;
  };

  return {
    Context,
    Provider,
    useContext: useContextHook,
  };
}

import React, { createContext, useContext, ReactNode } from 'react';

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
 * Standardized context creation utility
 *
 * Provides consistent patterns for:
 * - Context creation with proper error handling
 * - Provider components with proper display names
 * - Hooks with validation and error messages
 * - Optional strict/non-strict modes
 *
 * @example
 * ```tsx
 * interface AuthContextValue {
 *   user: User | null;
 *   login: (email: string, password: string) => Promise<void>;
 * }
 *
 * const { Provider: AuthProvider, useContext: useAuth } = createStandardContext<AuthContextValue>({
 *   name: 'Auth',
 *   errorMessage: 'useAuth must be used within AuthProvider'
 * });
 *
 * // Usage
 * function MyAuthProvider({ children }: { children: ReactNode }) {
 *   const [user, setUser] = useState(null);
 *   const login = async (email, password) => { ... };
 *
 *   return (
 *     <AuthProvider value={{ user, login }}>
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 *
 * function SomeComponent() {
 *   const { user, login } = useAuth();
 *   // ...
 * }
 * ```
 */
export function createStandardContext<T>(
  options: CreateContextOptions<T>
): ContextReturn<T> {
  const { name, strict = true, defaultValue, errorMessage } = options;

  // Create the context with undefined as initial value
  const Context = createContext<T | undefined>(undefined);

  // Set display name for DevTools
  Context.displayName = `${name}Context`;

  // Provider component
  const Provider: React.ComponentType<{
    children: ReactNode;
    value: T;
  }> = ({ children, value }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  // Set display name for Provider
  Provider.displayName = `${name}Provider`;

  // Hook to access context
  const useContextHook = (): T => {
    const context = useContext(Context);

    // Handle strict mode (default)
    if (strict && context === undefined) {
      const message =
        errorMessage ?? `use${name} must be used within a ${name}Provider`;
      throw new Error(message);
    }

    // Handle non-strict mode with default value
    if (!strict && context === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(
        `use${name} called outside provider and no defaultValue provided`
      );
    }

    return context as T;
  };

  return {
    Context,
    Provider,
    useContext: useContextHook,
  };
}

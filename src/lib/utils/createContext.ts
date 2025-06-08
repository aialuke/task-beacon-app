
import React, { createContext, useContext, ReactNode } from "react";

interface CreateContextOptions<T> {
  name: string;
  strict?: boolean;
  defaultValue?: T;
  errorMessage?: string;
}

interface ContextReturn<T> {
  Context: React.Context<T | undefined>;
  Provider: React.ComponentType<{
    children: ReactNode;
    value: T;
  }>;
  useContext: () => T;
}

export function createStandardContext<T>(
  options: CreateContextOptions<T>
): ContextReturn<T> {
  const { name, strict = true, defaultValue, errorMessage } = options;

  const Context = createContext<T | undefined>(undefined);
  Context.displayName = name + "Context";

  const Provider: React.ComponentType<{
    children: ReactNode;
    value: T;
  }> = ({ children, value }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  Provider.displayName = name + "Provider";

  const useContextHook = (): T => {
    const context = useContext(Context);

    if (strict && context === undefined) {
      const defaultMessage = "use" + name + " must be used within a " + name + "Provider";
      const message = errorMessage || defaultMessage;
      throw new Error(message);
    }

    if (!strict && context === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      const errorMsg = "use" + name + " called outside provider and no defaultValue provided";
      throw new Error(errorMsg);
    }

    return context as T;
  };

  return {
    Context,
    Provider,
    useContext: useContextHook,
  };
}

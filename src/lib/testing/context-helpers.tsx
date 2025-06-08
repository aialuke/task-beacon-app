
import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import { vi } from 'vitest';

// Create test query client with disabled retries and caching
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Provider wrapper options for test rendering
 */
interface TestProviderOptions {
  includeAuth?: boolean;
  includeTheme?: boolean;
  includeRouter?: boolean;
  includeTaskProviders?: boolean;
  queryClient?: QueryClient;
}

/**
 * Creates a wrapper with essential providers for testing
 */
function createTestWrapper(options: TestProviderOptions = {}) {
  const {
    includeAuth = false,
    includeTheme = false,
    includeRouter = false,
    includeTaskProviders = false,
    queryClient = createTestQueryClient(),
  } = options;

  return function TestWrapper({ children }: { children: ReactNode }) {
    let content = (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    if (includeAuth) {
      content = <AuthProvider>{content}</AuthProvider>;
    }

    if (includeTheme) {
      content = <ThemeProvider>{content}</ThemeProvider>;
    }

    if (includeTaskProviders) {
      content = (
        <TaskProviders>
          {content}
        </TaskProviders>
      );
    }

    if (includeRouter) {
      content = <BrowserRouter>{content}</BrowserRouter>;
    }

    return content;
  };
}

/**
 * Custom render function with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: TestProviderOptions & { renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) {
  const { renderOptions, ...providerOptions } = options;
  
  return render(ui, {
    wrapper: createTestWrapper(providerOptions),
    ...renderOptions,
  });
}

/**
 * Render with all providers (full app context)
 */
export function renderWithAllProviders(
  ui: ReactElement,
  options: { renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) {
  return renderWithProviders(ui, {
    includeAuth: true,
    includeTheme: true,
    includeRouter: true,
    includeTaskProviders: true,
    ...options,
  });
}

/**
 * Render with just essential providers (minimal setup)
 */
export function renderWithEssentials(
  ui: ReactElement,
  options: { renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) {
  return renderWithProviders(ui, {
    includeTheme: true,
    includeRouter: true,
    ...options,
  });
}

/**
 * Render with task-specific providers
 */
export function renderWithTaskProviders(
  ui: ReactElement,
  options: { renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) {
  return renderWithProviders(ui, {
    includeTaskProviders: true,
    includeTheme: true,
    ...options,
  });
}

/**
 * Mock context value creator for testing specific context states
 */
export function createMockContextValue<T>(
  defaultValue: T,
  overrides: Partial<T> = {}
): T {
  return { ...defaultValue, ...overrides };
}

/**
 * Test helper for checking context provider requirements
 * Note: expect function should be available in test environment
 */
export function expectContextError(hookFunction: () => void, contextName: string) {
  // Type-safe access to expect function in test environment
  const globalScope = globalThis as { expect?: typeof import('vitest').expect };
  const expectFn = globalScope.expect;
  
  if (expectFn) {
    expectFn(hookFunction).toThrow(
      `use${contextName} must be used within a ${contextName}Provider`
    );
  } else {
    throw new Error('expectContextError can only be used in test environment');
  }
}

/**
 * Wait for async context updates in tests
 */
export async function waitForContextUpdate() {
  // Small delay to allow context updates to propagate
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Test wrapper that provides mock implementations for external dependencies
 */
export function createMockProviderWrapper<T>(
  Context: React.Context<T>,
  mockValue: T
) {
  return function MockWrapper({ children }: { children: ReactNode }) {
    return (
      <Context.Provider value={mockValue}>
        {children}
      </Context.Provider>
    );
  };
}

/**
 * Helper to test context value changes over time
 */
export function createContextValueTracker<T>() {
  const values: T[] = [];
  
  return {
    track: (value: T) => values.push(value),
    getValues: () => [...values],
    getLastValue: () => values[values.length - 1],
    clear: () => values.length = 0,
    count: () => values.length,
  };
}

/**
 * Debug helper to log context value changes
 */
export function debugContextValue<T>(
  contextValue: T,
  contextName = 'Context'
) {
  if (process.env.NODE_ENV === 'test') {
    console.log(`${contextName} Value:`, JSON.stringify(contextValue, null, 2));
  }
}

/**
 * Test helper for the new convenience hooks
 * Provides mock implementations for TaskProviders convenience hooks
 */
export function createMockTaskContexts() {
  return {
    data: {
      tasks: [],
      isLoading: false,
      isFetching: false,
      error: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasNextPage: false,
      hasPreviousPage: false,
      goToNextPage: vi.fn(),
      goToPreviousPage: vi.fn(),
    },
    ui: {
      filter: 'all' as const,
      setFilter: vi.fn(),
      expandedTaskId: null,
      setExpandedTaskId: vi.fn(),
      isMobile: false,
    },
  };
}

/**
 * Test helper for useTaskFiltering hook
 */
export function createMockTaskFiltering() {
  return {
    tasks: [],
    filter: 'all' as const,
    setFilter: vi.fn(),
    totalCount: 0,
    filteredCount: 0,
  };
}

/**
 * Test helper for useTaskProviderStatus hook
 */
export function createMockTaskProviderStatus() {
  return {
    hasDataContext: true,
    hasUIContext: true,
    isReady: true,
    isLoading: false,
  };
}
// CodeRabbit review
// CodeRabbit review

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { vi } from 'vitest';
import { Task, User, TaskStatus, TaskPriority } from '@/types';

/**
 * Configuration options for test utilities
 */
interface TestUtilsOptions {
  /** Initial route for router tests */
  initialRoute?: string;
  /** Custom QueryClient for React Query tests */
  queryClient?: QueryClient;
  /** Whether to include auth context */
  withAuth?: boolean;
  /** Mock user for auth context */
  mockUser?: User | null;
}

/**
 * Creates a QueryClient optimized for testing
 * Disables retries and caching for faster, more predictable tests
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      // Disable console logs during tests
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  });
}

/**
 * Mock implementation of the AuthContext
 */
export const mockAuthContext = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
};

/**
 * Wrapper component that provides all necessary contexts for testing
 */
interface AllProvidersProps {
  children: ReactNode;
  options?: TestUtilsOptions;
}

function AllProviders({ children, options = {} }: AllProvidersProps) {
  const {
    initialRoute = '/',
    queryClient = createTestQueryClient(),
    withAuth = false,
    mockUser = null,
  } = options;

  // Mock AuthContext if needed
  const authContextValue = withAuth
    ? { ...mockAuthContext, user: mockUser }
    : mockAuthContext;

  const RouterWrapper = ({ children }: { children: ReactNode }) => {
    // Set initial route if specified
    if (initialRoute !== '/') {
      window.history.pushState({}, 'Test page', initialRoute);
    }
    return <BrowserRouter>{children}</BrowserRouter>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterWrapper>
          {withAuth ? (
            // Mock AuthProvider would go here
            <div data-testid="mock-auth-provider">
              {children}
            </div>
          ) : (
            children
          )}
        </RouterWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render function that includes all necessary providers
 * 
 * @param ui - The component to render
 * @param options - Render options and test utilities configuration
 * @returns Render result with additional utilities
 * 
 * @example
 * ```typescript
 * const { getByText, queryClient } = renderWithProviders(
 *   <MyComponent />,
 *   { withAuth: true, mockUser: createMockUser() }
 * );
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    testUtilsOptions = {},
    ...renderOptions
  }: RenderOptions & { testUtilsOptions?: TestUtilsOptions } = {}
) {
  const queryClient = testUtilsOptions.queryClient || createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllProviders options={{ ...testUtilsOptions, queryClient }}>
      {children}
    </AllProviders>
  );

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...result,
    queryClient,
    // Helper to rerender with new props
    rerender: (ui: ReactElement) =>
      result.rerender(<AllProviders options={testUtilsOptions}>{ui}</AllProviders>),
  };
}

/**
 * Factory function to create mock User objects
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'mock-user-id',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Factory function to create mock Task objects
 */
export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'mock-task-id',
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending' as TaskStatus,
    priority: 'medium' as TaskPriority,
    due_date: '2024-12-31T23:59:59Z',
    owner_id: 'mock-user-id',
    assigned_to: null,
    parent_task_id: null,
    pinned: false,
    url_link: null,
    photo_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Factory function to create multiple mock tasks
 */
export function createMockTasks(count: number, baseOverrides: Partial<Task> = {}): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      ...baseOverrides,
      id: `mock-task-${index + 1}`,
      title: `Test Task ${index + 1}`,
    })
  );
}

/**
 * Mock API responses for common operations
 */
export const mockApiResponses = {
  success: <T>(data: T) => ({ data, error: null }),
  error: (message: string) => ({ data: null, error: new Error(message) }),
  
  // Common success responses
  taskCreated: (task: Task) => mockApiResponses.success(task),
  taskUpdated: (task: Task) => mockApiResponses.success(task),
  taskDeleted: () => mockApiResponses.success(null),
  
  userFetched: (user: User) => mockApiResponses.success(user),
  userUpdated: (user: User) => mockApiResponses.success(user),
  
  // Common error responses
  unauthorized: () => mockApiResponses.error('Unauthorized'),
  notFound: () => mockApiResponses.error('Not found'),
  serverError: () => mockApiResponses.error('Internal server error'),
};

/**
 * Mock localStorage for tests that need browser storage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
}

/**
 * Mock setTimeout and setInterval for timer-based tests
 */
export function mockTimers() {
  vi.useFakeTimers();
  
  return {
    advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
    runAllTimers: () => vi.runAllTimers(),
    runOnlyPendingTimers: () => vi.runOnlyPendingTimers(),
    restore: () => vi.useRealTimers(),
  };
}

/**
 * Utility to wait for async operations in tests
 */
export function waitFor<T>(
  callback: () => T | Promise<T>,
  options: { timeout?: number; interval?: number } = {}
): Promise<T> {
  const { timeout = 1000, interval = 50 } = options;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(new Error(`Timeout after ${timeout}ms: ${error}`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    
    check();
  });
}

/**
 * Helper to create mock form events
 */
export function createMockEvent(
  type: string,
  target: Partial<HTMLInputElement> = {}
): React.ChangeEvent<HTMLInputElement> {
  return {
    type,
    target: {
      value: '',
      name: '',
      ...target,
    } as HTMLInputElement,
    currentTarget: target as HTMLInputElement,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as React.ChangeEvent<HTMLInputElement>;
}

/**
 * Helper to create mock keyboard events
 */
export function createMockKeyboardEvent(
  key: string,
  options: Partial<KeyboardEvent> = {}
): KeyboardEvent {
  return {
    key,
    code: key,
    which: key.charCodeAt(0),
    keyCode: key.charCodeAt(0),
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...options,
  } as KeyboardEvent;
}

/**
 * Assert that a function is called with specific arguments
 */
export function expectToHaveBeenCalledWith<T extends (...args: any[]) => any>(
  mockFn: T,
  ...expectedArgs: Parameters<T>
) {
  expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
}

/**
 * Assert that an element has specific accessibility attributes
 */
export function expectAccessibilityAttributes(
  element: HTMLElement,
  attributes: Record<string, string | null>
) {
  Object.entries(attributes).forEach(([attr, expectedValue]) => {
    if (expectedValue === null) {
      expect(element).not.toHaveAttribute(attr);
    } else {
      expect(element).toHaveAttribute(attr, expectedValue);
    }
  });
}

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { vi } from 'vitest'; 
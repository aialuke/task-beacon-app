import { vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { Task, User, TaskStatus, TaskPriority } from '@/types';

/**
 * Advanced testing utilities for complex scenarios
 */

/**
 * Creates a mock QueryClient with custom configuration for specific test scenarios
 */
export function createMockQueryClient(config: {
  enableRetries?: boolean;
  networkDelay?: number;
  cacheTime?: number;
} = {}) {
  const { enableRetries = false, networkDelay = 0, cacheTime = 0 } = config;

  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: enableRetries ? 3 : false,
        gcTime: cacheTime,
        staleTime: cacheTime,
        networkMode: 'always',
      },
      mutations: {
        retry: enableRetries ? 3 : false,
        networkMode: 'always',
      },
    },
    logger: {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  });
}

/**
 * Simulates network conditions for testing
 */
export function simulateNetworkConditions(condition: 'slow' | 'unstable' | 'offline') {
  switch (condition) {
    case 'slow':
      return (fn: Function) => new Promise(resolve => 
        setTimeout(() => resolve(fn()), 2000)
      );
    case 'unstable':
      return (fn: Function) => {
        if (Math.random() < 0.3) {
          throw new Error('Network timeout');
        }
        return fn();
      };
    case 'offline':
      return () => {
        throw new Error('Network unavailable');
      };
    default:
      return (fn: Function) => fn();
  }
}

/**
 * Creates mock tasks with realistic data patterns
 */
export function createMockTaskBatch(count: number, options: {
  status?: TaskStatus;
  priority?: TaskPriority;
  ownerId?: string;
  assigneeId?: string;
  withDueDates?: boolean;
  overdue?: boolean;
} = {}): Task[] {
  const {
    status = 'pending',
    priority = 'medium',
    ownerId = 'mock-owner',
    assigneeId = null,
    withDueDates = true,
    overdue = false,
  } = options;

  return Array.from({ length: count }, (_, index) => {
    const dueDate = withDueDates 
      ? overdue 
        ? '2023-12-31T23:59:59Z' // Past date for overdue
        : '2025-12-31T23:59:59Z' // Future date
      : null;

    return {
      id: `mock-task-${index + 1}`,
      title: `Mock Task ${index + 1}`,
      description: `Description for mock task ${index + 1}`,
      status,
      priority,
      due_date: dueDate,
      owner_id: ownerId,
      assignee_id: assigneeId,
      parent_task_id: null,
      pinned: index % 3 === 0, // Every third task is pinned
      url_link: index % 4 === 0 ? 'https://example.com' : null,
      photo_url: index % 5 === 0 ? 'https://example.com/photo.jpg' : null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      parent_task: null,
    };
  });
}

/**
 * Creates realistic user test data
 */
export function createMockUserBatch(count: number, options: {
  role?: string;
  verified?: boolean;
} = {}): User[] {
  const { role = 'user', verified = true } = options;

  return Array.from({ length: count }, (_, index) => ({
    id: `mock-user-${index + 1}`,
    email: `user${index + 1}@example.com`,
    name: `Test User ${index + 1}`,
    avatar_url: index % 2 === 0 ? `https://example.com/avatar${index + 1}.jpg` : null,
    role,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }));
}

/**
 * Mock error scenarios for testing error handling
 */
export const mockErrorScenarios = {
  networkError: () => new Error('Network request failed'),
  authError: () => ({ message: 'Authentication failed', code: 'AUTH_ERROR' }),
  validationError: () => ({ message: 'Validation failed', code: 'VALIDATION_ERROR' }),
  serverError: () => ({ message: 'Internal server error', code: 'SERVER_ERROR' }),
  notFoundError: () => ({ message: 'Resource not found', code: 'NOT_FOUND' }),
  permissionError: () => ({ message: 'Permission denied', code: 'PERMISSION_DENIED' }),
};

/**
 * Performance testing utilities
 */
export function measurePerformance<T>(fn: () => T | Promise<T>): Promise<{
  result: T;
  duration: number;
}> {
  const start = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.then(res => ({
      result: res,
      duration: performance.now() - start,
    }));
  }
  
  return Promise.resolve({
    result,
    duration: performance.now() - start,
  });
}

/**
 * Utility to test component accessibility
 */
export function checkAccessibility(element: HTMLElement) {
  const checks = {
    hasProperRole: !!element.getAttribute('role'),
    hasAriaLabel: !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby'),
    isFocusable: element.tabIndex >= 0 || ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()),
    hasKeyboardSupport: element.hasAttribute('onKeyDown') || element.hasAttribute('onKeyPress'),
  };

  return {
    isAccessible: Object.values(checks).every(Boolean),
    details: checks,
  };
}

/**
 * Mock localStorage for testing
 */
export function mockLocalStorageImplementation() {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
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
 * Utility for testing real-time features
 */
export function createMockRealtimeChannel() {
  const subscribers: Array<(payload: any) => void> = [];
  
  return {
    on: vi.fn((event: string, callback: (payload: any) => void) => {
      subscribers.push(callback);
    }),
    off: vi.fn(),
    subscribe: vi.fn(() => 'subscribed'),
    unsubscribe: vi.fn(),
    send: vi.fn(),
    // Utility to simulate incoming messages
    simulateMessage: (payload: any) => {
      subscribers.forEach(callback => callback(payload));
    },
  };
}

/**
 * Utility for testing form interactions
 */
export function simulateFormInteraction(form: HTMLFormElement, data: Record<string, string>) {
  Object.entries(data).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  form.dispatchEvent(new Event('submit', { bubbles: true }));
}

/**
 * Utility for testing async operations with timeout
 */
export function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number = 5000,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Utility for testing pagination
 */
export function createMockPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number
) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      hasNextPage: endIndex < data.length,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Utility for testing optimistic updates
 */
export function createOptimisticUpdateTester<T>() {
  let currentData: T[] = [];
  let rollbackData: T[] = [];
  
  return {
    setInitialData: (data: T[]) => {
      currentData = [...data];
      rollbackData = [...data];
    },
    applyOptimisticUpdate: (updater: (data: T[]) => T[]) => {
      currentData = updater([...currentData]);
    },
    confirmUpdate: () => {
      rollbackData = [...currentData];
    },
    rollback: () => {
      currentData = [...rollbackData];
    },
    getCurrentData: () => [...currentData],
  };
}

/**
 * Database query result mock factory
 */
export function createMockQueryResult<T>(
  data: T | null,
  error: any = null,
  loading = false
) {
  return {
    data,
    error,
    loading,
    refetch: vi.fn(),
    isFetching: loading,
    isLoading: loading,
    isError: !!error,
    isSuccess: !error && !loading,
  };
}
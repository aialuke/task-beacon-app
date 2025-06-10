/**
 * Standardized Testing Patterns - Phase 3.2 Testing Architecture
 * 
 * Simple, focused testing utilities that follow established patterns
 */

import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';

// === MOCK FACTORIES ===

/**
 * Creates typed mock functions
 */
export function createTypedMock<T extends (...args: any[]) => any>(): MockedFunction<T> {
  return vi.fn() as MockedFunction<T>;
}

/**
 * Standard API response patterns
 */
export const mockApiResponses = {
  success: <T>(data: T) => ({
    data,
    error: null,
    success: true as const,
    status: 200,
  }),
  
  error: (message: string, status = 400) => ({
    data: null,
    error: { message, status },
    success: false as const,
    status,
  }),

  loading: () => ({
    data: null,
    error: null,
    success: false as const,
    status: 0,
    loading: true,
  }),
};

/**
 * React Query hook response patterns
 */
export const mockQueryResponses = {
  success: <T>(data: T) => ({
    data,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    status: 'success' as const,
  }),

  loading: () => ({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
    isSuccess: false,
    status: 'loading' as const,
  }),

  error: (error: Error) => ({
    data: undefined,
    isLoading: false,
    isError: true,
    error,
    isSuccess: false,
    status: 'error' as const,
  }),
};

// === TEST DATA FACTORIES ===

/**
 * Standardized test data creation
 */
export const createTestData = {
  user: (overrides: Record<string, unknown> = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  task: (overrides: Record<string, unknown> = {}) => ({
    id: 'test-task-id',
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending' as const,
    priority: 'medium' as const,
    due_date: '2024-12-31T23:59:59Z',
    owner_id: 'test-user-id',
    assignee_id: null,
    parent_task_id: null,
    parent_task: null,
    pinned: false,
    url_link: null,
    photo_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  taskList: (count = 3, overrides: Record<string, unknown> = {}) => {
    return Array.from({ length: count }, (_, index) => 
      createTestData.task({
        id: `test-task-${index + 1}`,
        title: `Test Task ${index + 1}`,
        ...overrides,
      })
    );
  },
};

// === COMMON TEST SCENARIOS ===

/**
 * Reusable test scenario patterns
 */
export const testScenarios = {
  /**
   * Standard loading state test pattern
   */
  loadingStatePattern: (componentName: string) => ({
    description: `${componentName} should show loading state`,
    testId: 'loading-spinner',
    expectedText: /loading/i,
  }),

  /**
   * Standard error state test pattern
   */
  errorStatePattern: (componentName: string, errorMessage = 'Error occurred') => ({
    description: `${componentName} should show error state`,
    testId: 'error-message',
    expectedText: new RegExp(errorMessage, 'i'),
  }),

  /**
   * Standard success state test pattern
   */
  successStatePattern: (componentName: string, expectedData: unknown) => ({
    description: `${componentName} should display data correctly`,
    data: expectedData,
  }),
};

// === MOCK SETUP UTILITIES ===

/**
 * Common mock setups for consistent testing
 */
export const mockSetup = {
  /**
   * Setup Supabase client mocks
   */
  supabaseClient: () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    };

    return {
      auth: {
        getUser: vi.fn(),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
      },
      from: vi.fn(() => mockChain),
      mockChain,
    };
  },

  /**
   * Setup React Router mocks
   */
  reactRouter: () => ({
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'test-id' }),
    useLocation: () => ({ 
      pathname: '/', 
      search: '', 
      hash: '', 
      state: null 
    }),
  }),

  /**
   * Setup toast notification mocks
   */
  toastNotifications: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
    useToast: () => ({ toast: vi.fn() }),
  }),
};

// === ASSERTION PATTERNS ===

/**
 * Common assertion patterns for consistency
 */
export const assertionPatterns = {
  /**
   * Check accessibility requirements
   */
  accessibility: {
    hasAriaLabel: (element: Element) => 
      element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'),
    
    hasSemanticRole: (element: Element) => {
      const semanticTags = ['button', 'input', 'select', 'textarea', 'a', 'h1', 'h2', 'h3'];
      return element.hasAttribute('role') || 
             semanticTags.includes(element.tagName.toLowerCase());
    },
  },

  /**
   * Common DOM assertion helpers
   */
  dom: {
    isVisible: (element: Element) => {
      const computed = window.getComputedStyle(element);
      return computed.display !== 'none' && 
             computed.visibility !== 'hidden' && 
             computed.opacity !== '0';
    },

    hasClass: (element: Element, className: string) => 
      element.classList.contains(className),

    hasAttribute: (element: Element, attribute: string, value?: string) => 
      value ? element.getAttribute(attribute) === value : element.hasAttribute(attribute),
  },
};

// === INTEGRATION TEST HELPERS ===

/**
 * Helpers for integration testing
 */
export const integrationHelpers = {
  /**
   * Setup test environment for integration tests
   */
  setupTestEnvironment: () => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Setup common mocks
    const supabase = mockSetup.supabaseClient();
    const router = mockSetup.reactRouter();
    const toast = mockSetup.toastNotifications();
    
    return {
      mocks: { supabase, router, toast },
      cleanup: () => vi.clearAllMocks(),
    };
  },

  /**
   * Create test workflow steps
   */
  createWorkflowSteps: (
    steps: {
      name: string;
      action: () => Promise<void> | void;
      verify: () => Promise<void> | void;
    }[]
  ) => steps,
};

// === PERFORMANCE TEST UTILITIES ===

/**
 * Simple performance testing utilities
 */
export const performanceHelpers = {
  /**
   * Measure function execution time
   */
  measureTime: async (fn: () => Promise<void> | void): Promise<number> => {
    const start = performance.now();
    await fn();
    return performance.now() - start;
  },

  /**
   * Create performance benchmarks
   */
  createBenchmark: (name: string, targetTime: number) => ({
    name,
    targetTime,
    async measure(fn: () => Promise<void> | void): Promise<{ passed: boolean; actualTime: number }> {
      const actualTime = await performanceHelpers.measureTime(fn);
      return { passed: actualTime <= targetTime, actualTime };
    },
  }),
}; 
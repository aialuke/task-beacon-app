/**
 * Centralized test configuration for Task Beacon App
 * Manages test settings, mock configurations, and testing standards
 */

export const testConfig = {
  // Test timeouts
  timeouts: {
    unit: 5000,
    integration: 10000,
    e2e: 30000,
    async: 8000,
  },

  // Coverage thresholds by category
  coverage: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    critical: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    components: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },

  // Mock data configurations
  mocks: {
    defaultUser: {
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
    defaultTask: {
      id: 'mock-task-id',
      title: 'Test Task',
      description: 'Test description',
      status: 'pending' as const,
      priority: 'medium' as const,
    },
    apiDelay: 100, // ms
    networkTimeout: 5000, // ms
  },

  // Test environment settings
  environment: {
    jsdom: {
      url: 'http://localhost:3000',
      resources: 'usable',
    },
    features: {
      localStorage: true,
      sessionStorage: true,
      fetch: true,
      webSocket: false, // Mock WebSocket for real-time tests
    },
  },

  // Testing categories and patterns
  patterns: {
    unit: [
      'src/**/*.test.{ts,tsx}',
      '!src/**/integration/**',
      '!src/**/e2e/**',
    ],
    integration: [
      'src/**/integration/**/*.test.{ts,tsx}',
    ],
    components: [
      'src/**/components/**/*.test.{ts,tsx}',
    ],
    hooks: [
      'src/**/hooks/**/*.test.{ts,tsx}',
    ],
    api: [
      'src/**/api/**/*.test.{ts,tsx}',
      'src/lib/api/**/*.test.{ts,tsx}',
    ],
    critical: [
      'src/features/auth/**/*.test.{ts,tsx}',
      'src/features/tasks/integration/**/*.test.{ts,tsx}',
      'src/lib/api/**/*.test.{ts,tsx}',
    ],
  },

  // Mock configurations for different services
  mockConfigs: {
    supabase: {
      auth: {
        autoConfirm: true,
        persistSession: false,
      },
      realtime: {
        enabled: false,
        heartbeatIntervalMs: 30000,
      },
    },
    api: {
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      retries: 0,
    },
    storage: {
      bucket: 'test-bucket',
      maxFileSize: 5242880, // 5MB
    },
  },

  // Accessibility testing standards
  accessibility: {
    rules: {
      'color-contrast': 'error',
      'keyboard-navigation': 'error',
      'aria-labels': 'warning',
      'semantic-markup': 'warning',
    },
    standards: 'WCAG2AA',
  },

  // Performance testing thresholds
  performance: {
    renderTime: 100, // ms
    queryTime: 200, // ms
    componentMount: 50, // ms
    bundleSize: 500, // KB for lazy chunks
  },

  // Test data generation settings
  dataGeneration: {
    taskBatchSize: 10,
    userBatchSize: 5,
    seedValue: 12345, // For consistent random data
  },
};

/**
 * Test categories for organizing test runs
 */
export const testCategories = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  COMPONENT: 'component',
  E2E: 'e2e',
  CRITICAL: 'critical',
  PERFORMANCE: 'performance',
  ACCESSIBILITY: 'accessibility',
} as const;

/**
 * Mock response factories
 */
export const mockResponseFactories = {
  success: <T>(data: T) => ({
    success: true,
    data,
    error: null,
  }),
  
  error: (message: string, code?: string) => ({
    success: false,
    data: null,
    error: {
      message,
      code: code || 'GENERIC_ERROR',
      name: 'TestError',
    },
  }),
  
  loading: () => ({
    success: false,
    data: null,
    error: null,
    loading: true,
  }),
  
  paginated: <T>(data: T[], page = 1, pageSize = 10) => ({
    success: true,
    data: {
      data: data.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        hasNextPage: page * pageSize < data.length,
        hasPreviousPage: page > 1,
      },
    },
    error: null,
  }),
};

/**
 * Common test assertions
 */
export const commonAssertions = {
  /**
   * Assert that an element has proper accessibility attributes
   */
  hasAccessibilityAttributes: (element: HTMLElement) => {
    const hasRole = element.hasAttribute('role');
    const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
    const isFocusable = element.tabIndex >= 0;
    
    return {
      hasRole,
      hasAriaLabel,
      isFocusable,
      isAccessible: hasRole || hasAriaLabel || isFocusable,
    };
  },

  /**
   * Assert that a component renders without errors
   */
  rendersWithoutErrors: (renderFn: () => void) => {
    try {
      renderFn();
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Assert API response structure
   */
  hasValidApiResponse: (response: any) => {
    const hasSuccess = typeof response.success === 'boolean';
    const hasData = response.hasOwnProperty('data');
    const hasError = response.hasOwnProperty('error');
    
    return {
      isValid: hasSuccess && hasData && hasError,
      details: { hasSuccess, hasData, hasError },
    };
  },
};

/**
 * Test utilities for specific features
 */
export const featureTestUtils = {
  tasks: {
    statuses: ['pending', 'complete', 'overdue'] as const,
    priorities: ['low', 'medium', 'high', 'urgent'] as const,
    sampleData: {
      title: 'Sample Task',
      description: 'Sample task description',
      dueDate: '2024-12-31T23:59:59Z',
    },
  },
  
  auth: {
    validCredentials: {
      email: 'test@example.com',
      password: 'password123',
    },
    invalidCredentials: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    },
  },
  
  users: {
    roles: ['user', 'admin', 'moderator'] as const,
    sampleData: {
      name: 'Test User',
      email: 'test@example.com',
    },
  },
};

export default testConfig; 
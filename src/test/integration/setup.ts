import '@testing-library/jest-dom';
import type { User } from '@supabase/supabase-js';
import { vi } from 'vitest';

import { supabase } from '@/shared/services/supabase/client';

/**
 * Integration test setup
 * Configures mocks and utilities for testing complete workflows
 */

// Mock Supabase client for integration tests
vi.mock('@/shared/services/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => 'subscribed'),
      unsubscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock toast notifications for integration tests
vi.mock('@/hooks/use-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock navigation for integration tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'test-id' }),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});

// Global test utilities for integration tests
const mockApiResponse = <T>(data: T, error: unknown = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
});

const mockSuccessfulAuth = (userOverrides: Partial<User> = {}) => {
  const mockUser: User = {
    id: 'test-user',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    ...userOverrides,
  };

  vi.mocked(supabase.auth.getUser).mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });
};

const mockFailedAuth = (errorMessage = 'Authentication failed') => {
  vi.mocked(supabase.auth.getUser).mockResolvedValue({
    data: { user: null },
    error: {
      message: errorMessage,
      name: 'AuthError',
      status: 401,
    } as any,
  });
};

const mockDatabaseQuery = (tableName: string, result: unknown) => {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };

  vi.mocked(supabase.from).mockReturnValue(mockChain as unknown);
  return mockChain;
};

// Test data factories for integration tests
const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createTestTask = (overrides = {}) => ({
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
});

export const setupIntegrationTest = () => {
  // Reset all mocks before each integration test
  vi.clearAllMocks();

  // Setup default successful auth
  mockSuccessfulAuth();

  // Return cleanup function
  return () => {
    vi.clearAllMocks();
  };
};

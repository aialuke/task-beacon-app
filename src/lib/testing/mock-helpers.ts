/**
 * Mock Helpers - Centralized Mocking Utilities
 *
 * Provides consistent mocks for common dependencies and services.
 * Reduces boilerplate in test files and ensures consistent mocking patterns.
 */

import { vi, beforeEach, afterEach, expect } from 'vitest';

/**
 * Mock Supabase client
 */
export const createMockSupabase = () => ({
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
  })),
});

/**
 * Mock API response helper
 */
export function createMockApiResponse<T>(
  data: T,
  success = true,
  error?: { message: string; name?: string; code?: string }
) {
  return {
    success,
    data: success ? data : null,
    error: success
      ? null
      : error || { message: 'Mock error', name: 'MockError' },
  };
}

/**
 * Mock user data
 */
export const mockUserData = {
  id: 'mock-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock task data
 */
export const mockTaskData = {
  id: 'mock-task-id',
  title: 'Test Task',
  description: 'Test task description',
  status: 'pending' as const,
  priority: 'medium' as const,
  due_date: '2024-12-31T23:59:59Z',
  owner_id: 'mock-user-id',
  assignee_id: null,
  parent_task_id: null,
  url_link: 'https://example.com',
  photo_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock auth session
 */
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUserData,
};

/**
 * Mock auth response
 */
export const mockAuthResponse = {
  user: mockUserData,
  session: mockSession,
  emailConfirmed: true,
};

/**
 * Helper to mock console methods
 */
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });

  return {
    expectLogCalled: (message?: string) => {
      if (message) {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(message)
        );
      } else {
        expect(console.log).toHaveBeenCalled();
      }
    },
    expectErrorCalled: (message?: string) => {
      if (message) {
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining(message)
        );
      } else {
        expect(console.error).toHaveBeenCalled();
      }
    },
  };
};

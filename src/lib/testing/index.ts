/**
 * Testing Utilities - Centralized Testing Helpers
 *
 * Single entry point for all testing utilities and helpers.
 * Provides consistent testing setup across the application.
 */

// Context and provider helpers
export {
  createTestQueryClient,
  createTestWrapper,
  TestProviders,
  renderWithProviders,
} from './context-helpers';

// Mock helpers
export {
  createMockSupabase,
  mockUserData,
  mockTaskData,
  mockSession,
  mockAuthResponse,
  mockConsole,
} from './mock-helpers';

// Re-export commonly used testing utilities
export { render, screen, fireEvent, waitFor } from '@testing-library/react';
export { renderHook, act } from '@testing-library/react';
export { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';

// Common test helpers
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockTask = {
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test description',
  status: 'pending' as const,
  priority: 'medium' as const,
  due_date: new Date().toISOString(),
  owner_id: 'test-user-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Helper to create mock API responses
 */
export function createMockApiResponse<T>(data: T, success = true) {
  return {
    success,
    data: success ? data : null,
    error: success ? null : { message: 'Mock error', name: 'MockError' },
  };
}

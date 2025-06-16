/**
 * Standardized API Layer - Phase 3 Implementation
 */

import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '@/types/api.types';

/**
 * Extended API error with additional properties
 */
interface ExtendedApiError {
  message: string;
  name: string;
  code: string;
  timestamp: string;
  originalError?: unknown;
}

/**
 * Standard error transformation utility
 */
function transformApiError(error: unknown): ExtendedApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      code: 'API_ERROR',
      timestamp: new Date().toISOString(),
      originalError: error,
    };
  }

  return {
    message: 'An unknown error occurred',
    name: 'UnknownError',
    code: 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    originalError: error,
  };
}

/**
 * Standard success response creator
 */
function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  };
}

/**
 * Standard error response creator
 */
function createErrorResponse<T = null>(
  error: ExtendedApiError
): ApiResponse<T> {
  return {
    data: null,
    error,
    success: false,
  };
}

/**
 * Query key management utilities
 */
export const QueryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  tasksByAssignee: (assigneeId: string) =>
    ['tasks', 'assignee', assigneeId] as const,
  tasksByStatus: (status: string) => ['tasks', 'status', status] as const,

  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  usersByRole: (role: string) => ['users', 'role', role] as const,
  userSearch: (query: string) => ['users', 'search', query] as const,

  currentUser: ['auth', 'current-user'] as const,
  session: ['auth', 'session'] as const,

  invalidateTaskQueries: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
  },

  invalidateUserQueries: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: QueryKeys.users });
  },
} as const;

export { createLoadingState } from '@/types/async-state.types';

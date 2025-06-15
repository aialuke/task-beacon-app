/**
 * Standardized API Layer - Phase 3 Implementation
 *
 * Simplified to use single response pattern with apiRequest.
 * Removed duplicate apiCall function to eliminate confusion.
 */

import type { QueryClient } from '@tanstack/react-query';

import type { ApiResponse, ApiError } from '@/types';

/**
 * Standard error transformation utility
 */
function transformApiError(error: unknown): ApiError {
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
function createErrorResponse<T = null>(error: ApiError): ApiResponse<T> {
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
  // Task queries
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  tasksByAssignee: (assigneeId: string) =>
    ['tasks', 'assignee', assigneeId] as const,
  tasksByStatus: (status: string) => ['tasks', 'status', status] as const,

  // User queries - Enhanced for Phase 2.2
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  usersByRole: (role: string) => ['users', 'role', role] as const,
  userSearch: (query: string) => ['users', 'search', query] as const,

  // Auth queries
  currentUser: ['auth', 'current-user'] as const,
  session: ['auth', 'session'] as const,

  // Utility for invalidating related queries
  invalidateTaskQueries: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
  },

  invalidateUserQueries: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: QueryKeys.users });
  },
} as const;

// Loading state utilities moved to @/shared/types/async-state.types.ts to eliminate duplication;
export { createLoadingState } from '@/types/async-state.types';

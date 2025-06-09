/**
 * Standardized API Layer - Phase 3 Implementation
 * 
 * Simplified to use single response pattern with apiRequest.
 * Removed duplicate apiCall function to eliminate confusion.
 */

import type { QueryClient } from '@tanstack/react-query';
import type { ApiResponse, ApiError } from '@/types/api.types';

/**
 * Standard error transformation utility
 */
export function transformApiError(error: unknown): ApiError {
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
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  };
}

/**
 * Standard error response creator
 */
export function createErrorResponse<T = null>(error: ApiError): ApiResponse<T> {
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
  tasksByAssignee: (assigneeId: string) => ['tasks', 'assignee', assigneeId] as const,
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

/**
 * Standard loading state patterns
 */
export interface StandardLoadingState {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
}

/**
 * Creates a standard loading state object
 */
export function createLoadingState(
  isLoading: boolean,
  isFetching: boolean,
  error: unknown = null
): StandardLoadingState {
  return {
    isLoading,
    isFetching,
    isError: !!error,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
  };
}

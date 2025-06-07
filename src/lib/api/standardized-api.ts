
/**
 * Standardized API Layer - Phase 2 Implementation
 * 
 * This module provides a unified interface for all API operations,
 * standardizing error handling, response patterns, and loading states.
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
 * Wrapper for API calls with standardized error handling
 */
export async function apiCall<T>(
  operation: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return createSuccessResponse(data);
  } catch (error) {
    const apiError = transformApiError(error);
    return createErrorResponse(apiError);
  }
}

/**
 * Query key management utilities
 */
export const QueryKeys = {
  // Task-related query keys
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  taskSubtasks: (parentId: string) => ['tasks', parentId, 'subtasks'] as const,
  
  // User-related query keys
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userProfile: (id: string) => ['users', id, 'profile'] as const,
  
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

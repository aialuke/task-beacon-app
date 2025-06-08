import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';

// Define proper types for React Query data structures
interface PaginatedTasksResponse {
  data: {
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  };
  error: unknown;
}

interface InfiniteTasksResponse {
  pages: Array<{
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  }>;
  pageParams: unknown[];
}

/**
 * Type guard to check if data is paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as Record<string, unknown>).data === 'object'
  );
}

/**
 * Type guard to check if data is infinite response
 */
function isInfiniteResponse(data: unknown): data is InfiniteTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'pages' in data &&
    Array.isArray((data as Record<string, unknown>).pages)
  );
}

/**
 * Focused hook for optimistic task updates
 * 
 * Provides utilities for optimistically updating task data in React Query cache
 * with rollback capabilities.
 * 
 * Used by other task mutation hooks to avoid code duplication.
 */
export function useTaskOptimisticUpdates() {
  const queryClient = useQueryClient();

  /**
   * Get previous query data for rollback operations
   */
  const getPreviousData = useOptimizedCallback(
    () => queryClient.getQueryData(['tasks', undefined, undefined]),
    [queryClient],
    { name: 'getPreviousData', trackDependencyChanges: false }
  );

  /**
   * Optimistically update a single task in the cache
   */
  const updateTaskOptimistically = useOptimizedCallback(
    (taskId: string, updates: Partial<Task>, fallbackData?: unknown) => {
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldData: unknown) => {
        if (!oldData) return fallbackData || oldData;

        // Handle infinite query structure (pages)
        if (isInfiniteResponse(oldData)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data?.map((task: Task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ) || [],
            })),
          };
        }

        // Handle regular paginated response
        if (isPaginatedResponse(oldData)) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data?.map((task: Task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ) || [],
            },
          };
        }

        // Return unchanged if structure is unrecognized
        return oldData;
      });
    },
    [queryClient],
    { name: 'updateTaskOptimistically', trackDependencyChanges: false }
  );

  /**
   * Optimistically remove a task from the cache
   */
  const removeTaskOptimistically = useOptimizedCallback(
    (taskId: string, fallbackData?: unknown) => {
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldData: unknown) => {
        if (!oldData) return fallbackData || oldData;

        if (isInfiniteResponse(oldData)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data?.filter((task: Task) => task.id !== taskId) || [],
              totalCount: Math.max(0, page.totalCount - 1),
            })),
          };
        }

        if (isPaginatedResponse(oldData)) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data?.filter((task: Task) => task.id !== taskId) || [],
              totalCount: Math.max(0, oldData.data.totalCount - 1),
            },
          };
        }

        return oldData;
      });
    },
    [queryClient],
    { name: 'removeTaskOptimistically', trackDependencyChanges: false }
  );

  /**
   * Rollback cache to previous state
   */
  const rollbackToData = useCallback(
    (previousData: unknown) => {
      queryClient.setQueryData(['tasks', undefined, undefined], previousData);
    },
    [queryClient]
  );

  return {
    updateTaskOptimistically,
    removeTaskOptimistically,
    getPreviousData,
    rollbackToData,
  };
}
// CodeRabbit review

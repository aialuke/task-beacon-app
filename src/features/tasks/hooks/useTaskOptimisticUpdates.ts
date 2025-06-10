import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { QueryKeys } from '@/lib/api/standardized-api';
import { Task } from '@/types';

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
  pages: {
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  }[];
  pageParams: unknown[];
}

// Type guards for React Query data structures
function isPaginatedResponse(data: unknown): data is PaginatedTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as PaginatedTasksResponse).data === 'object' &&
    (data as PaginatedTasksResponse).data !== null &&
    'data' in (data as PaginatedTasksResponse).data &&
    Array.isArray((data as PaginatedTasksResponse).data.data)
  );
}

function isInfiniteResponse(data: unknown): data is InfiniteTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'pages' in data &&
    Array.isArray((data as InfiniteTasksResponse).pages)
  );
}

/**
 * Task Optimistic Updates Hook - Simplified Implementation
 * 
 * Provides utilities for optimistically updating task data in React Query cache
 * using standard React patterns for better maintainability.
 */
export function useTaskOptimisticUpdates() {
  const queryClient = useQueryClient();

  /**
   * Get previous query data for rollback operations
   */
  const getPreviousData = useCallback(
    () => queryClient.getQueryData(QueryKeys.tasks),
    [queryClient]
  );

  /**
   * Optimistically update a single task in the cache
   */
  const updateTaskOptimistically = useCallback(
    (taskId: string, updates: Partial<Task>, fallbackData?: unknown) => {
      queryClient.setQueriesData({ queryKey: QueryKeys.tasks }, (oldData: unknown) => {
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
    [queryClient]
  );

  /**
   * Optimistically remove a task from the cache
   */
  const removeTaskOptimistically = useCallback(
    (taskId: string, fallbackData?: unknown) => {
      queryClient.setQueriesData({ queryKey: QueryKeys.tasks }, (oldData: unknown) => {
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
    [queryClient]
  );

  /**
   * Rollback cache to previous state
   */
  const rollbackToData = useCallback(
    (previousData: unknown) => {
      queryClient.setQueryData(QueryKeys.tasks, previousData);
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

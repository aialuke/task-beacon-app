
import { useQuery } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { QueryKeys, createLoadingState } from '@/lib/api/standardized-api';
import type { Task } from '@/types';

interface UseTaskQueryReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

/**
 * Standardized hook for querying a single task by ID - Updated to use optimized service
 * 
 * Uses standardized query keys, error handling, and loading state patterns.
 */
export function useTaskQuery(taskId: string | undefined): UseTaskQueryReturn {
  const {
    data: task,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: QueryKeys.task(taskId ?? ''),
    queryFn: async () => {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const response = await TaskService.query.getById(taskId);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch task');
      }

      return response.data;
    },
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      errorMessage: 'Failed to load task details',
    },
  });

  // Standardized loading state
  const loadingState = createLoadingState(isLoading, false, queryError);

  return {
    task: task || null,
    loading: loadingState.isLoading,
    error: loadingState.error,
  };
}

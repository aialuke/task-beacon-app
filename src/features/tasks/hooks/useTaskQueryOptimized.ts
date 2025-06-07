
/**
 * Optimized Single Task Query Hook - Phase 3.1 Implementation
 * 
 * Enhanced version of useTaskQuery with improved error handling and caching.
 */

import { TaskService } from '@/lib/api/tasks/task.service';
import { QueryKeys } from '@/lib/api/standardized-api';
import { useOptimizedQuery } from '@/hooks/queries/useOptimizedQueries';
import { useStandardizedLoading } from '@/hooks/queries/useStandardizedLoading';
import { useEnhancedErrorHandling } from '@/hooks/queries/useEnhancedErrorHandling';
import type { Task } from '@/types';

interface UseTaskQueryOptimizedReturn {
  task: Task | null;
  loadingState: ReturnType<typeof useStandardizedLoading>;
  error: string | null;
  refetch: () => void;
}

/**
 * Optimized hook for querying a single task by ID
 */
export function useTaskQueryOptimized(taskId: string | undefined): UseTaskQueryOptimizedReturn {
  const { createErrorHandler } = useEnhancedErrorHandling({
    operation: 'fetch_task',
    component: 'TaskQuery',
  });

  const {
    data: task,
    isLoading,
    error,
    isFetching,
    isInitialLoading,
    refetch,
  } = useOptimizedQuery(
    QueryKeys.task(taskId || ''),
    async () => {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const response = await TaskService.crud.getById(taskId);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch task');
      }

      return response.data;
    },
    {
      type: 'content',
      enabled: !!taskId,
      staleTime: 5 * 60 * 1000, // 5 minutes for single task
    }
  );

  // Standardized loading state
  const loadingState = useStandardizedLoading({
    isLoading,
    isInitialLoading,
    isFetching,
    error,
    data: task,
    hasData: !!task,
  });

  return {
    task: task || null,
    loadingState,
    error: loadingState.error,
    refetch: () => {
      refetch().catch(createErrorHandler('refetch_task'));
    },
  };
}

import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import type { Task } from '@/types';

interface UseTaskQueryReturn {
  task: Task | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Standardized hook for querying a single task by ID.
 */
export function useTaskQuery(taskId: string | undefined): UseTaskQueryReturn {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryKeys.tasks, taskId],
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
  });

  return {
    task,
    isLoading,
    error,
  };
}

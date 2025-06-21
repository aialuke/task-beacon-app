import { useSuspenseQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import type { Task } from '@/types';

interface UseTaskQueryReturn {
  task: Task | null;
}

/**
 * Standardized hook for querying a single task by ID.
 */
export function useTaskQuery(taskId: string | undefined): UseTaskQueryReturn {
  const {
    data: task,
  } = useSuspenseQuery({
    queryKey: [QueryKeys.tasks, taskId],
    queryFn: async () => {
      if (!taskId) {
        throw new Error('Task ID is required');
      }
      return await TaskService.query.getById(taskId);
    },
    enabled: !!taskId,
    select: data => {
      // Transform the response data safely
      if (data.success) {
        return data.data;
      }
      // For failed responses, let error handling be done via onError
      throw new Error(data.error?.message || 'Failed to fetch task');
    },
  });

  return {
    task,
  };
}

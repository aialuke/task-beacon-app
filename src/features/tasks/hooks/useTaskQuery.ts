
import { TaskService } from '@/lib/api/tasks';
import { QueryKeys } from '@/lib/api/standardized-api';
import { useEntityByIdQuery } from '@/hooks/core';
import type { Task } from '@/types';

interface UseTaskQueryReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

/**
 * Standardized hook for querying a single task by ID - Phase 2 Refactored
 * 
 * Now uses the generic useEntityByIdQuery to eliminate duplicate React Query patterns.
 */
export function useTaskQuery(taskId: string | undefined): UseTaskQueryReturn {
  const {
    data: task,
    isLoading: loading,
    error,
  } = useEntityByIdQuery<Task>(
    'tasks',
    taskId,
    (id: string) => TaskService.query.getById(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      errorContext: 'task details',
    }
  );

  return {
    task,
    loading,
    error,
  };
}

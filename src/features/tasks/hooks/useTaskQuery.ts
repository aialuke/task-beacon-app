
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { TaskService } from '@/lib/api/tasks/task.service';
import type { Task } from '@/types';

interface UseTaskQueryReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for querying a single task by ID
 * Handles loading states and error management
 */
export function useTaskQuery(taskId: string | undefined): UseTaskQueryReturn {
  const [error, setError] = useState<string | null>(null);

  const {
    data: task,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const response = await TaskService.getById(taskId);
      
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

  // Handle query errors
  if (queryError && !error) {
    setError(queryError instanceof Error ? queryError.message : 'Failed to fetch task');
  }

  return {
    task: task || null,
    loading,
    error: error || (queryError instanceof Error ? queryError.message : null),
  };
}

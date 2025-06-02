import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks.service';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { handleApiError } from '@/lib/utils/error';

interface UseTaskDetailsReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

/**
 * Custom hook for fetching and managing task details
 *
 * @param taskId - The ID of the task to fetch
 * @returns Object containing task data, loading state, and pin management
 */
export function useTaskDetails(
  taskId: string | undefined
): UseTaskDetailsReturn {
  const { user, session } = useAuth();

  const {
    data: taskResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await TaskService.getById(taskId!);
      if (!response.success) {
        const errorMessage = response.error?.message || 'Failed to load task';
        throw new Error(errorMessage);
      }
      return response.data;
    },
    enabled: !!taskId && !!user && !!session,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const [isPinned, setIsPinned] = useState(false);
  useEffect(() => {
    if (taskResponse && typeof taskResponse === 'object' && 'pinned' in taskResponse) {
      setIsPinned((taskResponse as Task).pinned);
    }
  }, [taskResponse]);

  return {
    task: taskResponse ?? null,
    loading,
    error: error ? (error as Error).message : null,
    isPinned,
    setIsPinned,
  };
}

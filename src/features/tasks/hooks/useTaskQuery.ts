import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks/task.service';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

interface UseTaskQueryReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

/**
 * Standardized hook for fetching single task details
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Task, Entity: -, Action: Query
 */
export function useTaskQuery(
  taskId: string | undefined
): UseTaskQueryReturn {
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
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (taskResponse) {
      setIsPinned(taskResponse.pinned || false);
    }
  }, [taskResponse]);

  return {
    task: taskResponse || null,
    loading,
    error: error ? (error as Error).message : null,
    isPinned,
    setIsPinned,
  };
}

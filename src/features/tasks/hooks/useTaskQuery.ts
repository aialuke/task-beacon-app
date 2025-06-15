/**
 * Task Query Hook - Phase 1 Simplified
 * 
 * Focused hook for basic task queries only.
 * Separated from pagination concerns for single responsibility.
 */

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/core';
import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';
import type { Task } from '@/types';

interface UseTaskQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

export function useTaskQuery(taskId: string, options: UseTaskQueryOptions = {}) {
  const { user, session } = useAuth();
  const { enabled = true, staleTime = 5 * 60 * 1000, refetchOnWindowFocus = false } = options;

  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await TaskService.crud.getById(taskId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load task');
      }
      return response.data;
    },
    enabled: enabled && !!user && !!session && !!taskId,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
    throwOnError: (error) => {
      handleError(error, {
        context: 'Task Query',
        showToast: false,
        logToConsole: true,
      });
      return false;
    },
  });
}

export function useTasksListQuery(options: UseTaskQueryOptions = {}) {
  const { user, session } = useAuth();
  const { enabled = true, staleTime = 5 * 60 * 1000, refetchOnWindowFocus = false } = options;

  return useQuery({
    queryKey: ['tasks', 'list'],
    queryFn: async () => {
      const response = await TaskService.query.getMany({
        page: 1,
        pageSize: 50, // Simple list without pagination
        assignedToMe: false,
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load tasks');
      }
      
      return response.data.data as Task[];
    },
    enabled: enabled && !!user && !!session,
    staleTime,
    refetchOnWindowFocus,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
    throwOnError: (error) => {
      handleError(error, {
        context: 'Tasks List Query',
        showToast: false,
        logToConsole: true,
      });
      return false;
    },
  });
}

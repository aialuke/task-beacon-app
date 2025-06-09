import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useCallback } from 'react';
import { useBaseMutation } from './useBaseMutation';
import { logger } from '@/lib/logger';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: Task;
}

interface UseTaskStatusReturn {
  toggleTaskComplete: any; // From baseMutation.mutation
  toggleTaskCompleteCallback: (task: Task) => Promise<TaskMutationResult>;
  markAsComplete: (taskId: string) => Promise<{ success: boolean; error: string }>;
  markAsIncomplete: (taskId: string) => Promise<{ success: boolean; error: string }>;
  isLoading: boolean;
}

/**
 * Consolidated task status hook - Phase 3 Simplified
 * Uses base mutation pattern to eliminate duplicate code
 */
export function useTaskStatus(): UseTaskStatusReturn {
  const optimisticUpdates = useTaskOptimisticUpdates();

  const baseMutation = useBaseMutation<Task, Task>({
    mutationFn: async (task: Task) => {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      const result = await TaskService.status.updateStatus(task.id, newStatus);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update task status');
      }
      
      return result.data as Task;
    },
    onMutate: async (task) => {
      const previousData = optimisticUpdates.getPreviousData();
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      
      optimisticUpdates.updateTaskOptimistically(task.id, { status: newStatus });
      
      return { previousData };
    },
    successMessage: 'Task updated successfully',
    errorMessagePrefix: 'Failed to update task',
  });

  const toggleTaskCompleteCallback = useCallback(
    async (task: Task): Promise<TaskMutationResult> => {
      return await baseMutation.execute(task);
    },
    [baseMutation]
  );

  // Backward compatibility methods
  const markAsComplete = useCallback(
    async (taskId: string) => {
      logger.debug('markAsComplete called with taskId', { taskId });
      return { success: false, error: 'Task object required for completion toggle' };
    },
    []
  );

  const markAsIncomplete = useCallback(
    async (taskId: string) => {
      logger.debug('markAsIncomplete called with taskId', { taskId });
      return { success: false, error: 'Task object required for completion toggle' };
    },
    []
  );

  return {
    toggleTaskComplete: baseMutation.mutation,
    toggleTaskCompleteCallback,
    markAsComplete,
    markAsIncomplete,
    isLoading: baseMutation.isLoading,
  };
}


import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useCallback } from 'react';
import { useBaseMutation } from './useBaseMutation';

interface TaskUpdateVariables {
  taskId: string;
  updates: Partial<Task>;
}

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: Task;
}

/**
 * Consolidated task updates hook - Phase 3 Simplified
 * Uses base mutation pattern to eliminate duplicate code
 */
export function useTaskUpdates() {
  const optimisticUpdates = useTaskOptimisticUpdates();

  const baseMutation = useBaseMutation<Task, TaskUpdateVariables>({
    mutationFn: async ({ taskId, updates }: TaskUpdateVariables) => {
      const result = await TaskService.crud.update(taskId, updates);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update task');
      }
      
      return result.data as Task;
    },
    onMutate: async ({ taskId, updates }) => {
      const previousData = optimisticUpdates.getPreviousData();
      optimisticUpdates.updateTaskOptimistically(taskId, updates);
      return { previousData };
    },
    successMessage: 'Task updated successfully',
    errorMessagePrefix: 'Failed to update task',
  });

  const updateTaskCallback = useCallback(
    async (taskId: string, updates: Partial<Task>): Promise<TaskMutationResult> => {
      return await baseMutation.execute({ taskId, updates });
    },
    [baseMutation]
  );

  return {
    updateTask: baseMutation.mutation,
    updateTaskCallback,
    isLoading: baseMutation.isLoading,
  };
}

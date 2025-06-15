
import { useCallback } from 'react';

import { TaskService } from '@/lib/api/tasks';

import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';

import { useBaseMutation } from './useBaseMutation';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Consolidated task deletion hook - Phase 3 Simplified
 * Uses base mutation pattern to eliminate duplicate code
 */
export function useTaskDeletion() {
  const optimisticUpdates = useTaskOptimisticUpdates();

  const baseMutation = useBaseMutation<void, string>({
    mutationFn: async (taskId: string) => {
      const result = await TaskService.crud.delete(taskId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete task');
      }
    },
    onMutate: async (taskId) => {
      const previousData = optimisticUpdates.getPreviousData();
      optimisticUpdates.removeTaskOptimistically(taskId);
      return { previousData };
    },
    successMessage: 'Task deleted successfully',
    errorMessagePrefix: 'Failed to delete task',
  });

  const deleteTaskCallback = useCallback(
    async (taskId: string): Promise<TaskMutationResult> => {
      return await baseMutation.execute(taskId);
    },
    [baseMutation]
  );

  return {
    deleteTask: baseMutation.mutation,
    deleteTaskCallback,
    deleteTaskById: deleteTaskCallback, // Backward compatibility
    isLoading: baseMutation.isLoading,
  };
}

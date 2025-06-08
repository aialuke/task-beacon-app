
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: Task;
}

/**
 * Focused hook for task update mutations - Phase 2.4 Simplified
 */
export function useTaskUpdates() {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const updateTask = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }): Promise<TaskMutationResult> => {
      // Use direct service access
      const result = await TaskService.crud.update(taskId, updates);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update task');
      }
      
      return {
        success: true,
        message: 'Task updated successfully',
        data: result.data,
      };
    },
    onMutate: async ({ taskId, updates }) => {
      const previousData = optimisticUpdates.getPreviousData();
      optimisticUpdates.updateTaskOptimistically(taskId, updates);
      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
  });

  const updateTaskCallback = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      const result = await updateTask.mutateAsync({ taskId, updates });
      return result;
    },
    [updateTask]
  );

  return {
    updateTask,
    updateTaskCallback,
    isLoading: updateTask.isPending,
  };
}

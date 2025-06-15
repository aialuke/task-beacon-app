
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { QueryKeys, TaskService } from '@/shared/services/api';
import type { Task, TaskUpdateData } from '@/types';

import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

/**
 * Task Update Hook - Phase 1 SRP Refactor
 * 
 * Focused hook for task update operations only.
 * Extracted from useTaskSubmission to improve single responsibility.
 */
export function useTaskUpdate() {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TaskUpdateData;
    }): Promise<Task> => {
      const response = await TaskService.crud.update(id, data);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update task');
      }

      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });

      // Snapshot previous value
      const previousTask = queryClient.getQueryData(QueryKeys.task(id));

      // Optimistically update
      optimisticUpdates.updateTaskOptimistically(id, data, previousTask);

      return { previousTask };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousTask) {
        optimisticUpdates.rollbackToData(context.previousTask);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      toast.success('Task updated successfully!');
    },
  });

  const updateTask = useCallback(
    async (id: string, data: TaskUpdateData) => {
      try {
        const task = await updateMutation.mutateAsync({ id, data });
        return {
          success: true,
          message: 'Task updated successfully!',
          task,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to update task',
        };
      }
    },
    [updateMutation]
  );

  return {
    updateTask,
    isLoading: updateMutation.isPending,
  };
}

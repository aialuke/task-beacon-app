
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { QueryKeys, TaskService } from '@/shared/services/api';

import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

/**
 * Task Deletion Hook - Phase 1 SRP Refactor
 * 
 * Focused hook for task deletion operations only.
 * Extracted from useTaskSubmission to improve single responsibility.
 */
export function useTaskDeletion() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await TaskService.crud.delete(id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete task');
      }
    },
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });

      // Snapshot previous value
      const previousData = optimisticUpdates.getPreviousData();

      // Optimistically remove task
      optimisticUpdates.removeTaskOptimistically(id, previousData);

      return { previousData };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`Failed to delete task: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      toast.success('Task deleted successfully!');

      // Navigate back to tasks list
      navigate('/');
    },
  });

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return {
          success: true,
          message: 'Task deleted successfully!',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to delete task',
        };
      }
    },
    [deleteMutation]
  );

  return {
    deleteTask,
    isLoading: deleteMutation.isPending,
  };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

/**
 * Custom hook for task deletion mutations
 * 
 * Provides optimistic updates and proper error handling for task deletion.
 */
export function useTaskDeleteMutations() {
  const queryClient = useQueryClient();
  const {
    removeTaskOptimistically,
    getPreviousData,
    rollbackToData,
  } = useTaskOptimisticUpdates();

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await TaskService.delete(taskId);
    },
    onMutate: async (taskId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousData = getPreviousData();
      
      // Optimistically remove the task
      removeTaskOptimistically(taskId);
      
      // Return context for potential rollback
      return { previousData };
    },
    onError: (err, taskId, context) => {
      // Rollback on error
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      console.error(`Failed to delete task ${taskId}:`, err);
    },
    onSuccess: () => {
      // toast.success('Task deleted successfully');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    deleteTask: (taskId: string) => deleteMutation.mutate(taskId),
    isLoading: deleteMutation.isPending,
  };
} 
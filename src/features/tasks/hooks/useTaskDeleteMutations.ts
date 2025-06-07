
// External libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Internal utilities
import { showSuccessMessage, showErrorMessage } from '@/lib/utils/notification';

// API Services
import { TaskService } from '@/lib/api/tasks/task.service';

// Hooks
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
      return await TaskService.crud.delete(taskId);
    },
    onMutate: async (taskId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousData = getPreviousData();
      
      // Optimistically remove the task
      removeTaskOptimistically(taskId);
      
      // Return context for potential rollback
      return { previousData, taskId };
    },
    onError: (err: Error, taskId: string, context) => {
      // Rollback on error using context data
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      // Show user-friendly error message
      showErrorMessage('Failed to delete task. Please try again.');
      
      // Log error for debugging
      console.error(`Failed to delete task ${taskId}:`, err);
    },
    onSuccess: (data, taskId: string) => {
      // Show success message to user
      showSuccessMessage('Task deleted successfully');
      
      // Log success for debugging/analytics
      console.info(`Task deleted successfully:`, { taskId, result: data });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    deleteTask: (taskId: string) => { deleteMutation.mutate(taskId); },
    isLoading: deleteMutation.isPending,
    mutation: deleteMutation,
  };
}

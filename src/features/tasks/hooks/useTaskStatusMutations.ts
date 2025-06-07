
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';
import { showSuccessMessage, showErrorMessage } from '@/lib/utils/notification';

/**
 * Custom hook for task status mutations (complete/incomplete)
 * 
 * Provides optimistic updates and proper error handling for task status changes.
 * Note: Pin functionality removed due to database schema constraints.
 */
export function useTaskStatusMutations() {
  const queryClient = useQueryClient();
  const {
    updateTaskOptimistically,
    getPreviousData,
    rollbackToData,
  } = useTaskOptimisticUpdates();

  const statusMutation = useMutation({
    mutationFn: async ({ 
      taskId, 
      updates
    }: { 
      taskId: string; 
      updates: { status?: 'complete' | 'pending' | 'overdue' }; 
      action: string;
    }) => {
      // Call the appropriate service method
      if (updates.status) {
        return await TaskService.updateStatus(taskId, updates.status);
      }
      
      throw new Error('Invalid status update operation');
    },
    onMutate: async ({ taskId, updates, action }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousData = getPreviousData();
      
      // Optimistically update the cache
      updateTaskOptimistically(taskId, updates);
      
      // Return context for potential rollback
      return { previousData, taskId, updates, action };
    },
    onError: (err: Error, { taskId, updates, action }, context) => {
      // Rollback on error using context data
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      // Show user-friendly error message
      showErrorMessage(`Failed to ${action} task. Please try again.`);
      
      // Log error for debugging
      console.error(`Failed to ${action} task ${taskId}:`, err, { updates });
    },
    onSuccess: (data, { taskId, action }) => {
      // Show success message to user
      showSuccessMessage(`Task ${action} successfully`);
      
      // Log success for debugging/analytics
      console.info(`Task ${action} successfully:`, { taskId, updatedTask: data });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    markAsComplete: (taskId: string) =>
      statusMutation.mutate({ taskId, updates: { status: 'complete' }, action: 'complete' }),
    markAsIncomplete: (taskId: string) =>
      statusMutation.mutate({ taskId, updates: { status: 'pending' }, action: 'incomplete' }),
    isLoading: statusMutation.isPending,
    statusMutation,
  };
}

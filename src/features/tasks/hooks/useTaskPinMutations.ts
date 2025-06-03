import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks/task.service';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';
import { showSuccessMessage, showErrorMessage } from '@/lib/utils/notification';

/**
 * Custom hook for task pin mutations
 * 
 * Provides optimistic updates and proper error handling for pinning/unpinning tasks.
 */
export function useTaskPinMutations() {
  const queryClient = useQueryClient();
  const {
    updateTaskOptimistically,
    getPreviousData,
    rollbackToData,
  } = useTaskOptimisticUpdates();

  const pinMutation = useMutation({
    mutationFn: async ({ taskId, pinned }: { taskId: string; pinned: boolean }) => {
      return await TaskService.update(taskId, { pinned });
    },
    onMutate: async ({ taskId, pinned }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousData = getPreviousData();
      
      // Optimistically update the task
      updateTaskOptimistically(taskId, { pinned });
      
      // Return context for potential rollback
      return { previousData, taskId, pinned };
    },
    onError: (err: Error, { taskId, pinned }, context) => {
      // Rollback on error using context data
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      const action = pinned ? 'pin' : 'unpin';
      
      // Show user-friendly error message
      showErrorMessage(`Failed to ${action} task. Please try again.`);
      
      // Log error for debugging (could be enhanced with proper error tracking)
      console.error(`Failed to ${action} task ${taskId}:`, err);
    },
    onSuccess: (data, { taskId, pinned }) => {
      const action = pinned ? 'pinned' : 'unpinned';
      
      // Show success message to user
      showSuccessMessage(`Task ${action} successfully`);
      
      // Log success for debugging/analytics
      console.info(`Task ${action} successfully:`, { taskId, updatedTask: data });
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure consistency
      return await queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
  });

  return {
    // Main function used by the UI - toggles pin state
    togglePin: (task: Task) => 
      pinMutation.mutate({ taskId: task.id, pinned: !task.pinned }),
    
    // Helper functions for specific pin operations (exposed for flexibility)
    pinTask: (taskId: string) =>
      pinMutation.mutate({ taskId, pinned: true }),
    unpinTask: (taskId: string) =>
      pinMutation.mutate({ taskId, pinned: false }),
    
    // Loading state for UI feedback
    isLoading: pinMutation.isPending,
    
    // Expose mutation for advanced use cases
    mutation: pinMutation,
  };
} 
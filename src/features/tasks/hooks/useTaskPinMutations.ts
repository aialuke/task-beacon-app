import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks/task.service';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

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
      return { previousData };
    },
    onError: (err, { taskId, pinned }, context) => {
      // Rollback on error
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      const action = pinned ? 'pin' : 'unpin';
      console.error(`Task ${action} failed for task ${taskId}:`, err);
      
      // TODO: Consider adding user notification here
      // toast.error(`Failed to ${action} task`);
    },
    onSuccess: (data, { pinned }) => {
      const action = pinned ? 'pinned' : 'unpinned';
      console.log(`Task ${action} successfully. Updated task:`, data);
      
      // TODO: Consider adding user notification here
      // toast.success(`Task ${action}`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
  };
} 
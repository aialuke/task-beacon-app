import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks.service';
import { toast } from '@/lib/toast';
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
      toast.error(`Failed to ${action} task`);
      console.error(`Task ${action} failed:`, err);
    },
    onSuccess: (data, { pinned }) => {
      const action = pinned ? 'pinned' : 'unpinned';
      toast.success(`Task ${action} successfully`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    togglePin: (task: Task) => 
      pinMutation.mutate({ taskId: task.id, pinned: !task.pinned }),
    pinTask: (taskId: string) =>
      pinMutation.mutate({ taskId, pinned: true }),
    unpinTask: (taskId: string) =>
      pinMutation.mutate({ taskId, pinned: false }),
    isLoading: pinMutation.isPending,
  };
} 
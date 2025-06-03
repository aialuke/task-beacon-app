import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks.service';
import { toast } from '@/lib/toast';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

/**
 * Custom hook for task status mutations (complete/incomplete/pin/unpin)
 * 
 * Provides optimistic updates and proper error handling for task status changes.
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
      updates, 
      action 
    }: { 
      taskId: string; 
      updates: { status?: 'complete' | 'pending' | 'overdue'; pinned?: boolean }; 
      action: string;
    }) => {
      // Call the appropriate service method
      if (updates.status) {
        return await TaskService.updateStatus(taskId, updates.status);
      } else if (typeof updates.pinned === 'boolean') {
        return await TaskService.update(taskId, { pinned: updates.pinned });
      }
      
      throw new Error('Invalid status update operation');
    },
    onMutate: async ({ taskId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousData = getPreviousData();
      
      // Optimistically update the cache
      updateTaskOptimistically(taskId, updates);
      
      // Return context for potential rollback
      return { previousData };
    },
    onError: (err, { taskId, action }, context) => {
      // Rollback on error
      if (context?.previousData) {
        rollbackToData(context.previousData);
      }
      
      const actionText = action === 'complete' ? 'complete' : 
                        action === 'incomplete' ? 'mark as incomplete' :
                        action === 'pin' ? 'pin' : 'unpin';
      
      toast.error(`Failed to ${actionText} task`);
      console.error(`Task ${action} failed:`, err);
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
    togglePin: (taskId: string, pinned: boolean) =>
      statusMutation.mutate({ taskId, updates: { pinned }, action: pinned ? 'pin' : 'unpin' }),
    isLoading: statusMutation.isPending,
  };
} 
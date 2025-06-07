
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { toast } from 'sonner';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: Task;
}

/**
 * Focused hook for task status mutations
 */
export function useTaskStatus() {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const toggleTaskComplete = useMutation({
    mutationFn: async (task: Task): Promise<TaskMutationResult> => {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      // Use direct service access
      const result = await TaskService.status.updateStatus(task.id, newStatus);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update task status');
      }
      
      return {
        success: true,
        message: `Task ${newStatus === 'complete' ? 'completed' : 'marked incomplete'} successfully`,
        data: result.data,
      };
    },
    onMutate: async (task) => {
      const previousData = optimisticUpdates.getPreviousData();
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      
      optimisticUpdates.updateTaskOptimistically(task.id, { status: newStatus });
      
      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
  });

  const toggleTaskCompleteCallback = useOptimizedCallback(
    async (task: Task) => {
      const result = await toggleTaskComplete.mutateAsync(task);
      return result;
    },
    [toggleTaskComplete],
    { name: 'toggleTaskComplete' }
  );

  // Backward compatibility methods
  const markAsComplete = useOptimizedCallback(
    async (taskId: string) => {
      console.log('markAsComplete called with taskId:', taskId);
      return { success: false, error: 'Task object required for completion toggle' };
    },
    [],
    { name: 'markAsComplete' }
  );

  const markAsIncomplete = useOptimizedCallback(
    async (taskId: string) => {
      console.log('markAsIncomplete called with taskId:', taskId);
      return { success: false, error: 'Task object required for completion toggle' };
    },
    [],
    { name: 'markAsIncomplete' }
  );

  return {
    toggleTaskComplete,
    toggleTaskCompleteCallback,
    markAsComplete,
    markAsIncomplete,
    isLoading: toggleTaskComplete.isPending,
  };
}

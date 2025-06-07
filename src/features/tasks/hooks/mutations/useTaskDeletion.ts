
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { toast } from 'sonner';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Focused hook for task deletion mutations
 */
export function useTaskDeletion() {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  const deleteTask = useMutation({
    mutationFn: async (taskId: string): Promise<TaskMutationResult> => {
      // Use direct service access
      const result = await TaskService.crud.delete(taskId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete task');
      }
      
      return { 
        success: true, 
        message: 'Task deleted successfully' 
      };
    },
    onMutate: async (taskId) => {
      const previousData = optimisticUpdates.getPreviousData();
      optimisticUpdates.removeTaskOptimistically(taskId);
      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`Failed to delete task: ${error.message}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  const deleteTaskCallback = useOptimizedCallback(
    async (taskId: string) => {
      const result = await deleteTask.mutateAsync(taskId);
      return result;
    },
    [deleteTask],
    { name: 'deleteTask' }
  );

  return {
    deleteTask,
    deleteTaskCallback,
    deleteTaskById: deleteTaskCallback, // Backward compatibility
    isLoading: deleteTask.isPending,
  };
}

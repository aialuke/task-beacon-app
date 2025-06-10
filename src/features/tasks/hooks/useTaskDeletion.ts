/**
 * Task Deletion Hook - Phase 1 Simplified
 * 
 * Focused hook for task deletion operations only.
 * Extracted from useTaskMutations for single responsibility.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';

export function useTaskDeletion() {
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await TaskService.crud.delete(taskId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete task');
      }
      return response.data;
    },
    onSuccess: (_, taskId) => {
      // Remove from cache and invalidate queries
      queryClient.removeQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Task Deletion',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  return {
    // Mutation functions
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    
    // State
    isLoading: deleteTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    
    // Reset function
    reset: deleteTaskMutation.reset,
  };
} 
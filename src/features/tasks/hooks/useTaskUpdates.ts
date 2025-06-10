/**
 * Task Updates Hook - Phase 1 Simplified
 * 
 * Focused hook for task update operations only.
 * Extracted from useTaskMutations for single responsibility.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';
import type { TaskUpdateData } from '@/types';

export function useTaskUpdates() {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdateData }) => {
      const response = await TaskService.crud.update(id, data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update task');
      }
      return response.data;
    },
    onSuccess: (task) => {
      // Invalidate specific task and tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task?.id] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Task Update',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  return {
    // Mutation functions
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    
    // State
    isLoading: updateTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    
    // Reset function
    reset: updateTaskMutation.reset,
  };
} 
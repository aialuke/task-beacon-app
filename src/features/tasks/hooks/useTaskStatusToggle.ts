/**
 * Task Status Toggle Hook - Phase 1 Simplified
 * 
 * Focused hook for task status operations only.
 * Extracted from useTaskMutations for single responsibility.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';

export function useTaskStatusToggle() {
  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await TaskService.status.updateStatus(taskId, 'complete');
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update task status');
      }
      return response.data;
    },
    onSuccess: (task) => {
      // Invalidate specific task and tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task?.id] });
      
      const isCompleted = task?.status === 'complete';
      toast.success(isCompleted ? 'Task marked as complete' : 'Task marked as incomplete');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Task Status Update',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await TaskService.status.updateStatus(taskId, 'complete');
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to mark task as complete');
      }
      return response.data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task?.id] });
      toast.success('Task marked as complete');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Mark Task Complete',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  const markIncompleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await TaskService.status.updateStatus(taskId, 'pending');
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to mark task as incomplete');
      }
      return response.data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task?.id] });
      toast.success('Task marked as incomplete');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Mark Task Incomplete',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  return {
    // Mutation functions
    toggleStatus: toggleStatusMutation.mutate,
    toggleStatusAsync: toggleStatusMutation.mutateAsync,
    markComplete: markCompleteMutation.mutate,
    markCompleteAsync: markCompleteMutation.mutateAsync,
    markIncomplete: markIncompleteMutation.mutate,
    markIncompleteAsync: markIncompleteMutation.mutateAsync,
    
    // State
    isLoading: toggleStatusMutation.isPending || markCompleteMutation.isPending || markIncompleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    isMarkingComplete: markCompleteMutation.isPending,
    isMarkingIncomplete: markIncompleteMutation.isPending,
    
    // Reset functions
    reset: () => {
      toggleStatusMutation.reset();
      markCompleteMutation.reset();
      markIncompleteMutation.reset();
    },
  };
} 
/**
 * Task Creation Hook - Phase 1 Simplified
 * 
 * Focused hook for task creation operations only.
 * Extracted from useTaskMutations for single responsibility.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';
import type { TaskCreateData } from '@/types';

export function useTaskCreation() {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: TaskCreateData) => {
      const response = await TaskService.crud.create(taskData);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create task');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Task Creation',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  const createFollowUpMutation = useMutation({
    mutationFn: async ({ parentTaskId, taskData }: { parentTaskId: string; taskData: TaskCreateData }) => {
      const followUpData = {
        ...taskData,
        parent_task_id: parentTaskId,
      };
      
      const response = await TaskService.crud.create(followUpData);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create follow-up task');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Follow-up task created successfully');
    },
    onError: (error) => {
      handleError(error, {
        context: 'Follow-up Task Creation',
        showToast: true,
        logToConsole: true,
      });
    },
  });

  return {
    // Mutation functions
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    createFollowUpTask: createFollowUpMutation.mutate,
    createFollowUpTaskAsync: createFollowUpMutation.mutateAsync,
    
    // State
    isLoading: createTaskMutation.isPending || createFollowUpMutation.isPending,
    isCreating: createTaskMutation.isPending,
    isCreatingFollowUp: createFollowUpMutation.isPending,
    
    // Reset functions
    reset: () => {
      createTaskMutation.reset();
      createFollowUpMutation.reset();
    },
  };
} 
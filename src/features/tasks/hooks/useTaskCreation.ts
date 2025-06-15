
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { QueryKeys, TaskService } from '@/shared/services/api';
import type { Task, TaskCreateData } from '@/types';

/**
 * Task Creation Hook - Phase 1 SRP Refactor
 * 
 * Focused hook for task creation operations only.
 * Extracted from useTaskSubmission to improve single responsibility.
 */
export function useTaskCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: async (data: TaskCreateData): Promise<Task> => {
      const response = await TaskService.crud.create(data);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create task');
      }

      return response.data;
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
    onSuccess: (task: Task) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      toast.success('Task created successfully!');

      // Navigate to task details
      navigate(`/tasks/${task.id}`);
    },
  });

  const createTask = useCallback(
    async (data: TaskCreateData) => {
      try {
        const task = await createMutation.mutateAsync(data);
        return {
          success: true,
          message: 'Task created successfully!',
          task,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to create task',
        };
      }
    },
    [createMutation]
  );

  return {
    createTask,
    isLoading: createMutation.isPending,
  };
}

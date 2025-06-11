import { useCallback } from 'react';

import { TaskService } from '@/lib/api/tasks';
import type { Task } from '@/types';

import { useBaseMutation } from './useBaseMutation';

interface TaskCreationData {
  title: string;
  description?: string;
  dueDate?: string;
  photoUrl?: string;
  urlLink?: string;
  assigneeId?: string;
  parentTaskId?: string;
}

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

/**
 * Consolidated task creation hook - Phase 3 Simplified
 * Uses base mutation pattern to eliminate duplicate code
 */
export function useTaskCreation() {
  const baseMutation = useBaseMutation<Task, TaskCreationData>({
    mutationFn: async (taskData: TaskCreationData) => {
      const result = await TaskService.crud.create(taskData);

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create task');
      }

      return result.data as Task;
    },
    successMessage: 'Task created successfully',
    errorMessagePrefix: 'Failed to create task',
  });

  const createTaskCallback = useCallback(
    async (taskData: TaskCreationData): Promise<TaskMutationResult> => {
      return await baseMutation.execute(taskData);
    },
    [baseMutation]
  );

  const createFollowUpTask = useCallback(
    async (
      parentTask: Task,
      taskData: { title: string; description?: string }
    ): Promise<TaskMutationResult> => {
      const followUpData = {
        ...taskData,
        parentTaskId: parentTask.id,
      };
      return await baseMutation.execute(followUpData);
    },
    [baseMutation]
  );

  return {
    createTask: baseMutation.mutation,
    createTaskCallback,
    createFollowUpTask,
    isLoading: baseMutation.isLoading,
  };
}

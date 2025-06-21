/**
 * Task Submission Hook - Phase 2 Simplified
 *
 * Unified hook for all task submission operations with standardized error handling
 * and optimistic updates. Eliminates duplicate submission patterns.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';


import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import { useTaskNavigation } from '@/lib/navigation';
import type { Task, TaskCreateData, TaskUpdateData } from '@/types';

// === TASK SUBMISSION RESULT TYPES ===

interface TaskSubmissionResult {
  success: boolean;
  message: string;
  task?: Task;
  error?: string;
}

interface UseTaskSubmissionReturn {
  createTask: (data: TaskCreateData) => Promise<TaskSubmissionResult>;
  updateTask: (
    id: string,
    data: TaskUpdateData
  ) => Promise<TaskSubmissionResult>;
  deleteTask: (id: string) => Promise<TaskSubmissionResult>;
  isSubmitting: boolean;
}

// === TASK SUBMISSION HOOK ===

/**
 * Unified task submission hook with optimistic updates and error handling
 */
export function useTaskSubmission(): UseTaskSubmissionReturn {
  const queryClient = useQueryClient();
  const { goToTaskDetails, goToTaskList } = useTaskNavigation();

  // Create task mutation - using safe API contract
  const createMutation = useMutation({
    mutationFn: async (data: TaskCreateData) => {
      return await TaskService.crud.create(data);
    },
    onSuccess: response => {
      if (response.success) {
        // Invalidate and refetch tasks list
        queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
        toast.success('Task created successfully!');

        // Navigate to task details
        goToTaskDetails(response.data.id);
      } else {
        // Handle API error without throwing
        toast.error(
          `Failed to create task: ${response.error?.message || 'Unknown error'}`
        );
      }
    },
    onError: (error: Error) => {
      // Handle network/unexpected errors
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Update task mutation - using safe API contract
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdateData }) => {
      return await TaskService.crud.update(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });

      // Snapshot previous value
      const previousTask = queryClient.getQueryData<Task>(QueryKeys.task(id));

      // Optimistically update
      if (previousTask) {
        queryClient.setQueryData(QueryKeys.task(id), {
          ...previousTask,
          ...data,
        });
      }

      return { previousTask };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(
          QueryKeys.task(context.previousTask.id),
          context.previousTask
        );
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: (response, { id }) => {
      if (response.success) {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
        queryClient.invalidateQueries({ queryKey: QueryKeys.task(id) });
        toast.success('Task updated successfully!');
      } else {
        // Handle API error without throwing - also rollback optimistic update
        const previousTask = queryClient.getQueryData<Task>(QueryKeys.task(id));
        if (previousTask) {
          queryClient.setQueryData(QueryKeys.task(id), previousTask);
        }
        toast.error(
          `Failed to update task: ${response.error?.message || 'Unknown error'}`
        );
      }
    },
  });

  // Delete task mutation - using safe API contract
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await TaskService.crud.delete(id);
    },
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });

      // Snapshot previous value
      const previousTask = queryClient.getQueryData<Task>(QueryKeys.task(id));

      // Optimistically remove task
      queryClient.setQueryData(QueryKeys.task(id), undefined);

      return { previousTask };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(
          QueryKeys.task(context.previousTask.id),
          context.previousTask
        );
      }
      toast.error(`Failed to delete task: ${error.message}`);
    },
    onSuccess: (response, id) => {
      if (response.success) {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
        queryClient.removeQueries({ queryKey: QueryKeys.task(id) });
        toast.success('Task deleted successfully!');

        // Navigate back to tasks list
        if (window.location.pathname.includes(id)) {
          goToTaskList();
        }
      } else {
        // Handle API error without throwing - rollback optimistic update
        const previousTask = queryClient.getQueryData<Task>(QueryKeys.task(id));
        if (previousTask) {
          queryClient.setQueryData(QueryKeys.task(id), previousTask);
        }
        toast.error(
          `Failed to delete task: ${response.error?.message || 'Unknown error'}`
        );
      }
    },
  });

  // === PUBLIC API ===

  const createTask = useCallback(
    async (data: TaskCreateData): Promise<TaskSubmissionResult> => {
      try {
        const response = await createMutation.mutateAsync(data);

        if (response.success) {
          return {
            success: true,
            message: 'Task created successfully!',
            task: response.data,
          };
        } else {
          return {
            success: false,
            error: response.error?.message || 'Unknown error',
            message: 'Failed to create task',
          };
        }
      } catch (error) {
        // Handle network errors and other unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: errorMessage,
          message: 'Failed to create task',
        };
      }
    },
    [createMutation]
  );

  const updateTask = useCallback(
    async (id: string, data: TaskUpdateData): Promise<TaskSubmissionResult> => {
      try {
        const response = await updateMutation.mutateAsync({ id, data });

        if (response.success) {
          return {
            success: true,
            message: 'Task updated successfully!',
            task: response.data,
          };
        } else {
          return {
            success: false,
            error: response.error?.message || 'Unknown error',
            message: 'Failed to update task',
          };
        }
      } catch (error) {
        // Handle network errors and other unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: errorMessage,
          message: 'Failed to update task',
        };
      }
    },
    [updateMutation]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<TaskSubmissionResult> => {
      try {
        const response = await deleteMutation.mutateAsync(id);

        if (response.success) {
          return {
            success: true,
            message: 'Task deleted successfully!',
          };
        } else {
          return {
            success: false,
            error: response.error?.message || 'Unknown error',
            message: 'Failed to delete task',
          };
        }
      } catch (error) {
        // Handle network errors and other unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: errorMessage,
          message: 'Failed to delete task',
        };
      }
    },
    [deleteMutation]
  );

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    createTask,
    updateTask,
    deleteTask,
    isSubmitting,
  };
}

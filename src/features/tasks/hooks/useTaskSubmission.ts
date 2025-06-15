/**
 * Task Submission Hook - Phase 2 Simplified
 * 
 * Unified hook for all task submission operations with standardized error handling
 * and optimistic updates. Eliminates duplicate submission patterns.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import type { Task, TaskCreateData, TaskUpdateData } from '@/types';

import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';


// === TASK SUBMISSION RESULT TYPES ===

interface TaskSubmissionResult {
  success: boolean;
  message: string;
  task?: Task;
  error?: string;
}

interface UseTaskSubmissionReturn {
  createTask: (data: TaskCreateData) => Promise<TaskSubmissionResult>;
  updateTask: (id: string, data: TaskUpdateData) => Promise<TaskSubmissionResult>;
  deleteTask: (id: string) => Promise<TaskSubmissionResult>;
  isSubmitting: boolean;
}

// === TASK SUBMISSION HOOK ===

/**
 * Unified task submission hook with optimistic updates and error handling
 */
export function useTaskSubmission(): UseTaskSubmissionReturn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const optimisticUpdates = useTaskOptimisticUpdates();

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: async (data: TaskCreateData): Promise<Task> => {
      const response = await TaskService.crud.create(data);
      
      if (!response.success) {
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

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdateData }): Promise<Task> => {
      const response = await TaskService.crud.update(id, data);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update task');
      }
      
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });
      
      // Snapshot previous value
      const previousTask = queryClient.getQueryData(QueryKeys.task(id));
      
      // Optimistically update
      optimisticUpdates.updateTaskOptimistically(id, data, previousTask);
      
      return { previousTask };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousTask) {
        optimisticUpdates.rollbackToData(context.previousTask);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      toast.success('Task updated successfully!');
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await TaskService.crud.delete(id);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete task');
      }
    },
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.task(id) });
      
      // Snapshot previous value
      const previousData = optimisticUpdates.getPreviousData();
      
      // Optimistically remove task
      optimisticUpdates.removeTaskOptimistically(id, previousData);
      
      return { previousData };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousData) {
        optimisticUpdates.rollbackToData(context.previousData);
      }
      toast.error(`Failed to delete task: ${error.message}`);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.tasks });
      toast.success('Task deleted successfully!');
      
      // Navigate back to tasks list
      navigate('/');
    },
  });

  // === PUBLIC API ===

  const createTask = useCallback(
    async (data: TaskCreateData): Promise<TaskSubmissionResult> => {
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

  const updateTask = useCallback(
    async (id: string, data: TaskUpdateData): Promise<TaskSubmissionResult> => {
      try {
        const task = await updateMutation.mutateAsync({ id, data });
        return {
          success: true,
          message: 'Task updated successfully!',
          task,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to update task',
        };
      }
    },
    [updateMutation]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<TaskSubmissionResult> => {
      try {
        await deleteMutation.mutateAsync(id);
        return {
          success: true,
          message: 'Task deleted successfully!',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to delete task',
        };
      }
    },
    [deleteMutation]
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    createTask,
    updateTask,
    deleteTask,
    isSubmitting,
  };
} 

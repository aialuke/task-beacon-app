
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { toast } from 'sonner';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  data?: Task;
}

/**
 * Simplified task mutations hook with clear separation of concerns
 * 
 * Handles only server-side mutations and optimistic updates.
 * Does not manage form state or UI state.
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();
  const optimisticUpdates = useTaskOptimisticUpdates();

  // Toggle task completion status
  const toggleTaskComplete = useMutation({
    mutationFn: async (task: Task): Promise<TaskMutationResult> => {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      const result = await TaskService.status.updateStatus(task.id, newStatus);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update task status');
      }
      
      return {
        success: true,
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

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string): Promise<TaskMutationResult> => {
      const result = await TaskService.crud.delete(taskId);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete task');
      }
      
      return { success: true };
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  // Create task
  const createTask = useMutation({
    mutationFn: async (taskData: Partial<Task>): Promise<TaskMutationResult> => {
      const result = await TaskService.crud.create(taskData);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create task');
      }
      
      return {
        success: true,
        data: result.data,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }): Promise<TaskMutationResult> => {
      const result = await TaskService.crud.update(taskId, updates);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update task');
      }
      
      return {
        success: true,
        data: result.data,
      };
    },
    onMutate: async ({ taskId, updates }) => {
      const previousData = optimisticUpdates.getPreviousData();
      optimisticUpdates.updateTaskOptimistically(taskId, updates);
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

  // Optimized callback wrappers for better performance
  const toggleTaskCompleteCallback = useOptimizedCallback(
    (task: Task) => toggleTaskComplete.mutateAsync(task),
    [toggleTaskComplete],
    { name: 'toggleTaskComplete' }
  );

  const deleteTaskCallback = useOptimizedCallback(
    (taskId: string) => deleteTask.mutateAsync(taskId),
    [deleteTask],
    { name: 'deleteTask' }
  );

  const createTaskCallback = useOptimizedCallback(
    (taskData: Partial<Task>) => createTask.mutateAsync(taskData),
    [createTask],
    { name: 'createTask' }
  );

  const updateTaskCallback = useOptimizedCallback(
    (taskId: string, updates: Partial<Task>) => updateTask.mutateAsync({ taskId, updates }),
    [updateTask],
    { name: 'updateTask' }
  );

  return {
    // Mutation objects (for loading states, etc.)
    toggleTaskComplete,
    deleteTask,
    createTask,
    updateTask,
    
    // Optimized callback functions
    toggleTaskCompleteCallback,
    deleteTaskCallback,
    createTaskCallback,
    updateTaskCallback,
    
    // Combined loading state
    isLoading: toggleTaskComplete.isPending || deleteTask.isPending || createTask.isPending || updateTask.isPending,
  };
}

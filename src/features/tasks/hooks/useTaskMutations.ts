
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { toast } from 'sonner';

interface TaskMutationResult {
  success: boolean;
  message?: string;
  error?: string;
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
        throw new Error(result.error?.message || 'Failed to update task status');
      }
      
      return {
        success: true,
        message: `Task ${newStatus === 'complete' ? 'completed' : 'marked incomplete'} successfully`,
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  // Create task
  const createTask = useMutation({
    mutationFn: async (taskData: { 
      title: string; 
      description?: string; 
      dueDate?: string; 
      photoUrl?: string; 
      urlLink?: string; 
      assigneeId?: string; 
      parentTaskId?: string; 
    }): Promise<TaskMutationResult> => {
      const result = await TaskService.crud.create(taskData);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create task');
      }
      
      return {
        success: true,
        message: 'Task created successfully',
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
        throw new Error(result.error?.message || 'Failed to update task');
      }
      
      return {
        success: true,
        message: 'Task updated successfully',
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
    async (task: Task) => {
      const result = await toggleTaskComplete.mutateAsync(task);
      return result;
    },
    [toggleTaskComplete],
    { name: 'toggleTaskComplete' }
  );

  const deleteTaskCallback = useOptimizedCallback(
    async (taskId: string) => {
      const result = await deleteTask.mutateAsync(taskId);
      return result;
    },
    [deleteTask],
    { name: 'deleteTask' }
  );

  const createTaskCallback = useOptimizedCallback(
    async (taskData: { 
      title: string; 
      description?: string; 
      dueDate?: string; 
      photoUrl?: string; 
      urlLink?: string; 
      assigneeId?: string; 
      parentTaskId?: string; 
    }) => {
      const result = await createTask.mutateAsync(taskData);
      return result;
    },
    [createTask],
    { name: 'createTask' }
  );

  const updateTaskCallback = useOptimizedCallback(
    async (taskId: string, updates: Partial<Task>) => {
      const result = await updateTask.mutateAsync({ taskId, updates });
      return result;
    },
    [updateTask],
    { name: 'updateTask' }
  );

  // Create follow-up task
  const createFollowUpTask = useOptimizedCallback(
    async (parentTask: Task, taskData: { title: string; description?: string }): Promise<TaskMutationResult> => {
      const followUpData = {
        ...taskData,
        parentTaskId: parentTask.id, // Use camelCase
      };
      const result = await createTask.mutateAsync(followUpData);
      return {
        success: result.success,
        message: result.success ? 'Follow-up task created successfully' : 'Failed to create follow-up task',
        error: result.success ? undefined : 'Failed to create follow-up task',
        data: result.data,
      };
    },
    [createTask],
    { name: 'createFollowUpTask' }
  );

  // Backward compatibility methods
  const deleteTaskById = deleteTaskCallback;
  
  // Status mutations for backward compatibility
  const markAsComplete = useOptimizedCallback(
    async (taskId: string) => {
      // This would need the actual task object to work properly
      console.log('markAsComplete called with taskId:', taskId);
      return { success: false, error: 'Task object required for completion toggle' };
    },
    [],
    { name: 'markAsComplete' }
  );

  const markAsIncomplete = useOptimizedCallback(
    async (taskId: string) => {
      console.log('markAsIncomplete called with taskId:', taskId);
      return { success: false, error: 'Task object required for completion toggle' };
    },
    [],
    { name: 'markAsIncomplete' }
  );

  // Optimistic updates for backward compatibility
  const updateTaskOptimistically = optimisticUpdates.updateTaskOptimistically;

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
    
    // Backward compatibility methods
    deleteTaskById,
    markAsComplete,
    markAsIncomplete,
    createFollowUpTask,
    updateTaskOptimistically,
    
    // Combined loading state
    isLoading: toggleTaskComplete.isPending || deleteTask.isPending || createTask.isPending || updateTask.isPending,
  };
}

// Export specialized hooks for backward compatibility
export function useTaskStatusMutations() {
  const mutations = useTaskMutations();
  return {
    markAsComplete: mutations.markAsComplete,
    markAsIncomplete: mutations.markAsIncomplete,
    isLoading: mutations.isLoading,
  };
}

export function useTaskDeleteMutations() {
  const mutations = useTaskMutations();
  return {
    deleteTask: mutations.deleteTaskCallback,
    isLoading: mutations.isLoading,
  };
}

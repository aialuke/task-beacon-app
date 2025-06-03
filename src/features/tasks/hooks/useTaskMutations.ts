import { useTaskStatusMutations } from './useTaskStatusMutations';
import { useTaskPinMutations } from './useTaskPinMutations';
import { useTaskDeleteMutations } from './useTaskDeleteMutations';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks.service';
import type { Task } from '@/types';

/**
 * Composed task mutations hook
 * 
 * This hook now acts as a clean aggregator that composes individual focused hooks
 * for different types of task mutations. This provides:
 * 
 * - Better separation of concerns
 * - Easier testing and maintenance
 * - More focused individual hooks
 * - Backward compatibility for existing code
 * 
 * Each specific hook can also be imported individually for more targeted usage.
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();
  const statusMutations = useTaskStatusMutations();
  const pinMutations = useTaskPinMutations();
  const deleteMutations = useTaskDeleteMutations();
  const optimisticUpdates = useTaskOptimisticUpdates();

  // Create follow-up task mutation
  const createFollowUpTaskMutation = useMutation({
    mutationFn: async ({ parentTask, taskData }: { parentTask: Task; taskData: any }) => {
      const response = await TaskService.createFollowUp(parentTask.id, taskData);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create follow-up task');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createFollowUpTask = async (parentTask: Task, taskData: any) => {
    try {
      await createFollowUpTaskMutation.mutateAsync({ parentTask, taskData });
      return { success: true, message: 'Follow-up task created successfully' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create follow-up task' };
    }
  };

  return {
    // Status mutations
    markAsComplete: statusMutations.markAsComplete,
    markAsIncomplete: statusMutations.markAsIncomplete,

    // Pin mutations
    togglePin: pinMutations.togglePin,
    pinTask: pinMutations.pinTask,
    unpinTask: pinMutations.unpinTask,

    // Delete mutations
    deleteTask: deleteMutations.deleteTask,

    // Follow-up task creation
    createFollowUpTask,

    // Optimistic updates (for backward compatibility)
    updateTaskOptimistically: optimisticUpdates.updateTaskOptimistically,

    // Convenience wrapper functions for TaskActions compatibility
    toggleTaskComplete: async (task: Task) => {
      try {
        // Use the mutation directly for proper async handling
        const updates = task.status === 'complete' 
          ? { status: 'pending' as const } 
          : { status: 'complete' as const };
        const action = task.status === 'complete' ? 'incomplete' : 'complete';
        
        await statusMutations.statusMutation.mutateAsync({ 
          taskId: task.id, 
          updates, 
          action 
        });
        
        return { 
          success: true, 
          message: task.status === 'complete' ? 'Task marked as incomplete' : 'Task completed successfully' 
        };
      } catch (error) {
        return { 
          success: false, 
          error: true,
          message: error instanceof Error ? error.message : 'Failed to update task status' 
        };
      }
    },

    toggleTaskPin: async (task: Task) => {
      try {
        pinMutations.togglePin(task);
        return { 
          success: true, 
          message: task.pinned ? 'Task unpinned' : 'Task pinned' 
        };
      } catch (error) {
        return { 
          success: false, 
          error: true,
          message: error instanceof Error ? error.message : 'Failed to update task pin status' 
        };
      }
    },

    deleteTaskById: async (taskId: string) => {
      try {
        deleteMutations.deleteTask(taskId);
        return { 
          success: true, 
          message: 'Task deleted successfully' 
        };
      } catch (error) {
        return { 
          success: false, 
          error: true,
          message: error instanceof Error ? error.message : 'Failed to delete task' 
        };
      }
    },
  };
}

// Re-export individual hooks for targeted usage
export { useTaskStatusMutations } from './useTaskStatusMutations';
export { useTaskPinMutations } from './useTaskPinMutations';
export { useTaskDeleteMutations } from './useTaskDeleteMutations';
export { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

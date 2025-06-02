import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks.service';
import { handleApiError } from '@/lib/utils/error';
import { performanceMonitor } from '@/lib/utils/performance';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

interface TaskPinMutationResult {
  success: boolean;
  error: string | null;
  message: string;
  pinned: boolean;
  task: Task;
}

/**
 * Focused hook for task pin mutations
 * 
 * Handles pinning and unpinning tasks with optimistic updates,
 * error handling, and performance monitoring.
 * 
 * Separated from the monolithic useTaskMutations for better maintainability.
 */
export function useTaskPinMutations() {
  const {
    updateTaskOptimistically,
    getPreviousData,
  } = useTaskOptimisticUpdates();

  /**
   * Toggle task pin status (pinned ↔ unpinned)
   */
  const toggleTaskPin = useOptimizedCallback(
    async (task: Task): Promise<TaskPinMutationResult> => {
      const operationId = `toggle-pin-${task.id}`;
      performanceMonitor.start(operationId, { 
        taskId: task.id, 
        currentPinned: task.pinned 
      });
      
      const newPinnedState = !task.pinned;
      const previousData = getPreviousData();

      try {
        // Optimistic update
        updateTaskOptimistically(task.id, { pinned: newPinnedState });

        // API call
        const response = await TaskService.togglePin(task.id, newPinnedState);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to toggle pin status');
        }

        performanceMonitor.end(operationId);

        return {
          success: true,
          error: null,
          message: `Task ${newPinnedState ? 'pinned' : 'unpinned'}`,
          pinned: newPinnedState,
          task: { ...task, pinned: newPinnedState },
        };
      } catch (error: unknown) {
        // Rollback optimistic update
        updateTaskOptimistically(task.id, { pinned: task.pinned }, previousData);

        // Handle error without showing toast (UI layer responsibility)
        handleApiError(null, `Failed to ${newPinnedState ? 'pin' : 'unpin'} task`, {
          showToast: false,
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : `Failed to ${newPinnedState ? 'pin' : 'unpin'} task`;
        performanceMonitor.end(operationId);

        return {
          success: false,
          error: errorMessage,
          message: `Failed to ${newPinnedState ? 'pin' : 'unpin'} task: ${errorMessage}`,
          pinned: task.pinned,
          task,
        };
      }
    },
    [updateTaskOptimistically, getPreviousData],
    { name: 'toggleTaskPin' }
  );

  /**
   * Pin a task
   */
  const pinTask = useOptimizedCallback(
    async (task: Task): Promise<TaskPinMutationResult> => {
      if (task.pinned) {
        return {
          success: true,
          error: null,
          message: 'Task is already pinned',
          pinned: true,
          task,
        };
      }
      return toggleTaskPin(task);
    },
    [toggleTaskPin],
    { name: 'pinTask' }
  );

  /**
   * Unpin a task
   */
  const unpinTask = useOptimizedCallback(
    async (task: Task): Promise<TaskPinMutationResult> => {
      if (!task.pinned) {
        return {
          success: true,
          error: null,
          message: 'Task is not pinned',
          pinned: false,
          task,
        };
      }
      return toggleTaskPin(task);
    },
    [toggleTaskPin],
    { name: 'unpinTask' }
  );

  return {
    toggleTaskPin,
    pinTask,
    unpinTask,
  };
} 
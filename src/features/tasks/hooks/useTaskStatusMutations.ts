import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks.service';
import { handleApiError } from '@/lib/utils/error';
import { performanceMonitor } from '@/lib/utils/performance';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

interface TaskStatusMutationResult {
  success: boolean;
  error: string | null;
  message: string;
  status: Task['status'];
  task: Task;
}

/**
 * Focused hook for task status mutations
 * 
 * Handles toggling task completion status with optimistic updates,
 * error handling, and performance monitoring.
 * 
 * Separated from the monolithic useTaskMutations for better maintainability.
 */
export function useTaskStatusMutations() {
  const {
    updateTaskOptimistically,
    getPreviousData,
    rollbackToData,
  } = useTaskOptimisticUpdates();

  /**
   * Toggle task completion status (complete ↔ pending)
   */
  const toggleTaskComplete = useOptimizedCallback(
    async (task: Task): Promise<TaskStatusMutationResult> => {
      const operationId = `toggle-complete-${task.id}`;
      performanceMonitor.start(operationId, { 
        taskId: task.id, 
        currentStatus: task.status 
      });
      
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      const previousData = getPreviousData();

      try {
        // Optimistic update
        updateTaskOptimistically(task.id, { status: newStatus });

        // API call
        const response = await TaskService.updateStatus(task.id, newStatus);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to update task status');
        }

        performanceMonitor.end(operationId);
        
        return {
          success: true,
          error: null,
          message: `Task marked ${newStatus}`,
          status: newStatus,
          task: { ...task, status: newStatus },
        };
      } catch (error: unknown) {
        // Rollback optimistic update
        updateTaskOptimistically(task.id, { status: task.status }, previousData);

        // Handle error without showing toast (UI layer responsibility)
        handleApiError(null, 'Failed to update task', {
          showToast: false,
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
        performanceMonitor.end(operationId);

        return {
          success: false,
          error: errorMessage,
          message: `Failed to update task: ${errorMessage}`,
          status: task.status,
          task,
        };
      }
    },
    [updateTaskOptimistically, getPreviousData],
    { name: 'toggleTaskComplete' }
  );

  /**
   * Mark task as complete
   */
  const markTaskComplete = useOptimizedCallback(
    async (task: Task): Promise<TaskStatusMutationResult> => {
      if (task.status === 'complete') {
        return {
          success: true,
          error: null,
          message: 'Task is already complete',
          status: 'complete',
          task,
        };
      }
      return toggleTaskComplete(task);
    },
    [toggleTaskComplete],
    { name: 'markTaskComplete' }
  );

  /**
   * Mark task as pending
   */
  const markTaskPending = useOptimizedCallback(
    async (task: Task): Promise<TaskStatusMutationResult> => {
      if (task.status === 'pending') {
        return {
          success: true,
          error: null,
          message: 'Task is already pending',
          status: 'pending',
          task,
        };
      }
      return toggleTaskComplete(task);
    },
    [toggleTaskComplete],
    { name: 'markTaskPending' }
  );

  return {
    toggleTaskComplete,
    markTaskComplete,
    markTaskPending,
  };
} 
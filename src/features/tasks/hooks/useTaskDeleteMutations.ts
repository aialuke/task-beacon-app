import { TaskService } from '@/lib/api/tasks.service';
import { handleApiError } from '@/lib/utils/error';
import { performanceMonitor } from '@/lib/utils/performance';
import { useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

interface TaskDeleteMutationResult {
  success: boolean;
  error: string | null;
  message: string;
  taskId: string;
}

/**
 * Focused hook for task deletion
 * 
 * Handles deleting tasks with optimistic updates,
 * error handling, and performance monitoring.
 * 
 * Separated from the monolithic useTaskMutations for better maintainability.
 */
export function useTaskDeleteMutations() {
  const {
    removeTaskOptimistically,
    getPreviousData,
    rollbackToData,
  } = useTaskOptimisticUpdates();

  /**
   * Delete a task by ID
   */
  const deleteTask = useOptimizedCallback(
    async (taskId: string): Promise<TaskDeleteMutationResult> => {
      const operationId = `delete-task-${taskId}`;
      performanceMonitor.start(operationId, { taskId });
      
      const previousData = getPreviousData();

      try {
        // Optimistically remove from cache
        removeTaskOptimistically(taskId, previousData);

        // API call
        const response = await TaskService.delete(taskId);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to delete task');
        }

        performanceMonitor.end(operationId);

        return {
          success: true,
          error: null,
          message: 'Task deleted successfully',
          taskId,
        };
      } catch (error: unknown) {
        // Rollback optimistic removal
        rollbackToData(previousData);

        // Handle error without showing toast (UI layer responsibility)
        handleApiError(null, 'Failed to delete task', {
          showToast: false,
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
        performanceMonitor.end(operationId);

        return {
          success: false,
          error: errorMessage,
          message: `Failed to delete task: ${errorMessage}`,
          taskId,
        };
      }
    },
    [removeTaskOptimistically, getPreviousData, rollbackToData],
    { name: 'deleteTask' }
  );

  /**
   * Delete multiple tasks by IDs
   */
  const deleteMultipleTasks = useOptimizedCallback(
    async (taskIds: string[]): Promise<TaskDeleteMutationResult[]> => {
      const results = await Promise.allSettled(
        taskIds.map(taskId => deleteTask(taskId))
      );

      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            error: result.reason?.message || 'Failed to delete task',
            message: `Failed to delete task: ${result.reason?.message || 'Unknown error'}`,
            taskId: taskIds[index],
          };
        }
      });
    },
    [deleteTask],
    { name: 'deleteMultipleTasks' }
  );

  return {
    deleteTask,
    deleteMultipleTasks,
  };
} 
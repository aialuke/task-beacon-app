import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { TaskService } from '@/lib/api/tasks.service';
import { handleApiError } from '@/lib/utils/error';

// Define proper types for React Query data structures
interface PaginatedTasksResponse {
  data: {
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  };
  error: unknown;
}

interface InfiniteTasksResponse {
  pages: Array<{
    data: Task[];
    totalCount: number;
    hasNextPage: boolean;
  }>;
  pageParams: unknown[];
}

type TaskQueryData = PaginatedTasksResponse | InfiniteTasksResponse | unknown;

/**
 * Type guard to check if data is paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as Record<string, unknown>).data === 'object'
  );
}

/**
 * Type guard to check if data is infinite response
 */
function isInfiniteResponse(data: unknown): data is InfiniteTasksResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'pages' in data &&
    Array.isArray((data as Record<string, unknown>).pages)
  );
}

/**
 * Consolidated hook for all task mutation operations
 *
 * Single source of truth for task mutations with consistent error handling,
 * optimistic updates, and user feedback.
 *
 * UI side effects (toasts, notifications) are now handled by the UI layer.
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();

  /**
   * Optimistically update a task in the cache
   */
  const updateTaskOptimistically = useCallback(
    (taskId: string, updates: Partial<Task>, fallbackData?: unknown) => {
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldData: unknown) => {
        if (!oldData) return fallbackData || oldData;

        // Handle infinite query structure (pages)
        if (isInfiniteResponse(oldData)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((task: Task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            })),
          };
        }

        // Handle regular paginated response
        if (isPaginatedResponse(oldData)) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((task: Task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            },
          };
        }

        // Return unchanged if structure is unrecognized
        return oldData;
      });
    },
    [queryClient]
  );

  /**
   * Toggle task completion status
   */
  const toggleTaskComplete = useCallback(
    async (task: Task) => {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      const previousData = queryClient.getQueryData([
        'tasks',
        undefined,
        undefined,
      ]);

      try {
        updateTaskOptimistically(task.id, { status: newStatus });

        const response = await TaskService.updateStatus(task.id, newStatus);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to update task status');
        }

        // UI layer should handle haptic feedback, toast, and browser notification
        return {
          success: true,
          error: null,
          message: `Task marked ${newStatus}`,
          status: newStatus,
          task,
        };
      } catch (error: unknown) {
        updateTaskOptimistically(
          task.id,
          { status: task.status },
          previousData
        );

        handleApiError(null, 'Failed to update task', {
          showToast: false, // UI layer handles toasts
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to update task';

        return {
          success: false,
          error: errorMessage,
          message: `Failed to update task: ${errorMessage}`,
          status: task.status,
          task,
        };
      }
    },
    [updateTaskOptimistically, queryClient]
  );

  /**
   * Toggle task pin status
   */
  const toggleTaskPin = useCallback(
    async (task: Task) => {
      const newPinnedState = !task.pinned;
      const previousData = queryClient.getQueryData([
        'tasks',
        undefined,
        undefined,
      ]);

      try {
        updateTaskOptimistically(task.id, { pinned: newPinnedState });

        const response = await TaskService.togglePin(task.id, newPinnedState);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to toggle pin status');
        }

        return {
          success: true,
          error: null,
          message: `Task ${newPinnedState ? 'pinned' : 'unpinned'}`,
          pinned: newPinnedState,
          task,
        };
      } catch (error: unknown) {
        updateTaskOptimistically(
          task.id,
          { pinned: task.pinned },
          previousData
        );

        handleApiError(null, `Failed to ${newPinnedState ? 'pin' : 'unpin'} task`, {
          showToast: false, // UI layer handles toasts
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : `Failed to ${newPinnedState ? 'pin' : 'unpin'} task`;

        return {
          success: false,
          error: errorMessage,
          message: `Failed to ${newPinnedState ? 'pin' : 'unpin'} task: ${errorMessage}`,
          pinned: task.pinned,
          task,
        };
      }
    },
    [updateTaskOptimistically, queryClient]
  );

  /**
   * Create a follow-up task
   */
  const createFollowUpTask = useCallback(
    async (parentTask: Task, taskData: Record<string, unknown>) => {
      try {
        // Convert the record to proper TaskCreateData format
        const createData = {
          title: taskData.title as string,
          description: taskData.description as string,
          dueDate: taskData.due_date as string,
          photoUrl: taskData.photo_url as string | null,
          urlLink: taskData.url_link as string,
          assigneeId: taskData.assignee_id as string,
          pinned: taskData.pinned as boolean,
        };

        const response = await TaskService.createFollowUp(parentTask.id, createData);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to create follow-up task');
        }

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        return {
          success: true,
          error: null,
          message: 'Follow-up task created successfully',
          parentTask,
          taskData,
        };
      } catch (error: unknown) {
        handleApiError(null, 'Failed to create follow-up task', {
          showToast: false, // UI layer handles toasts
          logToConsole: true,
          rethrow: false,
        });

        const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up task';

        return {
          success: false,
          error: errorMessage,
          message: `Failed to create follow-up task: ${errorMessage}`,
          parentTask,
          taskData,
        };
      }
    },
    [queryClient]
  );

  return {
    toggleTaskComplete,
    toggleTaskPin,
    createFollowUpTask,
  };
}

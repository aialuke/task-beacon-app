import { useTaskCreation } from './mutations/useTaskCreation';
import { useTaskDeletion } from './mutations/useTaskDeletion';
import { useTaskStatus } from './mutations/useTaskStatus';
import { useTaskUpdates } from './mutations/useTaskUpdates';

/**
 * Unified Task Mutations Hook - Phase 3 Consolidated
 *
 * Combines all task mutation hooks with simplified, consistent patterns.
 * Eliminates duplicate error handling, optimistic updates, and toast notifications.
 */
export function useTaskMutations() {
  const creation = useTaskCreation();
  const deletion = useTaskDeletion();
  const updates = useTaskUpdates();
  const status = useTaskStatus();

  return {
    // Creation operations
    createTask: creation.createTask,
    createTaskCallback: creation.createTaskCallback,
    createFollowUpTask: creation.createFollowUpTask,

    // Update operations
    updateTask: updates.updateTask,
    updateTaskCallback: updates.updateTaskCallback,

    // Status operations
    toggleTaskComplete: status.toggleTaskComplete,
    toggleTaskCompleteCallback: status.toggleTaskCompleteCallback,
    markAsComplete: status.markAsComplete,
    markAsIncomplete: status.markAsIncomplete,

    // Deletion operations
    deleteTask: deletion.deleteTask,
    deleteTaskCallback: deletion.deleteTaskCallback,
    deleteTaskById: deletion.deleteTaskById,

    // Loading states
    isCreating: creation.isLoading,
    isUpdating: updates.isLoading,
    isDeleting: deletion.isLoading,
    isTogglingStatus: status.isLoading,

    // Combined loading state
    isLoading:
      creation.isLoading ||
      updates.isLoading ||
      deletion.isLoading ||
      status.isLoading,
  };
}

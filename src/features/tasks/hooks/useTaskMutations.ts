
import { useTaskCreation } from './mutations/useTaskCreation';
import { useTaskUpdates } from './mutations/useTaskUpdates';
import { useTaskDeletion } from './mutations/useTaskDeletion';
import { useTaskStatus } from './mutations/useTaskStatus';
import { useMemo } from 'react';

/**
 * Standardized task mutations hook - Phase 2.4 Simplified
 * 
 * Using standard React hooks instead of performance abstractions
 */
export function useTaskMutations() {
  const creation = useTaskCreation();
  const updates = useTaskUpdates();
  const deletion = useTaskDeletion();
  const status = useTaskStatus();

  // Use standard useMemo for the combined interface
  return useMemo(
    () => ({
      // Creation operations
      createTask: creation.createTaskCallback,
      createTaskCallback: creation.createTaskCallback,
      createFollowUpTask: creation.createFollowUpTask,
      
      // Update operations
      updateTask: updates.updateTaskCallback,
      updateTaskCallback: updates.updateTaskCallback,
      
      // Deletion operations
      deleteTask: deletion.deleteTaskCallback,
      deleteTaskCallback: deletion.deleteTaskCallback,
      deleteTaskById: deletion.deleteTaskCallback,
      
      // Status operations
      toggleTaskComplete: status.toggleTaskCompleteCallback,
      toggleTaskCompleteCallback: status.toggleTaskCompleteCallback,
      markAsComplete: status.markAsComplete,
      markAsIncomplete: status.markAsIncomplete,
      
      // Combined loading state
      isLoading: creation.isLoading || updates.isLoading || deletion.isLoading || status.isLoading,
    }),
    [creation, updates, deletion, status]
  );
}

// Re-export focused hooks for direct usage
export { useTaskCreation } from './mutations/useTaskCreation';
export { useTaskUpdates } from './mutations/useTaskUpdates';
export { useTaskDeletion } from './mutations/useTaskDeletion';
export { useTaskStatus } from './mutations/useTaskStatus';

// Backward compatibility functions for removed hooks
export function useTaskStatusMutations() {
  const status = useTaskStatus();
  return {
    markAsComplete: status.markAsComplete,
    markAsIncomplete: status.markAsIncomplete,
    toggleTaskComplete: status.toggleTaskCompleteCallback,
    isLoading: status.isLoading,
  };
}

export function useTaskDeleteMutations() {
  const deletion = useTaskDeletion();
  return {
    deleteTask: deletion.deleteTaskCallback,
    deleteTaskById: deletion.deleteTaskCallback,
    isLoading: deletion.isLoading,
  };
}

// Phase 1 Fix: Removed complex batch operations and unused imports

import { useTaskCreation } from './useTaskCreation';
import { useTaskDeletion } from './useTaskDeletion';
import { useTaskStatusToggle } from './useTaskStatusToggle';
import { useTaskUpdates } from './useTaskUpdates';

/**
 * Unified Task Mutations Hook - Phase 1 Simplified
 * 
 * Combines focused task mutation hooks with clean, single-responsibility patterns.
 * Removed complex batch operations for better maintainability.
 */
export function useTaskMutations() {
  const creation = useTaskCreation();
  const deletion = useTaskDeletion();
  const updates = useTaskUpdates();
  const status = useTaskStatusToggle();

  return {
    // Creation operations
    createTask: creation.createTask,
    createTaskAsync: creation.createTaskAsync,
    createFollowUpTask: creation.createFollowUpTask,
    createFollowUpTaskAsync: creation.createFollowUpTaskAsync,

    // Update operations
    updateTask: updates.updateTask,
    updateTaskAsync: updates.updateTaskAsync,

    // Status operations
    toggleStatus: status.toggleStatus,
    toggleStatusAsync: status.toggleStatusAsync,
    markComplete: status.markComplete,
    markCompleteAsync: status.markCompleteAsync,
    markIncomplete: status.markIncomplete,
    markIncompleteAsync: status.markIncompleteAsync,

    // Deletion operations
    deleteTask: deletion.deleteTask,
    deleteTaskAsync: deletion.deleteTaskAsync,

    // Loading states
    isCreating: creation.isLoading,
    isUpdating: updates.isLoading,
    isDeleting: deletion.isLoading,
    isTogglingStatus: status.isLoading,
    
    // Combined loading state
    isLoading: creation.isLoading || updates.isLoading || deletion.isLoading || status.isLoading,
    
    // Reset functions
    resetCreation: creation.reset,
    resetUpdates: updates.reset,
    resetDeletion: deletion.reset,
    resetStatus: status.reset,
  };
}

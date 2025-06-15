
/**
 * Task Submission Hook - Phase 1 Refactored
 *
 * Simplified unified interface using focused hooks.
 * Reduced from 225+ lines to maintain single responsibility principle.
 */

import { useTaskCreation } from './useTaskCreation';
import { useTaskUpdate } from './useTaskUpdate';
import { useTaskDeletion } from './useTaskDeletion';

interface UseTaskSubmissionReturn {
  createTask: ReturnType<typeof useTaskCreation>['createTask'];
  updateTask: ReturnType<typeof useTaskUpdate>['updateTask'];
  deleteTask: ReturnType<typeof useTaskDeletion>['deleteTask'];
  isSubmitting: boolean;
}

/**
 * Unified task submission interface using focused hooks
 */
export function useTaskSubmission(): UseTaskSubmissionReturn {
  const creation = useTaskCreation();
  const update = useTaskUpdate();
  const deletion = useTaskDeletion();

  const isSubmitting = creation.isLoading || update.isLoading || deletion.isLoading;

  return {
    createTask: creation.createTask,
    updateTask: update.updateTask,
    deleteTask: deletion.deleteTask,
    isSubmitting,
  };
}

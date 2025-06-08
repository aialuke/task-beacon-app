
import { useTaskCreation } from './useTaskCreation';
import { useTaskUpdates } from './useTaskUpdates';
import { useTaskDeletion } from './useTaskDeletion';
import { useTaskStatus } from './useTaskStatus';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';

/**
 * Orchestrator hook that combines all task mutation capabilities
 * This provides the same interface as the original useTaskMutations for backward compatibility
 */
export function useTaskMutationsOrchestrator() {
  const creation = useTaskCreation();
  const updates = useTaskUpdates();
  const deletion = useTaskDeletion();
  const status = useTaskStatus();
  const optimisticUpdates = useTaskOptimisticUpdates();

  // Combined loading state
  const isLoading = creation.isLoading || updates.isLoading || deletion.isLoading || status.isLoading;

  return {
    // Creation
    createTask: creation.createTask,
    createTaskCallback: creation.createTaskCallback,
    createFollowUpTask: creation.createFollowUpTask,
    
    // Updates
    updateTask: updates.updateTask,
    updateTaskCallback: updates.updateTaskCallback,
    
    // Deletion
    deleteTask: deletion.deleteTask,
    deleteTaskCallback: deletion.deleteTaskCallback,
    deleteTaskById: deletion.deleteTaskById,
    
    // Status
    toggleTaskComplete: status.toggleTaskComplete,
    toggleTaskCompleteCallback: status.toggleTaskCompleteCallback,
    markAsComplete: status.markAsComplete,
    markAsIncomplete: status.markAsIncomplete,
    
    // Optimistic updates
    updateTaskOptimistically: optimisticUpdates.updateTaskOptimistically,
    
    // Combined state
    isLoading,
  };
}
// CodeRabbit review

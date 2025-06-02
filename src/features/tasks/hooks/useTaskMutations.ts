import { useTaskStatusMutations } from './useTaskStatusMutations';
import { useTaskPinMutations } from './useTaskPinMutations';
import { useTaskDeleteMutations } from './useTaskDeleteMutations';
import { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates';

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
  const statusMutations = useTaskStatusMutations();
  const pinMutations = useTaskPinMutations();
  const deleteMutations = useTaskDeleteMutations();
  const optimisticUpdates = useTaskOptimisticUpdates();

  return {
    // Status mutations
    toggleTaskComplete: statusMutations.toggleTaskComplete,
    markTaskComplete: statusMutations.markTaskComplete,
    markTaskPending: statusMutations.markTaskPending,

    // Pin mutations
    toggleTaskPin: pinMutations.toggleTaskPin,
    pinTask: pinMutations.pinTask,
    unpinTask: pinMutations.unpinTask,

    // Delete mutations
    deleteTask: deleteMutations.deleteTask,
    deleteMultipleTasks: deleteMutations.deleteMultipleTasks,

    // Optimistic updates (for backward compatibility)
    updateTaskOptimistically: optimisticUpdates.updateTaskOptimistically,
  };
}

// Re-export individual hooks for targeted usage
export { useTaskStatusMutations } from './useTaskStatusMutations';
export { useTaskPinMutations } from './useTaskPinMutations';
export { useTaskDeleteMutations } from './useTaskDeleteMutations';
export { useTaskOptimisticUpdates } from './useTaskOptimisticUpdates'; 
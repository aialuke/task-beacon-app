
/**
 * Main task mutations hook - now delegates to focused mutation hooks
 * This maintains backward compatibility while using the new focused architecture
 */
export { useTaskMutationsOrchestrator as useTaskMutations } from './mutations/useTaskMutationsOrchestrator';

// Re-export specialized hooks for direct usage
export { useTaskCreation } from './mutations/useTaskCreation';
export { useTaskUpdates } from './mutations/useTaskUpdates';
export { useTaskDeletion } from './mutations/useTaskDeletion';
export { useTaskStatus } from './mutations/useTaskStatus';

// Backward compatibility exports
export function useTaskStatusMutations() {
  const mutations = useTaskMutations();
  return {
    markAsComplete: mutations.markAsComplete,
    markAsIncomplete: mutations.markAsIncomplete,
    isLoading: mutations.isLoading,
  };
}

export function useTaskDeleteMutations() {
  const mutations = useTaskMutations();
  return {
    deleteTask: mutations.deleteTaskCallback,
    isLoading: mutations.isLoading,
  };
}

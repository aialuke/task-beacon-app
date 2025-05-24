
import { useTaskQueries } from "./useTaskQueries";
import { useTaskMutation } from "./mutations/useTaskMutation";

/**
 * Hook for pure task data operations without UI concerns
 * 
 * This hook focuses solely on data fetching and mutations,
 * separating it from UI state management.
 */
export function useTaskData(pageSize = 10) {
  // Get task queries (data fetching)
  const queryResult = useTaskQueries(pageSize);
  
  // Get task mutations (data modifications)
  const mutations = useTaskMutation();

  return {
    // Query data
    ...queryResult,
    
    // Mutation operations
    ...mutations
  };
}

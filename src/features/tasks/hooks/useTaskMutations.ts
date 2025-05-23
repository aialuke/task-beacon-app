
import { useTaskPinning } from "./useTaskPinning";
import { useTaskCompletion } from "./useTaskCompletion";
import { useTaskFollowUp } from "./useTaskFollowUp";

/**
 * Consolidated hook for task mutation operations
 * 
 * Combines multiple specialized task mutation hooks for easier usage
 * 
 * @returns Object containing all task mutation functions
 */
export function useTaskMutations() {
  const { toggleTaskPin } = useTaskPinning();
  const { toggleTaskComplete } = useTaskCompletion();
  const { createFollowUpTask } = useTaskFollowUp();

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}

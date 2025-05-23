
import { useTaskPinMutation } from "./useTaskPinMutation";
import { useTaskCompletionMutation } from "./useTaskCompletionMutation";
import { useFollowUpTaskMutation } from "./useFollowUpTaskMutation";

/**
 * Facade hook that combines all task mutation hooks
 * 
 * Provides a single entry point for all task mutations
 * 
 * @returns Object containing all task mutation functions
 */
export function useTaskMutations() {
  const { toggleTaskPin } = useTaskPinMutation();
  const { toggleTaskComplete } = useTaskCompletionMutation();
  const { createFollowUpTask } = useFollowUpTaskMutation();

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}

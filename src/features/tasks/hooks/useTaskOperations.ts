
import { Task } from "@/lib/types";
import { useTaskMutation } from "./useTaskMutation";
import { useTaskCompletionWithLoading } from "./useTaskCompletion";

/**
 * Hook that provides task operations with loading states
 * 
 * This is a convenience hook for components that need to show loading states
 * during task operations. It combines the main task mutations with loading state management.
 * 
 * @param task - The task to perform operations on
 * @returns Object with task operations and their loading states
 */
export function useTaskOperations(task: Task) {
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutation();
  
  // Get completion toggle with loading state
  const { loading: completionLoading, handleToggleComplete } = useTaskCompletionWithLoading(
    task, 
    toggleTaskComplete
  );

  return {
    // Operations
    toggleTaskPin,
    createFollowUpTask,
    handleToggleComplete,
    
    // Loading states
    completionLoading,
    
    // Direct access to the base toggle function if needed
    toggleTaskComplete
  };
}

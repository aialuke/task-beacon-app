
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { updateTaskStatus } from "@/integrations/supabase/api/tasks.api";
import { useOptimisticTaskUpdate } from "./useOptimisticTaskUpdate";

/**
 * Hook for task completion operations
 * 
 * Provides optimistic updates with targeted error recovery
 * 
 * @returns Function to toggle task completion state
 */
export function useTaskCompletion() {
  const queryClient = useQueryClient();
  const { updateTaskOptimistically } = useOptimisticTaskUpdate();

  /**
   * Toggle the completion state of a task with optimistic updates
   * 
   * @param task - The task to toggle completion state for
   */
  const toggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    const previousTasks = queryClient.getQueryData<any>(
      ["tasks", undefined, undefined]
    );
    
    try {
      // Optimistic update
      updateTaskOptimistically(task.id, { status: newStatus });

      const { error } = await updateTaskStatus(task.id, newStatus);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Targeted rollback only for this specific task
      updateTaskOptimistically(task.id, { status: task.status }, previousTasks);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return {
    toggleTaskComplete
  };
}

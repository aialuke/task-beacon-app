
import { useQueryClient } from "@tanstack/react-query";
import { Task, TaskStatus } from "@/lib/types";
import { toast } from "@/lib/toast";
import { updateTaskStatus } from "@/integrations/supabase/api/tasks.api";
import { performOptimisticUpdate, rollbackOptimisticUpdate } from "../utils/optimisticUpdates";

/**
 * Hook for task completion mutations with optimistic updates
 * 
 * @returns Function to toggle a task's completion state
 */
export function useTaskCompletionMutation() {
  const queryClient = useQueryClient();

  /**
   * Toggles the completion status of a task with optimistic update
   * 
   * @param task - The task to update
   */
  const toggleTaskComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "complete" ? "pending" : "complete";
    
    // Perform optimistic update
    const { previousTasks } = performOptimisticUpdate(
      queryClient, 
      task,
      (t, status) => ({ ...t, status }),
      'status',
      newStatus
    );
    
    try {
      const { error } = await updateTaskStatus(task.id, newStatus);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Rollback on failure
      rollbackOptimisticUpdate(queryClient, task, previousTasks);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return { toggleTaskComplete };
}

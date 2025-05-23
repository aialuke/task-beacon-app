
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { toggleTaskPin as apiToggleTaskPin } from "@/integrations/supabase/api/tasks.api";
import { useOptimisticTaskUpdate } from "./useOptimisticTaskUpdate";

/**
 * Hook for task pinning operations
 * 
 * Provides optimistic updates with targeted error recovery
 * 
 * @returns Function to toggle task pin state
 */
export function useTaskPinning() {
  const queryClient = useQueryClient();
  const { updateTaskOptimistically } = useOptimisticTaskUpdate();

  /**
   * Toggle the pinned state of a task with optimistic updates
   * 
   * @param task - The task to toggle pin state for
   */
  const toggleTaskPin = async (task: Task) => {
    const newPinnedState = !task.pinned;
    const previousTasks = queryClient.getQueryData<any>(
      ["tasks", undefined, undefined]
    );
    
    try {
      // Optimistic update
      updateTaskOptimistically(task.id, { pinned: newPinnedState });

      const { error } = await apiToggleTaskPin(task.id, newPinnedState);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: unknown) {
      // Targeted rollback only for this specific task
      updateTaskOptimistically(task.id, { pinned: task.pinned }, previousTasks);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return {
    toggleTaskPin
  };
}

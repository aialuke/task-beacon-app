
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { toggleTaskPin as apiToggleTaskPin } from "@/integrations/supabase/api/tasks.api";
import { performOptimisticUpdate, rollbackOptimisticUpdate } from "../utils/optimisticUpdates";

/**
 * Hook for task pin mutations with optimistic updates
 * 
 * @returns Function to toggle a task's pinned state
 */
export function useTaskPinMutation() {
  const queryClient = useQueryClient();

  /**
   * Toggles the pinned state of a task with optimistic update
   * 
   * @param task - The task to update
   */
  const toggleTaskPin = async (task: Task) => {
    const newPinnedState = !task.pinned;
    
    // Perform optimistic update
    const { previousTasks } = performOptimisticUpdate(
      queryClient, 
      task,
      (t, pinned) => ({ ...t, pinned }),
      'pinned',
      newPinnedState
    );
    
    try {
      const { error } = await apiToggleTaskPin(task.id, newPinnedState);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
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

  return { toggleTaskPin };
}


import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { 
  toggleTaskPin as apiToggleTaskPin, 
  updateTaskStatus, 
  createFollowUpTask as apiCreateFollowUpTask 
} from "@/integrations/supabase/api/tasks.api";

/**
 * Hook for task mutation operations
 * 
 * Provides optimistic updates and error handling for task mutations
 * 
 * @returns Object containing task mutation functions
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();

  // Task pin mutation
  const toggleTaskPin = async (task: Task) => {
    const newPinnedState = !task.pinned;
    
    try {
      // Optimistic update
      queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
        oldData ? oldData.map(t => t.id === task.id ? {...t, pinned: newPinnedState} : t) : []
      );

      const { error } = await apiToggleTaskPin(task.id, newPinnedState);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: unknown) {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Task complete mutation
  const toggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    
    try {
      // Optimistic update
      queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
        oldData ? oldData.map(t => t.id === task.id ? {...t, status: newStatus} : t) : []
      );

      const { error } = await updateTaskStatus(task.id, newStatus);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Create follow-up task
  const createFollowUpTask = async (parentTask: Task, newTaskData: any) => {
    try {
      const { error } = await apiCreateFollowUpTask(parentTask.id, newTaskData);

      if (error) throw error;
      
      toast.success("Follow-up task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}

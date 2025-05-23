
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { createFollowUpTask as apiCreateFollowUpTask } from "@/integrations/supabase/api/tasks.api";

/**
 * Hook for creating follow-up tasks
 * 
 * @returns Function to create a follow-up task
 */
export function useFollowUpTaskMutation() {
  const queryClient = useQueryClient();

  /**
   * Creates a follow-up task for a parent task
   * 
   * @param parentTask - The parent task
   * @param newTaskData - Data for the new follow-up task
   */
  const createFollowUpTask = async (parentTask: Task, newTaskData: any) => {
    try {
      const { error } = await apiCreateFollowUpTask(parentTask.id, newTaskData);

      if (error) throw error;
      
      toast.success("Follow-up task created successfully");
      // Invalidate task queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return { createFollowUpTask };
}

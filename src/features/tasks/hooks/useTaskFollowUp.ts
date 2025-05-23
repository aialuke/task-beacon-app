
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { createFollowUpTask as apiCreateFollowUpTask } from "@/integrations/supabase/api/tasks.api";

/**
 * Hook for task follow-up operations
 * 
 * @returns Function to create follow-up tasks
 */
export function useTaskFollowUp() {
  const queryClient = useQueryClient();

  /**
   * Create a follow-up task for a parent task
   * 
   * @param parentTask - The parent task
   * @param newTaskData - Data for the new follow-up task
   */
  const createFollowUpTask = async (parentTask: Task, newTaskData: any) => {
    try {
      const { error } = await apiCreateFollowUpTask(parentTask.id, newTaskData);

      if (error) throw error;
      
      toast.success("Follow-up task created successfully");
      // Selectively invalidate task queries
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
    createFollowUpTask
  };
}

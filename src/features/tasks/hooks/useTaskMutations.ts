
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";
import { toast } from "@/lib/toast";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import { 
  updateTaskStatus, 
  toggleTaskPin as apiToggleTaskPin,
  createFollowUpTask as apiCreateFollowUpTask 
} from "@/integrations/supabase/api/tasks.api";

/**
 * Consolidated hook for all task mutation operations
 * 
 * Single source of truth for task mutations with consistent error handling,
 * optimistic updates, and user feedback.
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();

  /**
   * Optimistically update a task in the cache
   */
  const updateTaskOptimistically = useCallback((
    taskId: string,
    updates: Record<string, any>,
    fallbackData?: any
  ) => {
    queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
      if (!oldData) return fallbackData || oldData;
      
      if (oldData.pages) {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((t: any) => 
              t.id === taskId ? {...t, ...updates} : t
            )
          }))
        };
      }
      
      const newData = oldData.data 
        ? {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((t: any) => 
                t.id === taskId ? {...t, ...updates} : t
              )
            }
          }
        : oldData;
          
      return newData;
    });
  }, [queryClient]);

  /**
   * Toggle task completion status
   */
  const toggleTaskComplete = useCallback(async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    const previousData = queryClient.getQueryData(["tasks", undefined, undefined]);
    
    try {
      updateTaskOptimistically(task.id, { status: newStatus });
      
      const { error } = await updateTaskStatus(task.id, newStatus);
      if (error) throw error;
      
      triggerHapticFeedback();
      toast.success(`Task marked ${newStatus}`);
      
      if (newStatus === "complete") {
        showBrowserNotification("Task completed", `"${task.title}" marked as complete`);
      }
    } catch (error) {
      updateTaskOptimistically(task.id, { status: task.status }, previousData);
      
      if (error instanceof Error) {
        toast.error(`Failed to update task: ${error.message}`);
      } else {
        toast.error("Failed to update task");
      }
    }
  }, [updateTaskOptimistically, queryClient]);

  /**
   * Toggle task pin status
   */
  const toggleTaskPin = useCallback(async (task: Task) => {
    const newPinnedState = !task.pinned;
    const previousData = queryClient.getQueryData(["tasks", undefined, undefined]);
    
    try {
      updateTaskOptimistically(task.id, { pinned: newPinnedState });
      
      const { error } = await apiToggleTaskPin(task.id, newPinnedState);
      if (error) throw error;
      
      triggerHapticFeedback();
      toast.success(`Task ${newPinnedState ? "pinned" : "unpinned"}`);
    } catch (error) {
      updateTaskOptimistically(task.id, { pinned: task.pinned }, previousData);
      
      if (error instanceof Error) {
        toast.error(`Failed to ${newPinnedState ? 'pin' : 'unpin'} task: ${error.message}`);
      } else {
        toast.error(`Failed to ${newPinnedState ? 'pin' : 'unpin'} task`);
      }
    }
  }, [updateTaskOptimistically, queryClient]);

  /**
   * Create a follow-up task
   */
  const createFollowUpTask = useCallback(async (parentTask: Task, taskData: any) => {
    try {
      const { error } = await apiCreateFollowUpTask(parentTask.id, taskData);
      if (error) throw error;
      
      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");
      
      if (taskData.assignee_id) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${taskData.title}" has been assigned`
        );
      }
      
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create follow-up task: ${error.message}`);
      } else {
        toast.error("Failed to create follow-up task");
      }
    }
  }, [queryClient]);

  return {
    toggleTaskComplete,
    toggleTaskPin,
    createFollowUpTask
  };
}

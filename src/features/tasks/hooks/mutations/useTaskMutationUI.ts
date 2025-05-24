
import { useCallback } from "react";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";

/**
 * Hook for task mutation UI feedback
 * 
 * Provides consistent UI feedback patterns including haptic feedback,
 * notifications, and error handling for task mutations.
 * 
 * @returns Object containing UI feedback functions
 */
export function useTaskMutationUI() {
  /**
   * Provide UI feedback for pin operations
   * 
   * @param task - The task that was pinned/unpinned
   * @param success - Whether the operation was successful
   * @param error - Error object if the operation failed
   */
  const handlePinFeedback = useCallback((task: Task, success: boolean, error?: Error) => {
    if (success) {
      triggerHapticFeedback();
    } else if (error) {
      toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task: ${error.message}`);
    } else {
      toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task`);
    }
  }, []);

  /**
   * Provide UI feedback for completion operations
   * 
   * @param task - The task that was completed/marked incomplete
   * @param success - Whether the operation was successful
   * @param error - Error object if the operation failed
   */
  const handleCompleteFeedback = useCallback((task: Task, success: boolean, error?: Error) => {
    if (success) {
      triggerHapticFeedback();
      
      if (!task.status.includes("complete")) {
        showBrowserNotification("Task completed", `"${task.title}" marked as complete`);
      }
    } else if (error) {
      toast.error(`Failed to update task status: ${error.message}`);
    } else {
      toast.error("Failed to update task status");
    }
  }, []);

  /**
   * Provide UI feedback for follow-up task creation
   * 
   * @param taskData - The data for the new follow-up task
   * @param success - Whether the operation was successful
   * @param error - Error object if the operation failed
   */
  const handleFollowUpFeedback = useCallback((taskData: any, success: boolean, error?: Error) => {
    if (success) {
      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");
      
      if (taskData.assignee_id) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${taskData.title}" has been assigned`
        );
      }
    } else if (error) {
      toast.error(`Failed to create follow-up task: ${error.message}`);
    } else {
      toast.error("Failed to create follow-up task");
    }
  }, []);

  return {
    handlePinFeedback,
    handleCompleteFeedback,
    handleFollowUpFeedback
  };
}

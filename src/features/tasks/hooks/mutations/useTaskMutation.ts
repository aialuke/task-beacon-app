
import { useCallback } from "react";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { useTaskPinning } from "../useTaskPinning";
import { useTaskCompletion } from "../useTaskCompletion";
import { useTaskFollowUp } from "../useTaskFollowUp";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";

/**
 * Consolidated hook for task mutation operations
 * 
 * Provides a unified interface for various task mutations with consistent
 * error handling, notifications, and feedback patterns
 * 
 * @returns Object containing all task mutation functions with standardized handling
 */
export function useTaskMutation() {
  const { toggleTaskPin: pin } = useTaskPinning();
  const { toggleTaskComplete: complete } = useTaskCompletion();
  const { createFollowUpTask: followUp } = useTaskFollowUp();

  /**
   * Toggle a task's pinned status with feedback
   * 
   * @param task - The task to toggle pin status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskPin = useCallback(async (task: Task) => {
    try {
      await pin(task);
      triggerHapticFeedback();
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task: ${error.message}`);
      } else {
        toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task`);
      }
      return { success: false, error };
    }
  }, [pin]);

  /**
   * Toggle a task's completion status with feedback
   * 
   * @param task - The task to toggle completion status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskComplete = useCallback(async (task: Task) => {
    try {
      await complete(task);
      triggerHapticFeedback();
      
      if (!task.status.includes("complete")) {
        showBrowserNotification("Task completed", `"${task.title}" marked as complete`);
      }
      
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update task status: ${error.message}`);
      } else {
        toast.error("Failed to update task status");
      }
      return { success: false, error };
    }
  }, [complete]);

  /**
   * Create a follow-up task with feedback
   * 
   * @param parentTask - The parent task to create a follow-up for
   * @param taskData - The data for the new follow-up task
   * @returns A promise that resolves when the operation completes
   */
  const createFollowUpTask = useCallback(async (parentTask: Task, taskData: any) => {
    try {
      const result = await followUp(parentTask, taskData);
      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");
      
      if (taskData.assignee_id) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${taskData.title}" has been assigned`
        );
      }
      
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create follow-up task: ${error.message}`);
      } else {
        toast.error("Failed to create follow-up task");
      }
      return { success: false, error };
    }
  }, [followUp]);

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}

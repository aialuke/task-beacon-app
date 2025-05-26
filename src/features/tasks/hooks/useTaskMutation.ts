
import { useCallback } from "react";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { useTaskPinning } from "./useTaskPinning";
import { useTaskCompletion } from "./useTaskCompletion";
import { useTaskFollowUp } from "./useTaskFollowUp";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";

/**
 * Consolidated hook for all task mutation operations
 * 
 * Provides a unified interface for various task mutations with consistent
 * error handling, notifications, and feedback patterns.
 * 
 * This is the main entry point for task mutations in the application.
 * 
 * @returns Object containing all task mutation functions with standardized handling
 */
export function useTaskMutation() {
  const { toggleTaskPin: pinTask } = useTaskPinning();
  const { toggleTaskComplete: completeTask } = useTaskCompletion();
  const { createFollowUpTask: createFollowUp } = useTaskFollowUp();

  /**
   * Toggle a task's pinned status with feedback
   * 
   * @param task - The task to toggle pin status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskPin = useCallback(async (task: Task): Promise<void> => {
    try {
      await pinTask(task);
      triggerHapticFeedback();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task: ${error.message}`);
      } else {
        toast.error(`Failed to ${task.pinned ? 'unpin' : 'pin'} task`);
      }
    }
  }, [pinTask]);

  /**
   * Toggle a task's completion status with feedback
   * 
   * @param task - The task to toggle completion status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskComplete = useCallback(async (task: Task): Promise<void> => {
    try {
      await completeTask(task);
      triggerHapticFeedback();
      
      if (!task.status.includes("complete")) {
        showBrowserNotification("Task completed", `"${task.title}" marked as complete`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update task status: ${error.message}`);
      } else {
        toast.error("Failed to update task status");
      }
    }
  }, [completeTask]);

  /**
   * Create a follow-up task with feedback
   * 
   * @param parentTask - The parent task to create a follow-up for
   * @param taskData - The data for the new follow-up task
   * @returns A promise that resolves when the operation completes
   */
  const createFollowUpTask = useCallback(async (parentTask: Task, taskData: any): Promise<void> => {
    try {
      const result = await createFollowUp(parentTask, taskData);
      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");
      
      if (taskData.assignee_id) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${taskData.title}" has been assigned`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create follow-up task: ${error.message}`);
      } else {
        toast.error("Failed to create follow-up task");
      }
    }
  }, [createFollowUp]);

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}

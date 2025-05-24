
import { useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskMutationCore } from "./useTaskMutationCore";
import { useTaskMutationUI } from "./useTaskMutationUI";

/**
 * Composed hook for task mutation operations
 * 
 * Combines core data operations with UI feedback to provide a complete
 * task mutation interface with consistent error handling and user feedback.
 * 
 * @returns Object containing all task mutation functions with UI feedback
 */
export function useTaskMutation() {
  const core = useTaskMutationCore();
  const ui = useTaskMutationUI();

  /**
   * Toggle a task's pinned status with full UI feedback
   * 
   * @param task - The task to toggle pin status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskPin = useCallback(async (task: Task): Promise<void> => {
    try {
      await core.toggleTaskPin(task);
      ui.handlePinFeedback(task, true);
    } catch (error) {
      ui.handlePinFeedback(task, false, error instanceof Error ? error : undefined);
    }
  }, [core, ui]);

  /**
   * Toggle a task's completion status with full UI feedback
   * 
   * @param task - The task to toggle completion status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskComplete = useCallback(async (task: Task): Promise<void> => {
    try {
      await core.toggleTaskComplete(task);
      ui.handleCompleteFeedback(task, true);
    } catch (error) {
      ui.handleCompleteFeedback(task, false, error instanceof Error ? error : undefined);
    }
  }, [core, ui]);

  /**
   * Create a follow-up task with full UI feedback
   * 
   * @param parentTask - The parent task to create a follow-up for
   * @param taskData - The data for the new follow-up task
   * @returns A promise that resolves when the operation completes
   */
  const createFollowUpTask = useCallback(async (parentTask: Task, taskData: any): Promise<void> => {
    try {
      await core.createFollowUpTask(parentTask, taskData);
      ui.handleFollowUpFeedback(taskData, true);
    } catch (error) {
      ui.handleFollowUpFeedback(taskData, false, error instanceof Error ? error : undefined);
    }
  }, [core, ui]);

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}


import { useCallback } from "react";
import { Task } from "@/lib/types";
import { useTaskPinning } from "../useTaskPinning";
import { useTaskCompletion } from "../useTaskCompletion";
import { useTaskFollowUp } from "../useTaskFollowUp";

/**
 * Core hook for task mutation data operations
 * 
 * Provides pure data operations without UI feedback or notifications.
 * This hook focuses solely on the business logic of task mutations.
 * 
 * @returns Object containing core task mutation functions
 */
export function useTaskMutationCore() {
  const { toggleTaskPin: pinTask } = useTaskPinning();
  const { toggleTaskComplete: completeTask } = useTaskCompletion();
  const { createFollowUpTask: createFollowUp } = useTaskFollowUp();

  /**
   * Core function to toggle a task's pinned status
   * 
   * @param task - The task to toggle pin status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskPin = useCallback(async (task: Task): Promise<void> => {
    await pinTask(task);
  }, [pinTask]);

  /**
   * Core function to toggle a task's completion status
   * 
   * @param task - The task to toggle completion status for
   * @returns A promise that resolves when the operation completes
   */
  const toggleTaskComplete = useCallback(async (task: Task): Promise<void> => {
    await completeTask(task);
  }, [completeTask]);

  /**
   * Core function to create a follow-up task
   * 
   * @param parentTask - The parent task to create a follow-up for
   * @param taskData - The data for the new follow-up task
   * @returns A promise that resolves when the operation completes
   */
  const createFollowUpTask = useCallback(async (parentTask: Task, taskData: any): Promise<void> => {
    await createFollowUp(parentTask, taskData);
  }, [createFollowUp]);

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}


import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { updateTaskStatus } from "@/integrations/supabase/api/tasks.api";
import { useOptimisticTaskUpdate } from "./useOptimisticTaskUpdate";

/**
 * Hook for task completion operations with UI state management
 * 
 * Provides optimistic updates with targeted error recovery and loading states
 * 
 * @returns Functions and state for task completion operations
 */
export function useTaskCompletion() {
  const queryClient = useQueryClient();
  const { updateTaskOptimistically } = useOptimisticTaskUpdate();

  /**
   * Toggle the completion state of a task with optimistic updates
   * 
   * @param task - The task to toggle completion state for
   */
  const toggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    const previousTasks = queryClient.getQueryData<any>(
      ["tasks", undefined, undefined]
    );
    
    try {
      // Optimistic update
      updateTaskOptimistically(task.id, { status: newStatus });

      const { error } = await updateTaskStatus(task.id, newStatus);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Targeted rollback only for this specific task
      updateTaskOptimistically(task.id, { status: task.status }, previousTasks);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return {
    toggleTaskComplete
  };
}

/**
 * Hook for task completion toggle with loading state management
 * 
 * @param task - The task to toggle completion for
 * @param toggleTaskComplete - Function to toggle task completion state
 * @returns Object containing loading state and toggle handler
 */
export function useTaskCompletionWithLoading(task: Task, toggleTaskComplete: (task: Task) => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    try {
      await toggleTaskComplete(task);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    } finally {
      setLoading(false);
    }
  }, [task, toggleTaskComplete]);

  return { loading, handleToggleComplete };
}

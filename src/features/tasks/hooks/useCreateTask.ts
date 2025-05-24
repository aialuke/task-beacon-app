
import { useCallback } from "react";
import { toast } from "@/lib/toast";
import { useBaseTaskFormComposed } from "./useBaseTaskFormComposed";
import { createTask } from "@/integrations/supabase/api/tasks.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Custom hook for task creation functionality
 * 
 * Builds on useBaseTaskFormComposed to provide specialized functionality for creating new tasks
 * 
 * @param props - Configuration options
 * @returns Form state and submission handler
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const formState = useBaseTaskFormComposed({ onClose });

  /**
   * Handles form submission for creating a new task
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the entire form
    if (!formState.validateEntireForm()) {
      return;
    }
    
    formState.setLoading(true);
    
    try {
      // Upload photo if selected
      const photoUrl = await formState.uploadPhoto();

      const { error } = await createTask({
        title: formState.title,
        description: formState.description || null,
        due_date: formState.dueDate ? new Date(formState.dueDate).toISOString() : null,
        photo_url: photoUrl,
        url_link: formState.url || null,
        assignee_id: formState.assigneeId || null,
        pinned: formState.pinned,
      });

      if (error) throw error;
      
      toast.success("Task created successfully");
      formState.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      formState.setLoading(false);
    }
  }, [formState]);

  return {
    ...formState,
    handleSubmit
  };
}

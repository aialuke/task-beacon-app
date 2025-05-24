
import { useState, useCallback } from "react";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import { useBaseTaskFormComposed } from "./useBaseTaskFormComposed";
import { createFollowUpTask } from "@/integrations/supabase/api/tasks.api";

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Custom hook for follow-up task creation functionality
 * 
 * Builds on useBaseTaskFormComposed to provide specialized functionality for creating follow-up tasks
 * 
 * @param props - Configuration options
 * @returns Form state and handlers for creating a follow-up task
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const formState = useBaseTaskFormComposed({
    initialUrl: parentTask.url_link || "",
    onClose
  });

  const [assigneeId, setAssigneeId] = useState<string>("");

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

      const { error } = await createFollowUpTask(parentTask.id, {
        title: formState.title,
        description: formState.description || null,
        due_date: formState.dueDate ? new Date(formState.dueDate).toISOString() : null,
        photo_url: photoUrl,
        url_link: formState.url || null,
        assignee_id: assigneeId || null,
        pinned: formState.pinned,
      });

      if (error) throw error;

      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");

      if (assigneeId) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${formState.title}" has been assigned`
        );
      }

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
  }, [
    formState,
    assigneeId,
    parentTask.id
  ]);

  return {
    ...formState,
    assigneeId,
    setAssigneeId,
    handleSubmit
  };
}

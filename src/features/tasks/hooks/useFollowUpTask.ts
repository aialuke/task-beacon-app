import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import { useTaskForm } from "./useTaskForm";
import { useTaskFormValidation } from "./useTaskFormValidation";
import { createFollowUpTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";
import { Task } from "@/types/shared.types";

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Hook for creating follow-up tasks with standardized validation
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const { validateTitle } = useTaskFormValidation();
  
  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate("/"))
  });

  const [assigneeId, setAssigneeId] = useState<string>("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTitle(taskForm.title)) return;
    
    taskForm.setLoading(true);

    try {
      let photoUrl = null;
      if (taskForm.photo) {
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(taskForm.photo);
        if (uploadError) throw uploadError;
        photoUrl = uploadedUrl;
      }

      const { error } = await createFollowUpTask(parentTask.id, {
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null,
        photo_url: photoUrl,
        url_link: taskForm.url || null,
        assignee_id: assigneeId || null,
        pinned: taskForm.pinned,
      });

      if (error) throw error;

      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");

      if (assigneeId) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${taskForm.title}" has been assigned`
        );
      }

      taskForm.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      taskForm.setLoading(false);
    }
  }, [
    taskForm,
    assigneeId,
    parentTask.id,
    validateTitle,
  ]);

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
  };
}

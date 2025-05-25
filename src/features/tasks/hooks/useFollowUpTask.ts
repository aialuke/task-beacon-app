
import { useState, useCallback } from "react";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import { useBaseTaskForm } from "./useBaseTaskForm";
import { createFollowUpTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Custom hook for follow-up task creation functionality
 * 
 * Provides specialized functionality for creating follow-up tasks from a parent task, including:
 * - Form state management
 * - Task submission handling
 * - Photo upload logic
 * - Notifications and feedback when tasks are created
 * 
 * @param props - Configuration options
 * @param props.parentTask - The parent task to create a follow-up for
 * @param props.onClose - Optional callback to execute when the form is closed
 * @returns Form state and handlers for creating a follow-up task
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    photo,
    photoPreview,
    pinned,
    setPinned,
    loading,
    setLoading,
    handlePhotoChange,
    resetForm,
    validateTitle
  } = useBaseTaskForm({
    initialUrl: parentTask.url_link || "",
    onClose: onClose || (() => navigate("/"))
  });

  const [assigneeId, setAssigneeId] = useState<string>("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title length
    if (!validateTitle(title)) return;
    
    setLoading(true);

    try {
      let photoUrl = null;
      if (photo) {
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(photo);
        if (uploadError) throw uploadError;
        photoUrl = uploadedUrl;
      }

      const { error } = await createFollowUpTask(parentTask.id, {
        title,
        description: description || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        photo_url: photoUrl,
        url_link: url || null,
        assignee_id: assigneeId || null,
        pinned,
      });

      if (error) throw error;

      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");

      if (assigneeId) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${title}" has been assigned`
        );
      }

      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [
    photo,
    title,
    description,
    dueDate,
    url,
    pinned,
    assigneeId,
    parentTask.id,
    resetForm,
    setLoading,
    validateTitle
  ]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    photo,
    photoPreview,
    pinned,
    setPinned,
    assigneeId,
    setAssigneeId,
    loading,
    handlePhotoChange,
    handleSubmit
  };
}


import { useState, useCallback } from "react";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import { useBaseTaskForm } from "./useBaseTaskForm";

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
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
    uploadPhoto,
    resetForm,
    validateTitle
  } = useBaseTaskForm({
    initialUrl: parentTask.url_link || "",
    onClose
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
        photoUrl = await uploadPhoto();
      }

      if (isMockingSupabase) {
        toast.success("Follow-up task created successfully (mock data)");
        triggerHapticFeedback();
        if (assigneeId) {
          showBrowserNotification(
            "Task Assigned",
            `Follow-up task "${title}" has been assigned`
          );
        }
        resetForm();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description: description || null,
          due_date: new Date(dueDate).toISOString(),
          photo_url: photoUrl,
          url_link: url || null,
          owner_id: user.id,
          parent_task_id: parentTask.id,
          pinned,
          assignee_id: assigneeId || null,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

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
    uploadPhoto,
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

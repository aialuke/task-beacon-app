
import { useCallback } from "react";
import { toast } from "@/lib/toast";
import { useBaseTaskForm } from "./useBaseTaskForm";
import { createTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
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
    assigneeId,
    setAssigneeId,
    loading,
    setLoading,
    handlePhotoChange,
    resetForm,
    validateTitle
  } = useBaseTaskForm({ onClose });

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

      const { error } = await createTask({
        title,
        description: description || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        photo_url: photoUrl,
        url_link: url || null,
        assignee_id: assigneeId || null,
        pinned,
      });

      if (error) throw error;
      
      toast.success("Task created successfully");
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
    title,
    description,
    dueDate,
    url,
    photo,
    pinned,
    assigneeId,
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

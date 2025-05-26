
import { useCallback } from "react";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { useBaseTaskForm } from "./useBaseTaskForm";
import { createTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";
import { getCurrentUserId } from "@/integrations/supabase/api/base.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Custom hook for task creation functionality
 * 
 * Builds on useBaseTaskForm to provide specialized functionality for creating new tasks, including:
 * - Form submission handling
 * - Task creation API integration
 * - Photo upload handling
 * - Success/error notifications
 * 
 * @param props - Configuration options
 * @param props.onClose - Optional callback to execute when the form is closed
 * @returns Form state and submission handler
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
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
    assigneeId,
    setAssigneeId,
    loading,
    setLoading,
    handlePhotoChange,
    resetForm,
    validateTitle
  } = useBaseTaskForm({ 
    onClose: onClose || (() => navigate("/"))
  });

  /**
   * Handles form submission for creating a new task
   * 
   * @param e - Form submit event
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title length
    if (!validateTitle(title)) return;
    
    // Validate required fields
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }
    
    setLoading(true);
    try {
      let photoUrl = null;
      if (photo) {
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(photo);
        
        if (uploadError) throw uploadError;
        photoUrl = uploadedUrl;
      }

      // If no assignee is selected, assign to current user
      const currentUserId = await getCurrentUserId();
      const finalAssigneeId = assigneeId || currentUserId;

      const { error } = await createTask({
        title,
        description: description || null,
        due_date: new Date(dueDate).toISOString(),
        photo_url: photoUrl,
        url_link: url || null,
        assignee_id: finalAssigneeId,
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

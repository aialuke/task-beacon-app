
import { useState, useCallback } from "react";
import { useFormState } from "@/components/form/hooks/useFormState";
import { usePhotoUpload } from "@/components/form/hooks/usePhotoUpload";
import { UseFormStateOptions } from "@/types/form.types";

export interface UseTaskFormOptions extends UseFormStateOptions {
  onClose?: () => void;
}

/**
 * Task-specific form functionality
 * 
 * Combines form state, photo upload, and task validation
 * to provide a complete task form solution.
 */
export function useTaskForm({ initialUrl = "", onClose }: UseTaskFormOptions = {}) {
  const [loading, setLoading] = useState(false);
  
  const formState = useFormState({ initialUrl });
  const photoUpload = usePhotoUpload();

  /**
   * Validates the task title
   */
  const validateTitle = useCallback((value: string): boolean => {
    if (!value || value.trim().length === 0) {
      return false;
    }
    if (value.length > 22) {
      return false;
    }
    return true;
  }, []);

  /**
   * Custom title setter with validation and character limit
   */
  const setTitle = useCallback((value: string) => {
    // Limit to 22 characters silently
    if (value.length <= 22) {
      formState.setTitle(value);
    }
  }, [formState]);

  /**
   * Resets all form fields and photo
   */
  const resetForm = useCallback(() => {
    formState.resetFormState();
    photoUpload.resetPhoto();
    if (onClose) onClose();
  }, [formState, photoUpload, onClose]);

  return {
    // Form state
    title: formState.title,
    setTitle,
    description: formState.description,
    setDescription: formState.setDescription,
    dueDate: formState.dueDate,
    setDueDate: formState.setDueDate,
    url: formState.url,
    setUrl: formState.setUrl,
    pinned: formState.pinned,
    setPinned: formState.setPinned,
    assigneeId: formState.assigneeId,
    setAssigneeId: formState.setAssigneeId,
    
    // Photo upload
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,
    
    // Loading state
    loading: loading || photoUpload.loading,
    setLoading,
    
    // Form actions
    resetForm,
    validateTitle,
  };
}


import { useState, useCallback } from "react";
import { useFormState, UseFormStateOptions } from "./useFormState";
import { usePhotoUpload } from "./usePhotoUpload";
import { useFormValidation } from "./useFormValidation";

export interface UseTaskFormOptions extends UseFormStateOptions {
  onClose?: () => void;
}

/**
 * Composed hook for task form functionality
 * 
 * Combines form state, photo upload, and validation hooks
 * to provide a complete task form solution.
 */
export function useTaskForm({ initialUrl = "", onClose }: UseTaskFormOptions = {}) {
  const [loading, setLoading] = useState(false);
  
  const formState = useFormState({ initialUrl });
  const photoUpload = usePhotoUpload();
  const validation = useFormValidation();

  // Override the title setter with validation
  const setTitle = validation.createTitleHandler(formState.setTitle);

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
    validateTitle: validation.validateTitle,
  };
}

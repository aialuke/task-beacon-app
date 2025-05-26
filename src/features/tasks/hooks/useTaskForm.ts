
import { useCallback } from "react";
import { usePhotoUpload } from "@/components/form/hooks/usePhotoUpload";
import { useTaskFormValidation } from "./useTaskFormValidation";
import { useTaskFormState, UseTaskFormStateOptions } from "./useTaskFormState";

/**
 * Simplified task form hook with standardized validation
 */
export function useTaskForm(options: UseTaskFormStateOptions = {}) {
  const formState = useTaskFormState(options);
  const photoUpload = usePhotoUpload();
  const { validateTitle, createTitleSetter } = useTaskFormValidation();

  const setTitle = createTitleSetter(formState.setTitle);

  const resetForm = useCallback(() => {
    formState.resetFormState();
    photoUpload.resetPhoto();
  }, [formState, photoUpload]);

  return {
    // Form state
    ...formState,
    setTitle, // Override with validation
    
    // Photo upload
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,
    
    // Loading state (combined)
    loading: formState.loading || photoUpload.loading,
    
    // Form actions
    resetForm,
    validateTitle,
  };
}

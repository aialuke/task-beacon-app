import { useCallback } from 'react';
import { useTaskFormState, UseTaskFormStateOptions } from './useTaskFormState';
import { useTaskPhotoUpload } from './useTaskPhotoUpload';
import { useTaskValidation } from './useTaskValidation';

/**
 * Coordinated task form hook
 *
 * Orchestrates form state, photo upload, and validation
 * while keeping individual concerns separated
 */
export function useTaskForm(options: UseTaskFormStateOptions = {}) {
  const formState = useTaskFormState(options);
  const photoUpload = useTaskPhotoUpload();
  const validation = useTaskValidation();

  // Create title setter with validation
  const setTitle = validation.createTitleSetter(formState.setTitle);

  const resetForm = useCallback(() => {
    formState.resetFormState();
    photoUpload.resetPhoto();
  }, [formState, photoUpload]);

  // Combined loading state
  const loading = formState.loading || photoUpload.photoLoading;

  return {
    // Form state
    ...formState,
    setTitle, // Override with validation

    // Photo upload
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,

    // Validation
    validateTitle: validation.validateTitle,
    validateTaskForm: validation.validateTaskForm,

    // Combined state
    loading,

    // Form actions
    resetForm,
  };
}

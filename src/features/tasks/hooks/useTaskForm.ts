import { useCallback } from 'react';
import { useTaskFormState, UseTaskFormStateOptions } from './useTaskFormState';
import { useEnhancedTaskPhotoUpload } from '@/components/form/hooks/usePhotoUpload';
import { useTaskValidation } from './useTaskValidation';

/**
 * Coordinated task form hook
 *
 * Orchestrates form state, photo upload, and validation
 * while keeping individual concerns separated
 * 
 * Now uses enhanced photo upload with WebP support and modal integration
 */
export function useTaskForm(options: UseTaskFormStateOptions = {}) {
  const formState = useTaskFormState(options);
  const photoUpload = useEnhancedTaskPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto',
    },
    autoProcess: true,
  });
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

    // Photo upload - maintaining backward compatibility
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,

    // Enhanced photo upload - modal functionality
    isPhotoModalOpen: photoUpload.isPhotoModalOpen,
    openPhotoModal: photoUpload.openPhotoModal,
    closePhotoModal: photoUpload.closePhotoModal,
    handleModalPhotoSelect: photoUpload.handleModalPhotoSelect,
    handlePhotoRemove: photoUpload.handlePhotoRemove,

    // Enhanced features
    processingResult: photoUpload.processingResult,

    // Validation
    validateTitle: validation.validateTitle,
    validateTaskForm: validation.validateTaskForm,

    // Combined state
    loading,

    // Form actions
    resetForm,
  };
}

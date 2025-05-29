import { useCallback } from 'react';
import { usePhotoUpload } from '@/components/form/hooks/usePhotoUpload';

/**
 * Task-specific photo upload hook
 *
 * Wraps the generic photo upload hook with task-specific behavior
 */
export function useTaskPhotoUpload() {
  const photoUpload = usePhotoUpload();

  const resetPhoto = useCallback(() => {
    photoUpload.resetPhoto();
  }, [photoUpload]);

  return {
    // Photo state
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,

    // Photo actions
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,
    resetPhoto,

    // Loading state
    photoLoading: photoUpload.loading,
  };
}

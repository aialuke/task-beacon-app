
import { useMemo, useCallback } from 'react';
import { usePhotoState } from './usePhotoState';
import { usePhotoProcessing } from './usePhotoProcessing';
import { TaskService } from '@/lib/api/tasks/task.service';
import type { EnhancedImageProcessingOptions } from '@/lib/utils/image/types';

/**
 * Task-specific photo upload hook - Phase 2.4 Simplified
 * 
 * Using standard React hooks instead of performance abstractions
 */
export function useTaskPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
}) {
  // Use standard useMemo for processing options
  const processingOptions = useMemo(
    () => ({
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
      ...options?.processingOptions,
    }),
    [options?.processingOptions]
  );

  // Use focused state and processing hooks
  const photoState = usePhotoState();
  const photoProcessing = usePhotoProcessing(processingOptions, photoState);

  // Upload functionality using standard useCallback
  const uploadPhoto = useCallback(
    async (): Promise<string | null> => {
      if (!photoState.photo) {
        return null;
      }

      try {
        const response = await TaskService.media.uploadPhoto(photoState.photo);
        if (!response.success) {
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        
        return response.data || null;
      } catch (error) {
        console.error('Photo upload error:', error);
        return null;
      }
    },
    [photoState.photo]
  );

  // Handle photo upload wrapper for backward compatibility using standard useCallback
  const handlePhotoUpload = useCallback(
    async (): Promise<string | null> => {
      return await uploadPhoto();
    },
    [uploadPhoto]
  );

  // Use standard useMemo for return object
  return useMemo(
    () => ({
      // Core photo interface
      photo: photoState.photo,
      photoPreview: photoState.photoPreview,
      photoLoading: photoState.loading,
      processingResult: photoState.processingResult,
      
      // Actions
      handlePhotoChange: photoProcessing.handlePhotoChange,
      uploadPhoto,
      handlePhotoUpload, // Added for backward compatibility
      resetPhoto: photoState.resetPhoto,
      handlePhotoRemove: photoState.resetPhoto,

      // Configuration
      processingOptions,
    }),
    [
      photoState.photo,
      photoState.photoPreview,
      photoState.loading,
      photoState.processingResult,
      photoState.resetPhoto,
      photoProcessing.handlePhotoChange,
      uploadPhoto,
      handlePhotoUpload,
      processingOptions,
    ]
  );
}

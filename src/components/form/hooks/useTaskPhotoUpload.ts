
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/performance';
import { usePhotoState } from './usePhotoState';
import { usePhotoProcessing } from './usePhotoProcessing';
import { TaskService } from '@/lib/api/tasks/task.service';
import type { EnhancedImageProcessingOptions } from '@/lib/utils/image/types';

/**
 * Task-specific photo upload hook - Phase 2.3 Hook Standardization
 * 
 * Standardized hook following consistent patterns for task photo uploads
 */
export function useTaskPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
}) {
  // Memoize processing options
  const processingOptions = useOptimizedMemo(
    () => ({
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
      ...options?.processingOptions,
    }),
    [options?.processingOptions],
    { name: 'processing-options' }
  );

  // Use focused state and processing hooks
  const photoState = usePhotoState();
  const photoProcessing = usePhotoProcessing(processingOptions, photoState);

  // Upload functionality
  const uploadPhoto = useOptimizedCallback(
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
    [photoState.photo],
    { name: 'uploadPhoto' }
  );

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      // Core photo interface
      photo: photoState.photo,
      photoPreview: photoState.photoPreview,
      photoLoading: photoState.loading,
      processingResult: photoState.processingResult,
      
      // Actions
      handlePhotoChange: photoProcessing.handlePhotoChange,
      uploadPhoto,
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
      processingOptions,
    ],
    { name: 'task-photo-upload' }
  );
}

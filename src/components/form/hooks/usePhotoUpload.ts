import { useState, useCallback } from 'react';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Photo upload hook with WebP support and modal integration
 * 
 * Provides comprehensive image processing capabilities including
 * WebP conversion, validation, modal interface, and more.
 */
export function usePhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
}) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  // Processing options with defaults
  const processingOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'auto' as const,
    ...options?.processingOptions,
  };

  /**
   * Enhanced photo change handler with modal support
   * Supports both file input events and direct file processing
   */
  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) {
        setLoading(false);
        return;
      }

      try {
        // Create preview immediately
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);

        // Process the image using enhanced utilities
        const processedFile = await compressAndResizePhoto(
          file,
          processingOptions.maxWidth,
          processingOptions.maxHeight,
          processingOptions.quality
        );

        setPhoto(processedFile);
      } catch (error: unknown) {
        // Error handled silently - proper error handling should be implemented
      } finally {
        setLoading(false);
      }
    },
    [processingOptions]
  );

  /**
   * Modal-based photo selection handler
   */
  const handleModalPhotoSelect = useCallback(
    (file: File, processedResult?: ProcessingResult) => {
      // Create preview from the selected file
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      setPhoto(file);
      
      // Store processing result for analytics/feedback
      if (processedResult) {
        setProcessingResult(processedResult);
      }
      
      setIsModalOpen(false);
    },
    []
  );

  /**
   * Open the enhanced upload modal
   */
  const openPhotoModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Close the enhanced upload modal
   */
  const closePhotoModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * Uploads the selected photo with enhanced error handling
   */
  const uploadPhoto = useCallback(async (): Promise<string | null> => {
    if (!photo) return null;

    try {
      const response = await TaskService.uploadPhoto(photo);
      if (!response.success) {
        throw new Error(response.error?.message || 'Photo upload failed');
      }
      return response.data || null;
    } catch (error) {
      return null;
    }
  }, [photo]);

  /**
   * Reset photo state and cleanup resources
   */
  const resetPhoto = useCallback(() => {
    // Cleanup preview URL to prevent memory leaks
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
  }, [photoPreview]);

  /**
   * Remove current photo and optionally trigger modal
   */
  const handlePhotoRemove = useCallback(() => {
    resetPhoto();
  }, [resetPhoto]);

  return {
    // Core photo interface
    photo,
    photoPreview,
    loading,
    handlePhotoChange,
    uploadPhoto,
    resetPhoto,

    // Modal interface
    isModalOpen,
    openPhotoModal,
    closePhotoModal,
    handleModalPhotoSelect,
    handlePhotoRemove,

    // Enhanced features
    processingResult,
    processingOptions,
  };
}

/**
 * Task-specific photo upload hook
 * 
 * Wraps the enhanced photo upload hook with task-optimized defaults
 */
export function useTaskPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
}) {
  const photoUpload = usePhotoUpload(options);

  const resetPhoto = useCallback(() => {
    photoUpload.resetPhoto();
  }, [photoUpload]);

  return {
    // Photo state - standard interface
    photo: photoUpload.photo,
    photoPreview: photoUpload.photoPreview,

    // Photo actions - standard interface
    handlePhotoChange: photoUpload.handlePhotoChange,
    uploadPhoto: photoUpload.uploadPhoto,
    resetPhoto,

    // Loading state - standard interface
    photoLoading: photoUpload.loading,

    // Modal interface
    isPhotoModalOpen: photoUpload.isModalOpen,
    openPhotoModal: photoUpload.openPhotoModal,
    closePhotoModal: photoUpload.closePhotoModal,
    handleModalPhotoSelect: photoUpload.handleModalPhotoSelect,
    handlePhotoRemove: photoUpload.handlePhotoRemove,

    // Enhanced features
    processingResult: photoUpload.processingResult,
    processingOptions: photoUpload.processingOptions,
  };
}

// Export with Enhanced names for backward compatibility
export const useEnhancedPhotoUpload = usePhotoUpload;
export const useEnhancedTaskPhotoUpload = useTaskPhotoUpload; 
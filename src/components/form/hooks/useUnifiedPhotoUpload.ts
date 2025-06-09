
import { useState, useCallback, useMemo } from 'react';
import { TaskService } from '@/lib/api/tasks';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';

interface UnifiedPhotoUploadOptions {
  processingOptions?: EnhancedImageProcessingOptions;
  autoUpload?: boolean;
}

/**
 * Unified Photo Upload Hook - Phase 3 Consolidation
 * 
 * Consolidates all photo upload logic into a single, reusable hook.
 * Eliminates duplication between usePhotoState, usePhotoProcessing, and useTaskPhotoUpload.
 */
export function useUnifiedPhotoUpload(options: UnifiedPhotoUploadOptions = {}) {
  const {
    processingOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
    autoUpload = false,
  } = options;

  // Consolidated state management
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Reset function
  const resetPhoto = useCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
    setUploadedUrl(null);
  }, [photoPreview]);

  // Photo processing and handling
  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);

        const processedFile = await compressAndResizePhoto(
          file,
          processingOptions.maxWidth,
          processingOptions.maxHeight,
          processingOptions.quality
        );

        setPhoto(processedFile);
        setProcessingResult({
          success: true,
          metadata: {
            name: processedFile.name,
            size: processedFile.size,
            type: processedFile.type,
          },
        });

        // Auto-upload if enabled
        if (autoUpload) {
          await uploadPhoto(processedFile);
        }
      } catch (error) {
        console.error('Photo processing error:', error);
        setProcessingResult({
          success: false,
          error: error instanceof Error ? error.message : 'Photo processing failed',
        });
      } finally {
        setLoading(false);
      }
    },
    [processingOptions, autoUpload]
  );

  // Upload functionality
  const uploadPhoto = useCallback(
    async (fileToUpload?: File): Promise<string | null> => {
      const targetFile = fileToUpload || photo;
      if (!targetFile) {
        return null;
      }

      try {
        setLoading(true);
        const response = await TaskService.media.uploadPhoto(targetFile);
        if (!response.success) {
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        
        const url = response.data || null;
        setUploadedUrl(url);
        return url;
      } catch (error) {
        console.error('Photo upload error:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [photo]
  );

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // State
      photo,
      photoPreview,
      loading,
      processingResult,
      uploadedUrl,
      
      // Actions
      handlePhotoChange,
      uploadPhoto,
      resetPhoto,
      handlePhotoRemove: resetPhoto,
      
      // Configuration
      processingOptions,
    }),
    [
      photo,
      photoPreview,
      loading,
      processingResult,
      uploadedUrl,
      handlePhotoChange,
      uploadPhoto,
      resetPhoto,
      processingOptions,
    ]
  );
}

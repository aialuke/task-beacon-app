import { useState, useCallback, useMemo } from 'react';

import { logger } from '@/lib/logger';
import { usePhotoUpload } from '@/shared/hooks/api';
import {
  compressAndResizePhoto,
  extractImageMetadataEnhanced,
  ProcessingResult,
  EnhancedImageProcessingOptions,
} from '@/shared/utils/image/';

interface UnifiedPhotoUploadOptions {
  processingOptions?: EnhancedImageProcessingOptions;
  autoUpload?: boolean;
}

interface UnifiedPhotoUploadReturn {
  // State
  photo: File | null;
  photoPreview: string | null;
  loading: boolean;
  processingResult: ProcessingResult | null;
  uploadedUrl: string | null;

  // Actions
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadPhoto: (fileToUpload?: File) => Promise<string | null>;
  resetPhoto: () => void;
  handlePhotoRemove: () => void;

  // Configuration
  processingOptions: EnhancedImageProcessingOptions;
}

/**
 * Unified Photo Upload Hook - Phase 3 Consolidation
 *
 * Consolidates all photo upload logic into a single, reusable hook.
 * Eliminates duplication between usePhotoState, usePhotoProcessing, and useTaskPhotoUpload.
 */
export function useUnifiedPhotoUpload(
  options: UnifiedPhotoUploadOptions = {}
): UnifiedPhotoUploadReturn {
  const {
    processingOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
    autoUpload = false,
  } = options;

  // Use the new photo upload hook
  const { uploadPhoto: uploadPhotoService, isUploading } = usePhotoUpload();

  // Consolidated state management
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingResult, setProcessingResult] =
    useState<ProcessingResult | null>(null);
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

  // Upload functionality
  const uploadPhoto = useCallback(
    async (fileToUpload?: File): Promise<string | null> => {
      const targetFile = fileToUpload || photo;
      if (!targetFile) {
        return null;
      }

      try {
        setLoading(true);
        const result = await uploadPhotoService(targetFile);
        if (!result.success) {
          throw new Error(result.error || 'Photo upload failed');
        }

        const url = result.url || null;
        setUploadedUrl(url);
        return url;
      } catch (error) {
        logger.error(
          'Photo upload error',
          error instanceof Error ? error : new Error(String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [photo, uploadPhotoService]
  );

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

        // Extract full metadata for the processed file
        const metadata = await extractImageMetadataEnhanced(processedFile);

        setPhoto(processedFile);
        setProcessingResult({
          blob: processedFile,
          metadata,
          compressionStats: {
            originalSize: file.size,
            compressedSize: processedFile.size,
            compressionRatio: processedFile.size / file.size,
            sizeSavedBytes: file.size - processedFile.size,
            sizeSavedPercent:
              ((file.size - processedFile.size) / file.size) * 100,
          },
          processingTime: 0, // Could be measured if needed
        });

        // Auto-upload if enabled
        if (autoUpload) {
          await uploadPhoto(processedFile);
        }
      } catch (error) {
        logger.error(
          'Photo processing error',
          error instanceof Error ? error : new Error(String(error))
        );
        setProcessingResult(null);
      } finally {
        setLoading(false);
      }
    },
    [processingOptions, autoUpload, uploadPhoto]
  );

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // State
      photo,
      photoPreview,
      loading: loading || isUploading,
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
      isUploading,
      processingResult,
      uploadedUrl,
      handlePhotoChange,
      uploadPhoto,
      resetPhoto,
      processingOptions,
    ]
  );
}

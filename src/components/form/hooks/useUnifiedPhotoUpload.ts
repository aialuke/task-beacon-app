import { useState, useCallback, useMemo } from 'react';

import { TaskService } from '@/lib/api/tasks';
import { logger } from '@/lib/logger';
import { 
  compressAndResizePhoto,
  extractImageMetadata,
  convertToWebPWithFallback,
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image';
import { withRetry } from '@/lib/utils/async';
import { validateFileUpload } from '@/lib/validation/validators';

interface UnifiedPhotoUploadOptions {
  processingOptions?: EnhancedImageProcessingOptions;
  autoUpload?: boolean;
  uploadRetries?: number;
  uploadRetryDelay?: number;
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
export function useUnifiedPhotoUpload(options: UnifiedPhotoUploadOptions = {}): UnifiedPhotoUploadReturn {
  const {
    processingOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
    autoUpload = false,
    uploadRetries = 3,
    uploadRetryDelay = 1000,
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

  // Upload functionality with retry logic
  const uploadPhoto = useCallback(
    async (fileToUpload?: File): Promise<string | null> => {
      const targetFile = fileToUpload || photo;
      if (!targetFile) {
        return null;
      }

      try {
        setLoading(true);
        
        // Use withRetry for network resilience
        const url = await withRetry(
          async () => {
            const response = await TaskService.media.uploadPhoto(targetFile);
            if (!response.success) {
              throw new Error(response.error?.message || 'Photo upload failed');
            }
            return response.data;
          },
          uploadRetries,
          uploadRetryDelay
        );
        
        setUploadedUrl(url || null);
        return url || null;
      } catch (error) {
        logger.error('Photo upload failed after retries', error instanceof Error ? error : new Error(String(error)), {
          retries: uploadRetries,
          file: targetFile.name,
          size: targetFile.size
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [photo, uploadRetries, uploadRetryDelay]
  );

  // Photo processing and handling with validation
  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file upload using standard validator
      const fileValidation = {
        file,
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      };
      
      const validationResult = validateFileUpload(fileValidation);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(', ');
        logger.error('File validation failed', new Error(errors), { file: file.name, size: file.size });
        return;
      }

      setLoading(true);
      try {
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);

        // First compress and resize
        const resizedFile = await compressAndResizePhoto(
          file,
          processingOptions.maxWidth,
          processingOptions.maxHeight,
          processingOptions.quality
        );
        
        // Then convert to WebP with fallback for optimal format
        const conversionResult = await convertToWebPWithFallback(resizedFile, processingOptions.quality);
        const processedFile = new File([conversionResult.blob], file.name, {
          type: conversionResult.blob.type,
          lastModified: Date.now(),
        });

        // Extract full metadata for the processed file
        const metadata = await extractImageMetadata(processedFile);

        setPhoto(processedFile);
        setProcessingResult({
          blob: processedFile,
          metadata,
          compressionStats: {
            originalSize: file.size,
            compressedSize: processedFile.size,
            compressionRatio: processedFile.size / file.size,
            sizeSavedBytes: file.size - processedFile.size,
            sizeSavedPercent: ((file.size - processedFile.size) / file.size) * 100,
          },
          processingTime: 0, // Could be measured if needed
        });

        // Auto-upload if enabled
        if (autoUpload) {
          await uploadPhoto(processedFile);
        }
      } catch (error) {
        logger.error('Photo processing error', error instanceof Error ? error : new Error(String(error)));
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

/**
 * Photo Processing Hook
 * 
 * Handles file validation, metadata extraction, and image processing.
 * This hook encapsulates all the business logic for photo upload processing.
 */

import { useCallback } from 'react';
import { validateImageEnhanced } from '@/lib/utils/image/validation';
import { processImageEnhanced } from '@/lib/utils/image/processing';
import { extractImageMetadataEnhanced } from '@/lib/utils/image/metadata';
import { createImagePreviewEnhanced } from '@/lib/utils/image/resource-management';
import type { 
  PhotoProcessingOptions, 
  PhotoUploadStateReturn
} from '../types';

/**
 * Custom hook for photo processing operations
 */
export function usePhotoProcessing(
  options: PhotoProcessingOptions,
  stateHandlers: {
    setUploadState: PhotoUploadStateReturn['setUploadState'];
    setFileState: PhotoUploadStateReturn['setFileState'];
    updateProcessingProgress: PhotoUploadStateReturn['updateProcessingProgress'];
  }
) {
  const { maxFileSize, allowedTypes, processingOptions, autoProcess } = options;
  const { setUploadState, setFileState, updateProcessingProgress } = stateHandlers;

  /**
   * Process a file through validation, metadata extraction, and image processing
   */
  const processFile = useCallback(async (file: File) => {
    try {
      // Step 1: Start validation
      setUploadState(prev => ({ ...prev, isValidating: true, hasError: false }));
      updateProcessingProgress('validation', 'Validating image...');

      // Step 2: Validate the file
      const validation = await validateImageEnhanced(file, {
        maxSize: maxFileSize,
        allowedTypes,
      });

      setFileState(prev => ({ ...prev, validation }));

      if (!validation.valid) {
        setUploadState(prev => ({ 
          ...prev, 
          isValidating: false, 
          hasError: true 
        }));
        setFileState(prev => ({ ...prev, error: validation.error || 'Invalid file' }));
        updateProcessingProgress('validation', validation.error || 'Validation failed');
        return;
      }

      // Step 3: Extract metadata
      updateProcessingProgress('metadata', 'Analyzing image properties...');
      const metadata = await extractImageMetadataEnhanced(file);
      setFileState(prev => ({ ...prev, metadata }));

      // Step 4: Create preview
      const preview = createImagePreviewEnhanced(file, false); // Manual cleanup
      setFileState(prev => ({ ...prev, preview }));

      setUploadState(prev => ({ ...prev, isValidating: false }));

      // Step 5: Process image if auto-processing is enabled
      if (autoProcess) {
        setUploadState(prev => ({ ...prev, isProcessing: true }));
        updateProcessingProgress('processing', 'Optimizing image...');

        const processingResult = await processImageEnhanced(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.85,
          format: 'auto',
          ...processingOptions,
        });

        setFileState(prev => ({ ...prev, processingResult }));
        updateProcessingProgress('complete', 'Image optimized successfully!');
        
        setUploadState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          isComplete: true 
        }));
      } else {
        setUploadState(prev => ({ ...prev, isComplete: true }));
        updateProcessingProgress('complete', 'Image ready for upload');
      }

      // Step 6: Set the processed file
      setFileState(prev => ({ ...prev, file }));

    } catch (error: unknown) {
      // Handle processing errors
      setUploadState(prev => ({ 
        ...prev, 
        isValidating: false, 
        isProcessing: false, 
        hasError: true 
      }));
      setFileState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to process image' 
      }));
      updateProcessingProgress('validation', 'Processing failed');
    }
  }, [
    maxFileSize, 
    allowedTypes, 
    processingOptions, 
    autoProcess, 
    setUploadState, 
    setFileState, 
    updateProcessingProgress
  ]);

  /**
   * Retry processing with the current file
   */
  const retryProcessing = useCallback((file: File) => {
    // Reset error state and retry
    setUploadState(prev => ({ ...prev, hasError: false }));
    setFileState(prev => ({ ...prev, error: null }));
    processFile(file);
  }, [processFile, setUploadState, setFileState]);

  return {
    processFile,
    retryProcessing,
  };
} 
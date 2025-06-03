/**
 * Photo Upload State Management Hook
 * 
 * Consolidates all state management logic for the photo upload modal.
 * This hook manages upload state, file state, and processing progress.
 */

import { useState, useCallback } from 'react';
import type { 
  UploadState, 
  FileValidationState, 
  ProcessingProgress, 
  PhotoUploadStateReturn 
} from '../types';

/**
 * Custom hook for managing photo upload state
 */
export function usePhotoUploadState(): PhotoUploadStateReturn {
  // Upload state tracking
  const [uploadState, setUploadState] = useState<UploadState>({
    isDragging: false,
    isValidating: false,
    isProcessing: false,
    isComplete: false,
    hasError: false,
  });

  // File validation and processing state
  const [fileState, setFileState] = useState<FileValidationState>({
    file: null,
    validation: null,
    metadata: null,
    processingResult: null,
    preview: null,
    error: null,
  });

  // Processing progress tracking
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({
    stage: 'validation',
    message: 'Ready to upload',
  });

  /**
   * Reset all state to initial values
   */
  const resetState = useCallback(() => {
    // Cleanup preview URL to prevent memory leaks
    if (fileState.preview) {
      fileState.preview.revoke();
    }

    setUploadState({
      isDragging: false,
      isValidating: false,
      isProcessing: false,
      isComplete: false,
      hasError: false,
    });

    setFileState({
      file: null,
      validation: null,
      metadata: null,
      processingResult: null,
      preview: null,
      error: null,
    });

    setProcessingProgress({
      stage: 'validation',
      message: 'Ready to upload',
    });
  }, [fileState.preview]);

  /**
   * Update processing progress with stage and message
   */
  const updateProcessingProgress = useCallback((
    stage: ProcessingProgress['stage'], 
    message: string
  ) => {
    setProcessingProgress({ stage, message });
  }, []);

  return {
    uploadState,
    fileState,
    processingProgress,
    setUploadState,
    setFileState,
    resetState,
    updateProcessingProgress,
  };
} 
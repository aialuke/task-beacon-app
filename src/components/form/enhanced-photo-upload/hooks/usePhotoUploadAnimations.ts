/**
 * Photo Upload Animations Hook
 * 
 * Handles all spring animations for the photo upload modal.
 * This hook manages drop zone, preview, and progress animations.
 */

import { useSpring, config } from '@react-spring/web';
import type { UploadState, FileValidationState, AnimationStates } from '../types';

/**
 * Custom hook for managing photo upload animations
 */
export function usePhotoUploadAnimations(
  uploadState: UploadState,
  fileState: FileValidationState
): AnimationStates {
  
  /**
   * Drop zone animation based on drag state and upload status
   */
  const dropZoneAnimation = useSpring({
    scale: uploadState.isDragging ? 1.02 : 1,
    borderColor: uploadState.isDragging 
      ? '#3b82f6' 
      : uploadState.hasError 
        ? '#ef4444'
        : uploadState.isComplete
          ? '#10b981'
          : '#6b7280',
    backgroundColor: uploadState.isDragging 
      ? 'rgba(59, 130, 246, 0.05)'
      : 'rgba(255, 255, 255, 0.01)',
    config: config.gentle,
  });

  /**
   * Preview animation for image fade in/out
   */
  const previewAnimation = useSpring({
    opacity: fileState.preview ? 1 : 0,
    transform: fileState.preview ? 'scale(1)' : 'scale(0.9)',
    config: config.default,
  });

  /**
   * Progress animation for status indicator
   */
  const progressAnimation = useSpring({
    opacity: uploadState.isValidating || uploadState.isProcessing ? 1 : 0,
    transform: uploadState.isValidating || uploadState.isProcessing 
      ? 'translateY(0px)' 
      : 'translateY(10px)',
    config: config.default,
  });

  return {
    dropZone: dropZoneAnimation,
    preview: previewAnimation,
    progress: progressAnimation,
  };
} 
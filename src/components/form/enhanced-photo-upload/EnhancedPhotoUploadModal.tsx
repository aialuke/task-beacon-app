/**
 * Enhanced Photo Upload Modal - Refactored
 * 
 * Main modal component that orchestrates all the modular components.
 * Reduced from 532 lines to a focused orchestration component.
 */

import { useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PhotoDropZone } from './components/PhotoDropZone';
import { PhotoPreview } from './components/PhotoPreview';
import { ProcessingStatus } from './components/ProcessingStatus';
import { FileInfo } from './components/FileInfo';
import { UploadActions } from './components/UploadActions';
import { usePhotoUploadState } from './hooks/usePhotoUploadState';
import { usePhotoUploadAnimations } from './hooks/usePhotoUploadAnimations';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePhotoProcessing } from './hooks/usePhotoProcessing';
import type { EnhancedPhotoUploadModalProps } from './types';
import type { EnhancedImageProcessingOptions } from '@/lib/utils/image/types';

/**
 * Enhanced Photo Upload Modal Component
 */
export default function EnhancedPhotoUploadModal({
  isOpen,
  onClose,
  onImageSelect,
  onImageRemove,
  currentImage = null,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  processingOptions = {},
  autoProcess = true,
  showPreview = true,
  title = 'Upload Image',
  description = 'Drag and drop an image or click to browse',
}: EnhancedPhotoUploadModalProps) {
  
  // ============================================================================
  // HOOKS INTEGRATION
  // ============================================================================
  
  // State management
  const stateManager = usePhotoUploadState();
  const { uploadState, fileState, processingProgress, resetState } = stateManager;

  // Animations
  const animations = usePhotoUploadAnimations(uploadState, fileState);

  // Photo processing
  const photoProcessor = usePhotoProcessing(
    {
      maxFileSize,
      allowedTypes,
      processingOptions: processingOptions as EnhancedImageProcessingOptions,
      autoProcess,
    },
    stateManager
  );

  // Drag and drop
  const dragAndDrop = useDragAndDrop({
    onFileSelect: (files: FileList) => {
      const file = files[0];
      if (file) {
        photoProcessor.processFile(file);
      }
    }
  });

  // ============================================================================
  // LIFECYCLE & CLEANUP
  // ============================================================================

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fileState.preview) {
        fileState.preview.revoke();
      }
    };
  }, [fileState.preview]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle confirm action
   */
  const handleConfirm = useCallback(() => {
    if (fileState.file) {
      onImageSelect(fileState.file, fileState.processingResult || undefined);
      onClose();
    }
  }, [fileState.file, fileState.processingResult, onImageSelect, onClose]);

  /**
   * Handle remove action
   */
  const handleRemove = useCallback(() => {
    if (onImageRemove) {
      onImageRemove();
    }
    resetState();
  }, [onImageRemove, resetState]);

  /**
   * Handle cancel action
   */
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <PhotoDropZone
            isDragging={dragAndDrop.isDragging}
            onFileSelect={(files: FileList) => {
              const file = files[0];
              if (file) {
                photoProcessor.processFile(file);
              }
            }}
            dragHandlers={dragAndDrop.dragHandlers}
            animation={animations.dropZone}
            description={description}
            allowedTypes={allowedTypes}
            maxFileSize={maxFileSize}
            hasError={uploadState.hasError}
            isComplete={uploadState.isComplete}
            onClick={dragAndDrop.onClick}
          />

          {/* Hidden File Input */}
          <input
            ref={dragAndDrop.fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={dragAndDrop.onFileInputChange}
            className="sr-only"
            aria-label="Upload Image"
          />

          {/* Processing Status */}
          <ProcessingStatus
            uploadState={uploadState}
            processingProgress={processingProgress}
            animation={animations.progress}
          />

          {/* File Info */}
          {fileState.file && (
            <FileInfo fileState={fileState} />
          )}

          {/* Image Preview */}
          <PhotoPreview
            preview={fileState.preview}
            animation={animations.preview}
            showPreview={showPreview}
          />

          {/* Error Display */}
          {fileState.error && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {fileState.error}
            </div>
          )}

          {/* Action Buttons */}
          <UploadActions
            fileState={fileState}
            uploadState={uploadState}
            currentImage={currentImage}
            onConfirm={handleConfirm}
            onRemove={onImageRemove ? handleRemove : undefined}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
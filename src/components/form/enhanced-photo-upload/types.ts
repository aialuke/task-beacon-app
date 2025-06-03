/**
 * Enhanced Photo Upload Modal Type Definitions
 * 
 * All TypeScript interfaces and type definitions for the enhanced photo upload system.
 * This module provides type safety and clear contracts for photo upload operations.
 */

import type { 
  ProcessingResult,
  ValidationResult,
  ImageMetadata,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';

/**
 * Main props for the Enhanced Photo Upload Modal
 */
export interface EnhancedPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File, processedResult?: ProcessingResult) => void;
  onImageRemove?: () => void;
  currentImage?: File | null;
  maxFileSize?: number;
  allowedTypes?: string[];
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
  showPreview?: boolean;
  title?: string;
  description?: string;
}

/**
 * Upload state tracking
 */
export interface UploadState {
  isDragging: boolean;
  isValidating: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  hasError: boolean;
}

/**
 * File validation and processing state
 */
export interface FileValidationState {
  file: File | null;
  validation: ValidationResult | null;
  metadata: ImageMetadata | null;
  processingResult: ProcessingResult | null;
  preview: { url: string; revoke: () => void } | null;
  error: string | null;
}

/**
 * Processing progress information
 */
export interface ProcessingProgress {
  stage: 'validation' | 'metadata' | 'processing' | 'complete';
  message: string;
}

/**
 * Animation states for spring animations
 */
export interface AnimationStates {
  dropZone: any;
  preview: any;
  progress: any;
}

/**
 * Photo Drop Zone component props
 */
export interface PhotoDropZoneProps {
  isDragging: boolean;
  onFileSelect: (files: FileList) => void;
  dragHandlers: {
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    dropZoneRef: React.RefObject<HTMLDivElement>;
  };
  animation: any;
  disabled?: boolean;
  description: string;
  allowedTypes: string[];
  maxFileSize: number;
  hasError: boolean;
  isComplete: boolean;
  onClick: () => void;
}

/**
 * Processing Status component props
 */
export interface ProcessingStatusProps {
  uploadState: UploadState;
  processingProgress: ProcessingProgress;
  animation: any;
}

/**
 * Photo Preview component props
 */
export interface PhotoPreviewProps {
  preview: { url: string; revoke: () => void } | null;
  animation: any;
  showPreview: boolean;
}

/**
 * File Info component props
 */
export interface FileInfoProps {
  fileState: FileValidationState;
}

/**
 * Upload Actions component props
 */
export interface UploadActionsProps {
  fileState: FileValidationState;
  uploadState: UploadState;
  currentImage?: File | null;
  onConfirm: () => void;
  onRemove?: () => void;
  onCancel: () => void;
}

/**
 * Error Display component props
 */
export interface ErrorDisplayProps {
  error: string;
}

/**
 * Drag and drop hook options
 */
export interface DragDropOptions {
  onFileSelect: (files: FileList) => void;
}

/**
 * Photo processing hook options
 */
export interface PhotoProcessingOptions {
  maxFileSize: number;
  allowedTypes: string[];
  processingOptions: EnhancedImageProcessingOptions;
  autoProcess: boolean;
}

/**
 * Photo upload state hook return type
 */
export interface PhotoUploadStateReturn {
  uploadState: UploadState;
  fileState: FileValidationState;
  processingProgress: ProcessingProgress;
  setUploadState: React.Dispatch<React.SetStateAction<UploadState>>;
  setFileState: React.Dispatch<React.SetStateAction<FileValidationState>>;
  resetState: () => void;
  updateProcessingProgress: (stage: ProcessingProgress['stage'], message: string) => void;
} 
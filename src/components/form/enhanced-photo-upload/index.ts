/**
 * Enhanced Photo Upload Module Exports
 * 
 * Main export file for the modular enhanced photo upload system.
 * Provides clean imports for all components, hooks, and types.
 */

// Main Modal Component (named export for consistency)
export { default as EnhancedPhotoUploadModal } from './EnhancedPhotoUploadModal.tsx';

// UI Components
export { PhotoDropZone } from './components/PhotoDropZone';
export { PhotoPreview } from './components/PhotoPreview';
export { ProcessingStatus } from './components/ProcessingStatus';
export { FileInfo } from './components/FileInfo';
export { UploadActions } from './components/UploadActions';

// Hooks
export { usePhotoUploadState } from './hooks/usePhotoUploadState';
export { usePhotoUploadAnimations } from './hooks/usePhotoUploadAnimations';
export { useDragAndDrop } from './hooks/useDragAndDrop';
export { usePhotoProcessing } from './hooks/usePhotoProcessing';

// Types
export type {
  EnhancedPhotoUploadModalProps,
  UploadState,
  FileValidationState,
  ProcessingProgress,
  AnimationStates,
  PhotoDropZoneProps,
  ProcessingStatusProps,
  PhotoPreviewProps,
  FileInfoProps,
  UploadActionsProps,
  ErrorDisplayProps,
  DragDropOptions,
  PhotoProcessingOptions,
  PhotoUploadStateReturn,
} from './types'; 
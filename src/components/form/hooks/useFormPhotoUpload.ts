import { useState } from 'react';
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Core photo state management hook
 */
function usePhotoState() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

  const resetPhoto = useOptimizedCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
  }, [photoPreview], { name: 'resetPhoto' });

  return {
    photo,
    setPhoto,
    photoPreview,
    setPhotoPreview,
    loading,
    setLoading,
    processingResult,
    setProcessingResult,
    resetPhoto,
  };
}

/**
 * Modal state management hook
 */
function useModalState() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useOptimizedCallback(() => {
    setIsModalOpen(true);
  }, [], { name: 'openPhotoModal' });

  const closeModal = useOptimizedCallback(() => {
    setIsModalOpen(false);
  }, [], { name: 'closePhotoModal' });

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
}

/**
 * Create a File object from processed blob with proper naming
 */
function createProcessedFile(originalFile: File, processedBlob: Blob): File {
  // Determine the correct file extension based on the processed blob type
  let extension = '.jpg'; // Default fallback
  let baseName = originalFile.name.replace(/\.[^/.]+$/, ''); // Remove original extension

  if (processedBlob.type === 'image/webp') {
    extension = '.webp';
  } else if (processedBlob.type === 'image/png') {
    extension = '.png';
  } else if (processedBlob.type === 'image/jpeg') {
    extension = '.jpg';
  }

  const processedFileName = `${baseName}_processed${extension}`;
  
  console.log('createProcessedFile - Original:', originalFile.name, 'Processed:', processedFileName, 'Type:', processedBlob.type);

  return new File([processedBlob], processedFileName, {
    type: processedBlob.type,
    lastModified: Date.now(),
  });
}

/**
 * Photo processing hook
 */
function usePhotoProcessing(
  processingOptions: EnhancedImageProcessingOptions,
  photoState: ReturnType<typeof usePhotoState>
) {
  const { setPhoto, setPhotoPreview, setLoading, setProcessingResult } = photoState;

  const handlePhotoChange = useOptimizedCallback(
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
      } catch (error) {
        // Error handled silently - proper error handling should be implemented
      } finally {
        setLoading(false);
      }
    },
    [processingOptions, setPhoto, setPhotoPreview, setLoading],
    { name: 'handlePhotoChange' }
  );

  const handleModalPhotoSelect = useOptimizedCallback(
    (file: File, processedResult?: ProcessingResult) => {
      console.log('handleModalPhotoSelect - Original file:', file.name, 'Type:', file.type);
      console.log('handleModalPhotoSelect - ProcessedResult available:', !!processedResult);

      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      
      // Use processed blob if available, otherwise use original file
      if (processedResult?.blob) {
        console.log('handleModalPhotoSelect - Using processed blob, type:', processedResult.blob.type);
        const processedFile = createProcessedFile(file, processedResult.blob);
        setPhoto(processedFile);
        setProcessingResult(processedResult);
      } else {
        console.log('handleModalPhotoSelect - Using original file');
        setPhoto(file);
        setProcessingResult(null);
      }
    },
    [setPhoto, setPhotoPreview, setProcessingResult],
    { name: 'handleModalPhotoSelect' }
  );

  return {
    handlePhotoChange,
    handleModalPhotoSelect,
  };
}

/**
 * Standardized photo upload hook for forms
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Form, Entity: Photo, Action: Upload
 */
export function useFormPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
}) {
  // Memoize processing options to prevent unnecessary re-computations
  const processingOptions = useOptimizedMemo(
    () => ({
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
      ...options?.processingOptions,
    }),
    [options?.processingOptions],
    { name: 'processing-options' }
  );

  // Compose focused hooks
  const photoState = usePhotoState();
  const modalState = useModalState();
  const photoProcessing = usePhotoProcessing(processingOptions, photoState);

  // Upload functionality
  const uploadPhoto = useOptimizedCallback(
    async (): Promise<string | null> => {
      if (!photoState.photo) {
        console.log('uploadPhoto - No photo to upload');
        return null;
      }

      console.log('uploadPhoto - Uploading file:', photoState.photo.name, 'Type:', photoState.photo.type, 'Size:', photoState.photo.size);

      try {
        const response = await TaskService.uploadPhoto(photoState.photo);
        if (!response.success) {
          console.error('uploadPhoto - Upload failed:', response.error);
          throw new Error(response.error?.message || 'Photo upload failed');
        }
        
        console.log('uploadPhoto - Upload successful:', response.data);
        return response.data || null;
      } catch (error) {
        console.error('uploadPhoto - Upload error:', error);
        return null;
      }
    },
    [photoState.photo],
    { name: 'uploadPhoto' }
  );

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      // Core photo interface
      photo: photoState.photo,
      photoPreview: photoState.photoPreview,
      loading: photoState.loading,
      processingResult: photoState.processingResult,
      
      // Actions
      handlePhotoChange: photoProcessing.handlePhotoChange,
      uploadPhoto,
      resetPhoto: photoState.resetPhoto,
      handlePhotoRemove: photoState.resetPhoto,

      // Modal interface
      isModalOpen: modalState.isModalOpen,
      openPhotoModal: modalState.openModal,
      closePhotoModal: modalState.closeModal,
      handleModalPhotoSelect: photoProcessing.handleModalPhotoSelect,

      // Configuration
      processingOptions,
    }),
    [
      photoState.photo,
      photoState.photoPreview,
      photoState.loading,
      photoState.processingResult,
      photoState.resetPhoto,
      photoProcessing.handlePhotoChange,
      photoProcessing.handleModalPhotoSelect,
      uploadPhoto,
      modalState.isModalOpen,
      modalState.openModal,
      modalState.closeModal,
      processingOptions,
    ],
    { name: 'form-photo-upload-return' }
  );
}

/**
 * Task-specific photo upload hook
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Task, Entity: Photo, Action: Upload
 */
export function useTaskPhotoUpload(options?: {
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
}) {
  const photoUpload = useFormPhotoUpload(options);

  // Memoize return object with task-specific interface
  return useOptimizedMemo(
    () => ({
      // Standard interface
      photo: photoUpload.photo,
      photoPreview: photoUpload.photoPreview,
      photoLoading: photoUpload.loading,
      
      // Actions
      handlePhotoChange: photoUpload.handlePhotoChange,
      uploadPhoto: photoUpload.uploadPhoto,
      resetPhoto: photoUpload.resetPhoto,
      handlePhotoRemove: photoUpload.handlePhotoRemove,

      // Modal interface
      isPhotoModalOpen: photoUpload.isModalOpen,
      openPhotoModal: photoUpload.openPhotoModal,
      closePhotoModal: photoUpload.closePhotoModal,
      handleModalPhotoSelect: photoUpload.handleModalPhotoSelect,

      // Enhanced features
      processingResult: photoUpload.processingResult,
      processingOptions: photoUpload.processingOptions,
    }),
    [photoUpload],
    { name: 'task-photo-upload' }
  );
}

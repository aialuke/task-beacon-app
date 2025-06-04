
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import { compressAndResizePhoto } from '@/lib/utils/image/convenience';
import { validatePhotoFile, getImageDimensions, validateImageDimensions } from '@/lib/utils/photo-validation';
import { getPhotoUploadErrorMessage, isPhotoUploadError, createPhotoUploadError, PhotoUploadErrorCodes } from '@/lib/utils/photo-upload-errors';
import type { 
  ProcessingResult,
  EnhancedImageProcessingOptions 
} from '@/lib/utils/image/types';
import { TaskService } from '@/lib/api/tasks/task.service';

/**
 * Core photo state management hook with enhanced error handling
 */
function usePhotoState() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetPhoto = useOptimizedCallback(() => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setProcessingResult(null);
    setError(null);
    setUploadProgress(0);
  }, [photoPreview], { name: 'resetPhoto' });

  const setErrorMessage = useOptimizedCallback((errorMessage: string | null) => {
    setError(errorMessage);
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [], { name: 'setErrorMessage' });

  return {
    photo,
    setPhoto,
    photoPreview,
    setPhotoPreview,
    loading,
    setLoading,
    uploadProgress,
    setUploadProgress,
    processingResult,
    setProcessingResult,
    error,
    setErrorMessage,
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
  } else if (processedBlob.type === 'image/gif') {
    extension = '.gif';
  }

  const processedFileName = `${baseName}_processed${extension}`;
  
  console.log('createProcessedFile - Original:', originalFile.name, 'Processed:', processedFileName, 'Type:', processedBlob.type);

  return new File([processedBlob], processedFileName, {
    type: processedBlob.type,
    lastModified: Date.now(),
  });
}

/**
 * Photo processing hook with enhanced validation and error handling
 */
function usePhotoProcessing(
  processingOptions: EnhancedImageProcessingOptions,
  photoState: ReturnType<typeof usePhotoState>
) {
  const { setPhoto, setPhotoPreview, setLoading, setProcessingResult, setErrorMessage } = photoState;
  const processingTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced processing function to prevent rapid file changes
  const processPhotoWithDebounce = useOptimizedCallback(
    async (file: File) => {
      // Clear any existing timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      // Debounce processing by 300ms
      processingTimeoutRef.current = setTimeout(async () => {
        await processPhoto(file);
      }, 300);
    },
    [processingOptions],
    { name: 'processPhotoWithDebounce' }
  );

  const processPhoto = useOptimizedCallback(
    async (file: File) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        console.log('processPhoto - Starting processing for:', file.name, 'Type:', file.type);

        // Step 1: Validate file
        const validation = validatePhotoFile(file);
        if (!validation.valid && validation.error) {
          setErrorMessage(getPhotoUploadErrorMessage(validation.error));
          return;
        }

        // Step 2: Validate dimensions
        const dimensions = await getImageDimensions(file);
        const dimensionValidation = validateImageDimensions(dimensions);
        if (!dimensionValidation.valid && dimensionValidation.error) {
          setErrorMessage(getPhotoUploadErrorMessage(dimensionValidation.error));
          return;
        }

        // Step 3: Create preview
        const preview = URL.createObjectURL(file);
        setPhotoPreview(preview);

        // Step 4: Process image
        console.log('processPhoto - Processing with options:', processingOptions);
        const processedFile = await compressAndResizePhoto(
          file,
          processingOptions.maxWidth,
          processingOptions.maxHeight,
          processingOptions.quality
        );

        console.log('processPhoto - Processing complete. Original size:', file.size, 'Processed size:', processedFile.size);

        // Use the processed file for upload
        setPhoto(processedFile);
        
        // Store processing result for reference - fix the type issue
        if (processedFile !== file) {
          const result: ProcessingResult = {
            blob: processedFile,
            compressedSize: processedFile.size,
            compressionRatio: file.size / processedFile.size,
            format: processedFile.type,
            quality: processingOptions.quality,
            dimensions: dimensions
          };
          setProcessingResult(result);
        }

      } catch (error) {
        console.error('processPhoto - Processing failed:', error);
        const errorMessage = isPhotoUploadError(error) 
          ? getPhotoUploadErrorMessage(error)
          : 'Failed to process image. Please try again.';
        setErrorMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [processingOptions, setPhoto, setPhotoPreview, setLoading, setProcessingResult, setErrorMessage],
    { name: 'processPhoto' }
  );

  const handlePhotoChange = useOptimizedCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      await processPhotoWithDebounce(file);
    },
    [processPhotoWithDebounce],
    { name: 'handlePhotoChange' }
  );

  const handleModalPhotoSelect = useOptimizedCallback(
    async (file: File, processedResult?: ProcessingResult) => {
      console.log('handleModalPhotoSelect - Original file:', file.name, 'Type:', file.type);
      console.log('handleModalPhotoSelect - ProcessedResult available:', !!processedResult);

      setErrorMessage(null);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      
      // Use processed blob if available, otherwise process the file
      if (processedResult?.blob) {
        console.log('handleModalPhotoSelect - Using processed blob, type:', processedResult.blob.type);
        const processedFile = createProcessedFile(file, processedResult.blob);
        setPhoto(processedFile);
        setProcessingResult(processedResult);
      } else {
        console.log('handleModalPhotoSelect - Processing file...');
        await processPhoto(file);
      }
    },
    [setPhoto, setPhotoPreview, setProcessingResult, setErrorMessage, processPhoto],
    { name: 'handleModalPhotoSelect' }
  );

  return {
    handlePhotoChange,
    handleModalPhotoSelect,
  };
}

/**
 * Standardized photo upload hook for forms with enhanced error handling and optimization
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

  // Enhanced upload functionality with progress tracking
  const uploadPhoto = useOptimizedCallback(
    async (): Promise<string | null> => {
      if (!photoState.photo) {
        console.log('uploadPhoto - No photo to upload');
        return null;
      }

      console.log('uploadPhoto - Uploading file:', photoState.photo.name, 'Type:', photoState.photo.type, 'Size:', photoState.photo.size);

      photoState.setLoading(true);
      photoState.setUploadProgress(0);
      photoState.setErrorMessage(null);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          photoState.setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const response = await TaskService.uploadPhoto(photoState.photo);
        
        clearInterval(progressInterval);
        photoState.setUploadProgress(100);

        if (!response.success) {
          console.error('uploadPhoto - Upload failed:', response.error);
          const errorMessage = response.error?.message || 'Photo upload failed';
          photoState.setErrorMessage(errorMessage);
          return null;
        }
        
        console.log('uploadPhoto - Upload successful:', response.data);
        toast.success('Photo uploaded successfully');
        return response.data || null;
      } catch (error) {
        console.error('uploadPhoto - Upload error:', error);
        const errorMessage = isPhotoUploadError(error)
          ? getPhotoUploadErrorMessage(error)
          : 'Failed to upload photo. Please try again.';
        photoState.setErrorMessage(errorMessage);
        return null;
      } finally {
        photoState.setLoading(false);
        photoState.setUploadProgress(0);
      }
    },
    [photoState],
    { name: 'uploadPhoto' }
  );

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      // Core photo interface
      photo: photoState.photo,
      photoPreview: photoState.photoPreview,
      loading: photoState.loading,
      uploadProgress: photoState.uploadProgress,
      processingResult: photoState.processingResult,
      error: photoState.error,
      
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
      photoState.uploadProgress,
      photoState.processingResult,
      photoState.error,
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
 * Task-specific photo upload hook with enhanced interface
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
      uploadProgress: photoUpload.uploadProgress,
      error: photoUpload.error,
      
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


import { useCallback } from 'react';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskForm } from './useTaskForm';
import { useTaskSubmission } from './useTaskSubmission';
import { useTasksNavigate } from './useTasksNavigate';
import { useTaskPhotoUpload } from '@/components/form/hooks/useFormPhotoUpload';

interface UseCreateTaskProps {
  onClose?: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl: string | null;
  priority: 'medium';
}

/**
 * Optimized hook for creating new tasks with better composition
 * 
 * Now uses performance-optimized hooks and better separation of concerns.
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const { navigateToDashboard } = useTasksNavigate();
  const { submitTask } = useTaskSubmission();
  
  // Memoize close callback to prevent unnecessary re-renders
  const closeCallback = useOptimizedMemo(
    () => onClose || navigateToDashboard,
    [onClose, navigateToDashboard],
    { name: 'close-callback' }
  );

  const taskForm = useTaskForm({ onClose: closeCallback });
  
  // Memoize photo upload configuration
  const photoUploadConfig = useOptimizedMemo(
    () => ({
      processingOptions: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'auto' as const,
      },
      autoProcess: true,
    }),
    [],
    { name: 'photo-upload-config' }
  );

  const photoUpload = useTaskPhotoUpload(photoUploadConfig);

  // Optimized form validation
  const validateForm = useOptimizedCallback(() => {
    const validationResult = taskForm.validateForm();
    if (!validationResult.isValid) {
      taskForm.showValidationErrors(validationResult.errors);
      return false;
    }
    return true;
  }, [taskForm], { name: 'validateForm' });

  // Optimized photo upload handling
  const handlePhotoUpload = useOptimizedCallback(async (): Promise<string | null> => {
    if (!photoUpload.photo) return null;
    
    const uploadResult = await photoUpload.uploadPhoto();
    return uploadResult || null;
  }, [photoUpload.photo, photoUpload.uploadPhoto], { name: 'handlePhotoUpload' });

  // Optimized form data preparation
  const prepareTaskData = useOptimizedCallback(
    (photoUrl: string | null): TaskFormData => ({
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate,
      url: taskForm.url,
      pinned: taskForm.pinned,
      assigneeId: taskForm.assigneeId,
      photoUrl,
      priority: 'medium' as const,
    }),
    [taskForm],
    { name: 'prepareTaskData' }
  );

  // Optimized form reset
  const resetForm = useOptimizedCallback(() => {
    taskForm.resetFormState();
    photoUpload.resetPhoto();
  }, [taskForm, photoUpload], { name: 'resetForm' });

  // Main submit handler with optimized flow
  const handleSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      taskForm.setLoading(true);
      
      try {
        // Handle photo upload
        const photoUrl = await handlePhotoUpload();

        // Prepare and submit task data
        const taskData = prepareTaskData(photoUrl);
        const result = await submitTask(taskData);

        if (result.success) {
          resetForm();
          closeCallback();
        }
      } catch (error) {
        // Error handling is managed by the submission hook
      } finally {
        taskForm.setLoading(false);
      }
    },
    [
      validateForm,
      taskForm.setLoading,
      handlePhotoUpload,
      prepareTaskData,
      submitTask,
      resetForm,
      closeCallback,
    ],
    { name: 'handleSubmit' }
  );

  // Memoize loading state calculation
  const loading = useOptimizedMemo(
    () => taskForm.loading || photoUpload.photoLoading,
    [taskForm.loading, photoUpload.photoLoading],
    { name: 'loading-state' }
  );

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      // Form state
      ...taskForm,
      loading, // Combined loading state
      
      // Photo upload
      photo: photoUpload.photo,
      photoPreview: photoUpload.photoPreview,
      handlePhotoChange: photoUpload.handlePhotoChange,
      isPhotoModalOpen: photoUpload.isPhotoModalOpen,
      openPhotoModal: photoUpload.openPhotoModal,
      closePhotoModal: photoUpload.closePhotoModal,
      handleModalPhotoSelect: photoUpload.handleModalPhotoSelect,
      handlePhotoRemove: photoUpload.handlePhotoRemove,
      
      // Enhanced photo upload properties
      uploadProgress: photoUpload.uploadProgress,
      error: photoUpload.error,
      
      // Submit handler
      handleSubmit,
    }),
    [
      taskForm,
      loading,
      photoUpload.photo,
      photoUpload.photoPreview,
      photoUpload.handlePhotoChange,
      photoUpload.isPhotoModalOpen,
      photoUpload.openPhotoModal,
      photoUpload.closePhotoModal,
      photoUpload.handleModalPhotoSelect,
      photoUpload.handlePhotoRemove,
      photoUpload.uploadProgress,
      photoUpload.error,
      handleSubmit,
    ],
    { name: 'create-task-return' }
  );
}

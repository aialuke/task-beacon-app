
import { useState } from 'react';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useTaskPhotoUpload } from '@/components/form/hooks/useFormPhotoUpload';
import { useTaskMutations } from './useTaskMutations';
import { toast } from 'sonner';
import type { Task } from '@/types';

interface UseTaskFormBaseOptions {
  onClose?: () => void;
  parentTask?: Task; // Properly typed parent task
}

/**
 * Base hook for task form functionality
 * Shared between create and follow-up task forms
 */
export function useTaskFormBase({ onClose, parentTask }: UseTaskFormBaseOptions = {}) {
  const [loading, setLoading] = useState(false);
  const validation = useTaskFormValidation();
  const { createTaskCallback } = useTaskMutations();

  // Initialize form with proper onClose handling
  const taskForm = useTaskForm({ onClose });

  // Standardized photo upload configuration
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

  // Unified form validation
  const validateForm = useOptimizedCallback(() => {
    const formData = {
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate || '',
      url: taskForm.url || '',
      assigneeId: taskForm.assigneeId || '',
      priority: 'medium' as const,
    };

    const validationResult = validation.validateTaskForm(formData);
    
    if (!validationResult.isValid) {
      validation.showValidationErrors(validationResult.errors);
      return { isValid: false, errors: validationResult.errors };
    }
    
    return { isValid: true, errors: {} };
  }, [taskForm, validation], { name: 'validateForm' });

  // Unified photo upload handling
  const handlePhotoUpload = useOptimizedCallback(async (): Promise<string | null> => {
    if (!photoUpload.photo) return null;
    
    const uploadResult = await photoUpload.uploadPhoto();
    return uploadResult || null;
  }, [photoUpload.photo, photoUpload.uploadPhoto], { name: 'handlePhotoUpload' });

  // Prepare task data for submission
  const prepareTaskData = useOptimizedCallback((photoUrl: string | null) => {
    const titleStr = String(taskForm.title).trim();
    const descriptionStr = String(taskForm.description).trim();
    const urlStr = String(taskForm.url).trim();
    
    const rawTaskData = {
      title: titleStr,
      description: descriptionStr || (parentTask ? `Follow-up from task: ${parentTask.title}` : undefined),
      dueDate: taskForm.dueDate,
      url: urlStr,
      assigneeId: taskForm.assigneeId,
      priority: 'medium' as const,
      photoUrl: photoUrl ?? undefined,
      urlLink: urlStr || undefined,
      parentTaskId: parentTask?.id || undefined,
    };

    return validation.prepareTaskData(rawTaskData);
  }, [taskForm, parentTask, validation], { name: 'prepareTaskData' });

  // Unified form reset
  const resetForm = useOptimizedCallback(() => {
    taskForm.resetFormState();
    photoUpload.resetPhoto();
  }, [taskForm, photoUpload], { name: 'resetForm' });

  // Unified submit handler
  const handleSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationResult = validateForm();
      if (!validationResult.isValid) {
        console.log('Validation failed:', validationResult.errors);
        return;
      }

      setLoading(true);
      
      try {
        // Handle photo upload
        const photoUrl = await handlePhotoUpload();

        // Prepare validated task data
        const taskData = prepareTaskData(photoUrl);

        if (!taskData) {
          return; // Validation errors already shown
        }

        console.log('Submitting validated task data:', taskData);

        const result = await createTaskCallback(taskData as any);

        if (result.success) {
          const successMessage = parentTask ? 'Follow-up task created successfully' : 'Task created successfully';
          toast.success(successMessage);
          resetForm();
          onClose?.();
        } else {
          toast.error(result.error || 'Failed to create task');
        }
      } catch (error) {
        console.error('Task creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      validateForm,
      handlePhotoUpload,
      prepareTaskData,
      createTaskCallback,
      resetForm,
      onClose,
      parentTask,
    ],
    { name: 'handleSubmit' }
  );

  // Combined loading state
  const combinedLoading = useOptimizedMemo(
    () => loading || photoUpload.photoLoading,
    [loading, photoUpload.photoLoading],
    { name: 'loading-state' }
  );

  // Standardized return object
  return useOptimizedMemo(
    () => ({
      // Form state
      ...taskForm,
      loading: combinedLoading,
      setLoading,
      
      // Photo upload functionality
      photoPreview: photoUpload.photoPreview,
      handlePhotoChange: photoUpload.handlePhotoChange,
      handlePhotoRemove: photoUpload.handlePhotoRemove,
      photoLoading: photoUpload.photoLoading,
      processingResult: photoUpload.processingResult,
      handlePhotoUpload, // Expose the upload method
      
      // Form actions
      handleSubmit,
      resetForm,
      
      // Validation
      validateForm,
      showValidationErrors: validation.showValidationErrors,
    }),
    [
      taskForm,
      combinedLoading,
      photoUpload.photoPreview,
      photoUpload.handlePhotoChange,
      photoUpload.handlePhotoRemove,
      photoUpload.photoLoading,
      photoUpload.processingResult,
      handlePhotoUpload,
      handleSubmit,
      resetForm,
      validateForm,
      validation.showValidationErrors,
    ],
    { name: 'task-form-base-return' }
  );
}

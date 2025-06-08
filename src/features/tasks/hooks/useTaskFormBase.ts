
import { useState, useMemo, useCallback } from 'react';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useTaskPhotoUpload } from '@/components/form/hooks/useTaskPhotoUpload';
import { useTaskMutations } from './useTaskMutations';
import { toast } from 'sonner';
import type { Task } from '@/types';

interface UseTaskFormBaseOptions {
  onClose?: () => void;
  parentTask?: Task;
}

/**
 * Simplified task form base hook - Phase 2.4 Revised
 * Using standard React hooks instead of custom performance abstractions
 */
export function useTaskFormBase({ onClose, parentTask }: UseTaskFormBaseOptions = {}) {
  const [loading, setLoading] = useState(false);
  const validation = useTaskFormValidation();
  const { createTaskCallback } = useTaskMutations();

  // Initialize form with proper onClose handling
  const taskForm = useTaskForm({ onClose });

  // Use standardized photo upload hook
  const photoUpload = useTaskPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
  });

  // Task data preparation using standard useCallback
  const prepareTaskData = useCallback((photoUrl: string | null) => {
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
  }, [taskForm, parentTask, validation]);

  // Unified form reset using standard useCallback
  const resetForm = useCallback(() => {
    taskForm.resetFormState();
    photoUpload.resetPhoto();
  }, [taskForm, photoUpload]);

  // Unified submit handler using standard useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationResult = validation.validateTaskForm({
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate || '',
        url: taskForm.url || '',
        assigneeId: taskForm.assigneeId || '',
        priority: 'medium' as const,
      });
      
      if (!validationResult.isValid) {
        validation.showValidationErrors(validationResult.errors);
        return;
      }

      setLoading(true);
      
      try {
        // Handle photo upload using the upload method from photo hook
        const photoUrl = await photoUpload.uploadPhoto();

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
    [taskForm, photoUpload, validation, createTaskCallback, onClose, parentTask, prepareTaskData, resetForm]
  );

  // Combined loading state using standard useMemo
  const combinedLoading = useMemo(
    () => loading || photoUpload.photoLoading,
    [loading, photoUpload.photoLoading]
  );

  // Form validation function using standard useCallback
  const validateForm = useCallback(() => {
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
  }, [taskForm, validation]);

  // Standardized return object using standard useMemo
  return useMemo(
    () => ({
      // Form state
      ...taskForm,
      loading: combinedLoading,
      setLoading,
      
      // Photo upload functionality - expose all needed methods
      photoPreview: photoUpload.photoPreview,
      handlePhotoChange: photoUpload.handlePhotoChange,
      handlePhotoRemove: photoUpload.handlePhotoRemove,
      photoLoading: photoUpload.photoLoading,
      processingResult: photoUpload.processingResult,
      handlePhotoUpload: photoUpload.uploadPhoto, // Expose the upload method
      
      // Form actions
      handleSubmit,
      resetForm,
      validateForm,
      showValidationErrors: validation.showValidationErrors,
    }),
    [taskForm, combinedLoading, photoUpload, handleSubmit, resetForm, validateForm, validation.showValidationErrors]
  );
}


import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskForm } from './useTaskForm';
import { useTaskMutations } from './useTaskMutations';
import { useTasksNavigate } from './useTasksNavigate';
import { useTaskPhotoUpload } from '@/components/form/hooks/useFormPhotoUpload';
import { useTaskFormValidation } from './useTaskFormValidation';
import { toast } from 'sonner';

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Enhanced with Phase 3: Form validation integration
 * Now properly integrates validation with form submission flow
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const { navigateToDashboard } = useTasksNavigate();
  const { createTaskCallback } = useTaskMutations();
  const validation = useTaskFormValidation();
  
  // Memoize close callback to prevent unnecessary re-renders
  const closeCallback = useOptimizedMemo(
    () => onClose || navigateToDashboard,
    [onClose, navigateToDashboard],
    { name: 'close-callback' }
  );

  // Pass onClose to useTaskForm properly
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

  // Enhanced form validation with proper error handling
  const validateForm = useOptimizedCallback(() => {
    // Prepare form data for validation
    const formData = {
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate || '',
      url: taskForm.url || '',
      pinned: taskForm.pinned || false,
      assigneeId: taskForm.assigneeId || '',
      priority: 'medium' as const,
    };

    // Use the task form validation schema
    const validationResult = validation.validateTaskForm(formData);
    
    if (!validationResult.isValid) {
      // Show validation errors to user via toast
      validation.showValidationErrors(validationResult.errors);
      return { isValid: false, errors: validationResult.errors };
    }
    
    return { isValid: true, errors: {} };
  }, [taskForm, validation], { name: 'validateForm' });

  // Optimized photo upload handling
  const handlePhotoUpload = useOptimizedCallback(async (): Promise<string | null> => {
    if (!photoUpload.photo) return null;
    
    const uploadResult = await photoUpload.uploadPhoto();
    return uploadResult || null;
  }, [photoUpload.photo, photoUpload.uploadPhoto], { name: 'handlePhotoUpload' });

  // Enhanced submit handler with improved validation integration
  const handleSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Phase 3: Enhanced validation integration
      const validationResult = validateForm();
      if (!validationResult.isValid) {
        console.log('Validation failed:', validationResult.errors);
        return;
      }

      taskForm.setLoading(true);
      
      try {
        // Handle photo upload
        const photoUrl = await handlePhotoUpload();

        // Prepare task data using validation helper
        const rawTaskData = {
          title: taskForm.title,
          description: taskForm.description,
          dueDate: taskForm.dueDate,
          url: taskForm.url,
          pinned: taskForm.pinned,
          assigneeId: taskForm.assigneeId,
          priority: 'medium' as const,
        };

        // Use validation helper to prepare and validate data
        const taskData = validation.prepareTaskData({
          ...rawTaskData,
          photoUrl: photoUrl || undefined,
          urlLink: rawTaskData.url?.trim() || undefined,
        });

        if (!taskData) {
          // Validation errors already shown by prepareTaskData
          return;
        }

        console.log('Submitting validated task data:', taskData);

        // Submit using the mutation hook with validated data
        const result = await createTaskCallback(taskData);

        if (result.success) {
          toast.success('Task created successfully');
          taskForm.resetFormState();
          photoUpload.resetPhoto();
          closeCallback();
        } else {
          toast.error(result.error || 'Failed to create task');
        }
      } catch (error) {
        console.error('Task creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
        toast.error(errorMessage);
      } finally {
        taskForm.setLoading(false);
      }
    },
    [
      validateForm,
      taskForm,
      handlePhotoUpload,
      validation,
      createTaskCallback,
      closeCallback,
      photoUpload,
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
      
      // Photo upload - simplified interface
      photoPreview: photoUpload.photoPreview,
      handlePhotoChange: photoUpload.handlePhotoChange,
      handlePhotoRemove: photoUpload.handlePhotoRemove,
      photoLoading: photoUpload.photoLoading,
      processingResult: photoUpload.processingResult,
      
      // Submit handler
      handleSubmit,
      
      // Enhanced validation integration
      validateForm,
      showValidationErrors: validation.showValidationErrors,
    }),
    [
      taskForm,
      loading,
      photoUpload.photoPreview,
      photoUpload.handlePhotoChange,
      photoUpload.handlePhotoRemove,
      photoUpload.photoLoading,
      photoUpload.processingResult,
      handleSubmit,
      validateForm,
      validation.showValidationErrors,
    ],
    { name: 'create-task-return' }
  );
}

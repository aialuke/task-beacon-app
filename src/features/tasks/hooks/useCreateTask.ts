
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import { useTaskForm } from './useTaskForm';
import { useTaskMutations } from './useTaskMutations';
import { useTasksNavigate } from './useTasksNavigate';
import { useTaskPhotoUpload } from '@/components/form/hooks/useFormPhotoUpload';
import { toast } from 'sonner';

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Now uses performance-optimized hooks and better separation of concerns.
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const { navigateToDashboard } = useTasksNavigate();
  const { createTaskCallback } = useTaskMutations();
  
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

  // Main submit handler with optimized flow
  const handleSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      taskForm.setLoading(true);
      
      try {
        // Handle photo upload
        const photoUrl = await handlePhotoUpload();

        // Prepare task data in the correct format for the API
        const taskData = {
          title: taskForm.title.trim(),
          description: taskForm.description?.trim() || undefined,
          due_date: taskForm.dueDate || null,
          photo_url: photoUrl,
          url_link: taskForm.url?.trim() || null,
          assignee_id: taskForm.assigneeId || null,
          pinned: taskForm.pinned || false,
        };

        console.log('Submitting task data:', taskData);

        // Submit using the mutation hook
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
        toast.error('Failed to create task');
      } finally {
        taskForm.setLoading(false);
      }
    },
    [
      validateForm,
      taskForm,
      handlePhotoUpload,
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
    ],
    { name: 'create-task-return' }
  );
}


import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Clean imports from organized type system
import type { Task } from '@/types';
import {
  showBrowserNotification,
  triggerHapticFeedback,
} from '@/lib/utils/notification';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useTaskPhotoUpload } from '@/components/form/hooks/useFormPhotoUpload';
import { useTaskMutations } from './useTaskMutations';
import { AuthService } from '@/lib/api/auth.service';

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Enhanced with Phase 3: Form validation integration
 * Now properly integrates validation with follow-up task submission flow
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const validation = useTaskFormValidation();
  const { createTaskCallback } = useTaskMutations();

  // Pass onClose to useTaskForm properly
  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate('/')),
  });

  const [assigneeId, setAssigneeId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Use standardized photo upload hook
  const photoUpload = useTaskPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
    autoProcess: true,
  });

  // Enhanced form validation for follow-up tasks
  const validateFollowUpForm = useCallback(() => {
    // Prepare form data for validation
    const formData = {
      title: taskForm.title,
      description: taskForm.description || `Follow-up from task: ${parentTask.title}`,
      dueDate: taskForm.dueDate || '',
      url: taskForm.url || '',
      pinned: taskForm.pinned || false,
      assigneeId: assigneeId || '',
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
  }, [taskForm, assigneeId, parentTask.title, validation]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Phase 3: Enhanced validation integration
      const validationResult = validateFollowUpForm();
      if (!validationResult.isValid) {
        console.log('Follow-up form validation failed:', validationResult.errors);
        return;
      }

      taskForm.setLoading(true);
      setError(null);

      try {
        // Get current user
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          throw new Error('Failed to get current user');
        }
        const currentUserId = userResponse.data;

        // Handle photo upload using standardized hook
        const photoUrl = photoUpload.photo ? await photoUpload.uploadPhoto() : null;

        // Prepare follow-up task data
        const rawTaskData = {
          title: taskForm.title,
          description: taskForm.description || `Follow-up from task: ${parentTask.title}`,
          dueDate: taskForm.dueDate,
          url: taskForm.url,
          pinned: taskForm.pinned,
          assigneeId: assigneeId || currentUserId,
          priority: 'medium' as const,
        };

        // Use validation helper to prepare and validate data
        const followUpTaskData = validation.prepareTaskData({
          ...rawTaskData,
          photoUrl: photoUrl || undefined,
          urlLink: rawTaskData.url?.trim() || undefined,
          parentTaskId: parentTask.id, // Add parent task relationship
        });

        if (!followUpTaskData) {
          // Validation errors already shown by prepareTaskData
          return;
        }

        console.log('Creating validated follow-up task:', followUpTaskData);

        // Use createTaskCallback mutation hook consistently
        const result = await createTaskCallback(followUpTaskData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create follow-up task');
        }

        // Success handling
        toast.success('Follow-up task created successfully');
        
        // Invalidate queries to refresh the task list
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        
        triggerHapticFeedback();
        if (currentUserId) {
          showBrowserNotification(
            'Follow-up Task Created',
            `Follow-up task "${taskForm.title}" has been created`
          );
        }
        
        // Reset form and navigate
        taskForm.resetFormState();
        photoUpload.resetPhoto();
        
        const closeCallback = onClose || (() => navigate('/'));
        closeCallback();

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up task';
        console.error('Follow-up task creation error:', error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        taskForm.setLoading(false);
      }
    },
    [
      validateFollowUpForm,
      taskForm,
      parentTask,
      assigneeId,
      photoUpload,
      validation,
      createTaskCallback,
      onClose,
      navigate,
      queryClient,
    ]
  );

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
    error,
    loading: taskForm.loading,
    
    // Standardized photo upload functionality
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    handlePhotoRemove: photoUpload.handlePhotoRemove,
    photoLoading: photoUpload.photoLoading,
    processingResult: photoUpload.processingResult,
    
    // Enhanced validation integration
    validateForm: validateFollowUpForm,
    showValidationErrors: validation.showValidationErrors,
  };
}

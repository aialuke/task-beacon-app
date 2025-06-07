
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
 * Hook for creating follow-up tasks with standardized validation and photo upload
 * FIXED: Now uses consistent camelCase data format and createTaskCallback
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { validateTitle } = useTaskFormValidation();
  const { createTaskCallback } = useTaskMutations(); // Use mutation hook consistently

  // Pass onClose to useTaskForm properly
  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate('/')),
  });

  const [assigneeId, setAssigneeId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // FIXED: Use standardized photo upload hook instead of manual state
  const photoUpload = useTaskPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
    autoProcess: true,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateTitle(taskForm.title)) {
        toast.error('Please enter a valid task title');
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

        // FIXED: Create follow-up task data with camelCase format matching TaskCreateData
        const followUpTaskData = {
          title: taskForm.title.trim(),
          description: taskForm.description?.trim() || `Follow-up from task: ${parentTask.title}`,
          dueDate: taskForm.dueDate || undefined,        // Changed from due_date
          photoUrl: photoUrl || undefined,               // Changed from photo_url
          urlLink: taskForm.url?.trim() || undefined,    // Changed from url_link
          assigneeId: assigneeId || currentUserId,       // Changed from assignee_id
          parentTaskId: parentTask.id,                   // Added for follow-up relationship
          pinned: taskForm.pinned || false,
        };

        console.log('Creating follow-up task (camelCase):', followUpTaskData);

        // FIXED: Use createTaskCallback mutation hook consistently
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
      taskForm,
      parentTask,
      validateTitle,
      assigneeId,
      photoUpload,
      createTaskCallback, // Updated dependency
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
    loading: taskForm.loading, // Use the form's loading state
    // FIXED: Standardized photo upload functionality using useTaskPhotoUpload
    photoPreview: photoUpload.photoPreview,
    handlePhotoChange: photoUpload.handlePhotoChange,
    handlePhotoRemove: photoUpload.handlePhotoRemove,
    photoLoading: photoUpload.photoLoading,
    processingResult: photoUpload.processingResult,
  };
}

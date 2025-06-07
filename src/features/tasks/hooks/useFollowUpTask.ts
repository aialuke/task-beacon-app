
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { AuthService } from '@/lib/api/auth.service';
import { toast } from 'sonner';

// Clean imports from organized type system
import type { Task } from '@/types';
import {
  showBrowserNotification,
  triggerHapticFeedback,
} from '@/lib/utils/notification';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useCreateTaskPhotoUpload } from './useCreateTaskPhotoUpload';

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Hook for creating follow-up tasks with standardized validation and photo upload
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { validateTitle } = useTaskFormValidation();
  const { uploadPhotoIfPresent } = useCreateTaskPhotoUpload();

  // Pass onClose to useTaskForm properly
  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate('/')),
  });

  const [assigneeId, setAssigneeId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  // Photo upload handlers
  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }, []);

  const handlePhotoRemove = useCallback(() => {
    setSelectedPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  }, [photoPreview]);

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

        // Upload photo if present
        const photoUrl = await uploadPhotoIfPresent(selectedPhoto);

        // Create follow-up task data with the correct structure
        const followUpTaskData = {
          title: taskForm.title.trim(),
          description: taskForm.description?.trim() || `Follow-up from task: ${parentTask.title}`,
          due_date: taskForm.dueDate || null,
          photo_url: photoUrl,
          url_link: taskForm.url?.trim() || null,
          assignee_id: assigneeId || currentUserId,
          pinned: taskForm.pinned || false,
        };

        console.log('Creating follow-up task:', followUpTaskData);

        // Create the follow-up task using the hierarchy service
        const createResult = await TaskService.createFollowUp(parentTask.id, followUpTaskData);

        if (!createResult.success) {
          throw new Error(createResult.error?.message || 'Failed to create follow-up task');
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
        handlePhotoRemove();
        
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
      selectedPhoto,
      uploadPhotoIfPresent,
      onClose,
      navigate,
      queryClient,
      handlePhotoRemove,
    ]
  );

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
    error,
    loading: taskForm.loading, // Use the form's loading state
    // Simplified photo upload functionality
    photoPreview,
    handlePhotoChange,
    handlePhotoRemove,
  };
}

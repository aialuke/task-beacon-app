import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';

// Clean imports from organized type system
import type { Task } from '@/types';
import {
  showBrowserNotification,
  triggerHapticFeedback,
} from '@/lib/utils/notification';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Hook for creating follow-up tasks with standardized validation
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { validateTitle } = useTaskFormValidation();

  const taskForm = useTaskForm({
    onClose: onClose || (() => navigate('/')),
  });

  const [assigneeId, setAssigneeId] = useState<string>('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateTitle(taskForm.title)) return;

      taskForm.setLoading(true);

      try {
        let photoUrl = null;
        if (taskForm.photo) {
          const uploadResponse = await TaskService.uploadPhoto(taskForm.photo);
          if (!uploadResponse.success) {
            throw new Error(uploadResponse.error?.message || 'Photo upload failed');
          }
          photoUrl = uploadResponse.data;
        }

        // Direct call to TaskService instead of using useTaskMutations
        const response = await TaskService.createFollowUp(parentTask.id, {
          title: taskForm.title,
          description: taskForm.description || null,
          dueDate: taskForm.dueDate
            ? new Date(taskForm.dueDate).toISOString()
            : null,
          photoUrl: photoUrl,
          urlLink: taskForm.url || null,
          assigneeId: assigneeId || null,
          pinned: taskForm.pinned,
        });

        if (response.success) {
          // Invalidate queries to refresh the task list
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          
          triggerHapticFeedback();
          console.log('Follow-up task created successfully');
          if (assigneeId) {
            showBrowserNotification(
              'Task Assigned',
              `Follow-up task "${taskForm.title}" has been assigned`
            );
          }
          taskForm.resetForm();
          
          // Navigate back to dashboard after successful task creation
          const closeCallback = onClose || (() => navigate('/'));
          closeCallback();
        } else {
          console.error('Failed to create follow-up task:', response.error?.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Follow-up task creation error:', error.message);
        } else {
          console.error('An unexpected error occurred during follow-up task creation.');
        }
      } finally {
        taskForm.setLoading(false);
      }
    },
    [taskForm, assigneeId, parentTask, validateTitle, onClose, navigate, queryClient]
  );

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
  };
}

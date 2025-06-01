import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { TaskService } from '@/lib/api/tasks.service';

// Clean imports from organized type system
import type { Task } from '@/types';
import {
  showBrowserNotification,
  triggerHapticFeedback,
} from '@/lib/utils/notification';
import { useTaskForm } from './useTaskForm';
import { useTaskFormValidation } from './useTaskFormValidation';
import { useTaskMutations } from './useTaskMutations';

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Hook for creating follow-up tasks with standardized validation
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const { validateTitle } = useTaskFormValidation();
  const { createFollowUpTask } = useTaskMutations();

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

        const result = await createFollowUpTask(parentTask, {
          title: taskForm.title,
          description: taskForm.description || null,
          due_date: taskForm.dueDate
            ? new Date(taskForm.dueDate).toISOString()
            : null,
          photo_url: photoUrl,
          url_link: taskForm.url || null,
          assignee_id: assigneeId || null,
          pinned: taskForm.pinned,
        });

        if (result.success) {
          triggerHapticFeedback();
          toast.success(result.message);
          if (assigneeId) {
            showBrowserNotification(
              'Task Assigned',
              `Follow-up task "${taskForm.title}" has been assigned`
            );
          }
          taskForm.resetForm();
        } else {
          toast.error(result.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      } finally {
        taskForm.setLoading(false);
      }
    },
    [taskForm, assigneeId, parentTask, validateTitle, createFollowUpTask]
  );

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
  };
}

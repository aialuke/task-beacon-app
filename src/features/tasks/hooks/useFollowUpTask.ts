import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { AuthService } from '@/lib/api/auth.service';

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateTitle(taskForm.title)) return;

      taskForm.setLoading(true);

      try {
        // Get current user
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          setError('Failed to get current user');
          return { success: false, error: 'Failed to get current user' };
        }
        const currentUserId = userResponse.data;

        // Create follow-up task data
        const followUpTaskData = {
          title: `${parentTask.title} (Follow-up)`,
          description: parentTask.description || `Follow-up from task: ${parentTask.title}`,
          assigneeId: currentUserId,
          pinned: false,
          url: parentTask.url_link || '',
          dueDate: '',
          photoUrl: undefined,
        };

        // Create the follow-up task
        const createResult = await TaskService.createFollowUp(parentTask.id, followUpTaskData);

        if (!createResult.success) {
          return { success: false, error: createResult.error || 'Failed to create follow-up task' };
        }

        // Invalidate queries to refresh the task list
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        
        triggerHapticFeedback();
        if (currentUserId) {
          showBrowserNotification(
            'Task Assigned',
            `Follow-up task "${taskForm.title}" has been assigned`
          );
        }
        taskForm.resetForm();
        
        // Navigate back to dashboard after successful task creation
        const closeCallback = onClose || (() => navigate('/'));
        closeCallback();

        return { success: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        taskForm.setLoading(false);
        setIsLoading(false);
      }
    },
    [taskForm, parentTask, validateTitle, onClose, navigate, queryClient]
  );

  return {
    ...taskForm,
    assigneeId,
    setAssigneeId,
    handleSubmit,
    error,
    isLoading,
  };
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskFormBase } from './useTaskFormBase';
import { useTaskMutations } from './useTaskMutations';
import { useOptimizedMemo, useOptimizedCallback } from '@/hooks/useOptimizedMemo';
import type { Task } from '@/types';
import {
  showBrowserNotification,
  triggerHapticFeedback,
} from '@/lib/utils/notification';
import { AuthService } from '@/lib/api/auth.service';
import { toast } from 'sonner';

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Phase 4 Cleanup: Simplified follow-up task hook using shared base
 * Eliminates duplicate code while maintaining exact same functionality
 */
export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Use shared base hook functionality
  const baseHook = useTaskFormBase({
    onClose: onClose || (() => { navigate('/'); }),
    parentTask,
  });

  // Get mutations directly since base hook doesn't expose it
  const { createTaskCallback } = useTaskMutations();

  // Enhanced submit handler with follow-up specific logic
  const handleSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form using base hook validation
      const validationResult = baseHook.validateForm();
      if (!validationResult.isValid) {
        console.log('Follow-up form validation failed:', validationResult.errors);
        return;
      }

      baseHook.setLoading(true);
      setError(null);

      try {
        // Get current user for assignee fallback
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          throw new Error('Failed to get current user');
        }
        const currentUserId = userResponse.data;

        // Handle photo upload using base hook's upload method
        let photoUrl: string | null = null;
        if (baseHook.photoPreview) {
          photoUrl = await baseHook.handlePhotoUpload();
        }

        // Prepare follow-up task data with assignee handling - ensure proper typing
        const taskTitle = String(baseHook.title).trim();
        const taskDescription = String(baseHook.description || `Follow-up from task: ${parentTask.title}`).trim();
        const taskDueDate = String(baseHook.dueDate || '');
        const taskUrl = String(baseHook.url || '').trim();

        const rawTaskData = {
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          url: taskUrl,
          assigneeId: assigneeId || currentUserId,
          priority: 'medium' as const,
          photoUrl: photoUrl ?? undefined,
          urlLink: taskUrl || undefined,
          parentTaskId: parentTask.id,
        };

        // Simple validation check
        if (!taskTitle) {
          toast.error('Task title is required');
          return;
        }

        const taskData = {
          title: taskTitle,
          description: taskDescription || undefined,
          due_date: taskDueDate || undefined,
          photo_url: photoUrl,
          url_link: taskUrl || undefined,
          assignee_id: assigneeId || currentUserId,
          parent_task_id: parentTask.id,
          priority: 'medium' as const,
        };

        console.log('Creating validated follow-up task:', taskData);

        // Create task using mutation hook
        const result = await createTaskCallback(taskData);

        if (!result?.success) {
          throw new Error(result?.error || 'Failed to create follow-up task');
        }

        // Success handling
        toast.success('Follow-up task created successfully');
        
        // Invalidate queries to refresh the task list
        void queryClient.invalidateQueries({ queryKey: ['tasks'] });
        
        triggerHapticFeedback();
        if (currentUserId) {
          showBrowserNotification(
            'Follow-up Task Created',
            `Follow-up task "${taskTitle}" has been created`
          );
        }
        
        // Reset form and navigate
        baseHook.resetForm();
        
        const closeCallback = onClose ?? (() => navigate('/'));
        closeCallback();

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up task';
        console.error('Follow-up task creation error:', error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        baseHook.setLoading(false);
      }
    },
    [
      baseHook,
      parentTask,
      assigneeId,
      onClose,
      navigate,
      queryClient,
      createTaskCallback,
    ]
  );

  // Return interface compatible with existing usage
  return useOptimizedMemo(
    () => ({
      ...baseHook,
      // Follow-up specific additions
      assigneeId,
      setAssigneeId,
      handleSubmit, // Override with follow-up specific submit
      error,
      
      // Alias validateForm for backward compatibility
      validateForm: baseHook.validateForm,
    }),
    [
      baseHook,
      assigneeId,
      setAssigneeId,
      handleSubmit,
      error,
    ],
    { name: 'follow-up-task-return' }
  );
}
// CodeRabbit review

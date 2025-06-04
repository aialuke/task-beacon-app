import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TaskService } from '@/lib/api/tasks/task.service';
import { AuthService } from '@/lib/api/base';
import { useTaskFormValidation } from './useTaskFormValidation';

interface SubmitTaskData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface SubmissionResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

/**
 * Focused hook for task submission logic
 * 
 * Handles only the API submission and related concerns.
 * Does not manage form state or UI side effects.
 */
export function useTaskSubmission() {
  const queryClient = useQueryClient();
  const { validateCreateTask, showValidationErrors } = useTaskFormValidation();

  /**
   * Submit a new task to the API
   */
  const submitTask = useCallback(async (
    taskData: SubmitTaskData
  ): Promise<SubmissionResult> => {
    try {
      console.log('useTaskSubmission.submitTask - Starting submission with data:', taskData);

      // Validate task data
      const validationResult = validateCreateTask({
        title: taskData.title,
        description: taskData.description || undefined,
        url: taskData.url || undefined,
        dueDate: taskData.dueDate || undefined,
        pinned: taskData.pinned,
        assigneeId: taskData.assigneeId || undefined,
        priority: taskData.priority || 'medium',
      });

      if (!validationResult.isValid) {
        console.log('useTaskSubmission.submitTask - Validation failed:', validationResult.errors);
        showValidationErrors(validationResult.errors);
        return { success: false, error: 'Validation failed' };
      }

      // Get current user if no assignee specified
      let finalAssigneeId = taskData.assigneeId;
      if (!finalAssigneeId) {
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          return { success: false, error: 'Failed to get current user' };
        }
        finalAssigneeId = userResponse.data;
      }

      // Prepare service data
      const serviceData = {
        title: taskData.title.trim(),
        description: taskData.description || undefined,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined,
        photoUrl: taskData.photoUrl,
        urlLink: taskData.url || undefined,
        assigneeId: finalAssigneeId,
        pinned: taskData.pinned,
      };

      console.log('useTaskSubmission.submitTask - Service data prepared:', serviceData);

      // Submit to API
      const response = await TaskService.create(serviceData);

      if (!response.success) {
        console.error('useTaskSubmission.submitTask - API error:', response.error);
        throw new Error(response.error?.message || 'Failed to create task');
      }

      console.log('useTaskSubmission.submitTask - Task created successfully:', response.data);

      // Invalidate queries to refresh task lists
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

      // Show success message
      toast.success('Task created successfully');

      return { 
        success: true, 
        taskId: response.data?.id 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      console.error('useTaskSubmission.submitTask - Error:', error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [queryClient, validateCreateTask, showValidationErrors]);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (
    taskId: string,
    updates: Partial<SubmitTaskData>
  ): Promise<SubmissionResult> => {
    try {
      const response = await TaskService.update(taskId, {
        title: updates.title,
        description: updates.description,
        dueDate: updates.dueDate,
        photoUrl: updates.photoUrl,
        urlLink: updates.url,
        pinned: updates.pinned,
        assigneeId: updates.assigneeId,
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update task');
      }

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] });

      toast.success('Task updated successfully');

      return { success: true, taskId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [queryClient]);

  return {
    submitTask,
    updateTask,
  };
} 

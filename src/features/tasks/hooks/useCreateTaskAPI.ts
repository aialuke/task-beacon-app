import { useCallback } from 'react';
import { TaskService, type TaskCreateData as ServiceTaskCreateData } from '@/lib/api/tasks/task.service';
import { AuthService } from '@/lib/api/base';
import { useTaskValidation } from '@/hooks/useTaskValidation';

interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl?: string | null;
}

/**
 * Hook for API operations related to task creation with validation
 */
export function useCreateTaskAPI() {
  const { validateTask } = useTaskValidation();

  const executeCreateTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      // Validate data before sending to database
      const validationResult = validateTask({
        title: taskData.title,
        description: taskData.description || null,
        url_link: taskData.url || null,
        due_date: taskData.dueDate || null,
      });

      if (!validationResult.isValid) {
        return { success: false, error: 'Validation failed', validation: validationResult };
      }

      const userResponse = await AuthService.getCurrentUserId();
      if (!userResponse.success || !userResponse.data) {
        return { success: false, error: 'Failed to get current user' };
      }
      const currentUserId = userResponse.data;
      const finalAssigneeId = taskData.assigneeId || currentUserId;

      const serviceTaskData: ServiceTaskCreateData = {
        title: taskData.title.trim(),
        description: taskData.description || undefined,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined,
        photoUrl: taskData.photoUrl,
        urlLink: taskData.url || undefined,
        assigneeId: finalAssigneeId,
        pinned: taskData.pinned,
      };

      const response = await TaskService.create(serviceTaskData);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create task');
      }

      return { success: true, error: null, message: 'Task created successfully' };
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        // Check for database constraint violations
        if (error.message.includes('check constraint')) {
          if (error.message.includes('tasks_title_length_check')) {
            errorMessage = 'Task title must be between 1 and 22 characters';
          } else if (error.message.includes('tasks_description_length_check')) {
            errorMessage = 'Description cannot exceed 500 characters';
          } else if (error.message.includes('tasks_url_format_check')) {
            errorMessage = 'Invalid URL format';
          } else {
            errorMessage = 'Data validation failed';
          }
        } else {
          errorMessage = error.message;
        }
      }
      return { success: false, error: errorMessage };
    }
  }, [validateTask]);

  return {
    executeCreateTask,
  };
}

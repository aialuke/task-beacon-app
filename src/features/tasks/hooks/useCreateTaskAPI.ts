
import { useCallback } from 'react';
import { createTask } from '@/integrations/supabase/api/tasks.api';
import { getCurrentUserId } from '@/integrations/supabase/api/base.api';
import { useDataValidation } from '@/hooks/useDataValidation';
import { toast } from '@/lib/toast';

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
  const { validateTask } = useDataValidation();

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
        return { success: false, error: 'Validation failed' };
      }

      const currentUserId = await getCurrentUserId();
      const finalAssigneeId = taskData.assigneeId || currentUserId;

      const { error } = await createTask({
        title: taskData.title.trim(),
        description: taskData.description || null,
        due_date: new Date(taskData.dueDate).toISOString(),
        photo_url: taskData.photoUrl,
        url_link: taskData.url || null,
        assignee_id: finalAssigneeId,
        pinned: taskData.pinned,
      });

      if (error) throw error;

      toast.success('Task created successfully');
      return { success: true, error: null };
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
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [validateTask]);

  return {
    executeCreateTask,
  };
}

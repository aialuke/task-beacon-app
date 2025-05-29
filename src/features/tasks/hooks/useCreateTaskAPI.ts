import { useCallback } from 'react';
import { createTask } from '@/integrations/supabase/api/tasks.api';
import { getCurrentUserId } from '@/integrations/supabase/api/base.api';
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
 * Hook for API operations related to task creation
 */
export function useCreateTaskAPI() {
  const executeCreateTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      const currentUserId = await getCurrentUserId();
      const finalAssigneeId = taskData.assigneeId || currentUserId;

      const { error } = await createTask({
        title: taskData.title,
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    executeCreateTask,
  };
}

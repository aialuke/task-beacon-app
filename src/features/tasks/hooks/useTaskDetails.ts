
import { useState, useEffect } from 'react';
import { Task } from '@/types/shared.types';
import { getTask } from '@/integrations/supabase/api/tasks.api';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseTaskDetailsReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

/**
 * Custom hook for fetching and managing task details
 *
 * @param taskId - The ID of the task to fetch
 * @returns Object containing task data, loading state, and pin management
 */
export function useTaskDetails(
  taskId: string | undefined
): UseTaskDetailsReturn {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task ID provided');
        setLoading(false);
        return;
      }

      if (!user || !session) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const taskData = await getTask(taskId);
        setTask(taskData);
        setIsPinned(taskData.pinned);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, user, session]);

  return {
    task,
    loading,
    error,
    isPinned,
    setIsPinned,
  };
}

import { useState, useEffect } from 'react';
import { Task } from '@/types/shared.types';
import { supabase, isMockingSupabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

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

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isMockingSupabase) {
          const { mockDataTasks } = await import('@/lib/mockDataTasks');
          const mockTask = mockDataTasks.find(t => t.id === taskId);
          if (mockTask) {
            setTask(mockTask);
            setIsPinned(mockTask.pinned);
          } else {
            setError('Task not found');
            toast.error('Task not found');
          }
          return;
        }

        // Use type assertion to work around empty Database type
        const { data, error: supabaseError } = await (supabase as any)
          .from('tasks')
          .select(
            `
            *,
            parent_task:parent_task_id (
              title,
              description,
              photo_url,
              url_link
            )
          `
          )
          .eq('id', taskId)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (data) {
          setTask(data as Task);
          setIsPinned(data.pinned);
        } else {
          setError('Task not found');
          toast.error('Task not found');
        }
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
  }, [taskId]);

  return {
    task,
    loading,
    error,
    isPinned,
    setIsPinned,
  };
}

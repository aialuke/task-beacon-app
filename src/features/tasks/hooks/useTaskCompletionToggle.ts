
import { useState, useCallback } from 'react';
import { Task } from '@/lib/types';
import { toast } from '@/lib/toast';

type ToggleTaskCompleteFn = (task: Task) => Promise<void>;

interface UseTaskCompletionToggleResult {
  loading: boolean;
  handleToggleComplete: () => Promise<void>;
}

export function useTaskCompletionToggle(task: Task, toggleTaskComplete: ToggleTaskCompleteFn): UseTaskCompletionToggleResult {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    try {
      await toggleTaskComplete(task);
      const statusText = task.status === "complete" ? 'reopened' : 'completed';
      toast.success(`Task ${statusText} successfully`);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  }, [task, toggleTaskComplete]);

  return { loading, handleToggleComplete };
}

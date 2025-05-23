
import { useState, useCallback } from 'react';
import { Task } from '@/lib/types';

type ToggleTaskCompleteFn = (task: Task) => Promise<void>;

export function useTaskCompletionToggle(task: Task, toggleTaskComplete: ToggleTaskCompleteFn) {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    try {
      await toggleTaskComplete(task);
    } finally {
      setLoading(false);
    }
  }, [task, toggleTaskComplete]);

  return { loading, handleToggleComplete };
}

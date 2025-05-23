
import { useState, useCallback } from 'react';
import { Task } from '@/lib/types';

type ToggleTaskCompleteFn = (task: Task) => Promise<void>;

interface UseTaskCompletionToggleResult {
  loading: boolean;
  handleToggleComplete: () => Promise<void>;
}

/**
 * Custom hook for handling task completion toggle UI state
 *
 * Manages loading state and provides a standardized handler for completion toggle
 * 
 * @param task - The task to toggle completion for
 * @param toggleTaskComplete - Function to toggle task completion state
 * @returns Object containing loading state and toggle handler
 */
export function useTaskCompletionToggle(task: Task, toggleTaskComplete: ToggleTaskCompleteFn): UseTaskCompletionToggleResult {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    try {
      await toggleTaskComplete(task);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    } finally {
      setLoading(false);
    }
  }, [task, toggleTaskComplete]);

  return { loading, handleToggleComplete };
}

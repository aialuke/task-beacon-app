
import { useState, useCallback, useRef } from 'react';
import { useTaskRealtime } from '@/hooks/useTaskRealtime';

/**
 * Hook for tracking real-time task updates and showing visual indicators
 */
export function useRealtimeTaskUpdates() {
  const [updatedTasks, setUpdatedTasks] = useState<Set<string>>(new Set());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const { isSubscribed } = useTaskRealtime();

  const markTaskAsUpdated = useCallback((taskId: string, duration = 3000) => {
    setUpdatedTasks(prev => new Set(prev).add(taskId));

    // Clear existing timeout for this task
    const existingTimeout = timeoutsRef.current.get(taskId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to remove the indicator
    const timeout = setTimeout(() => {
      setUpdatedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      timeoutsRef.current.delete(taskId);
    }, duration);

    timeoutsRef.current.set(taskId, timeout);
  }, []);

  const isTaskUpdated = useCallback((taskId: string) => {
    return updatedTasks.has(taskId);
  }, [updatedTasks]);

  return {
    isSubscribed,
    markTaskAsUpdated,
    isTaskUpdated,
    updatedTasksCount: updatedTasks.size,
  };
}

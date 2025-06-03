import { useMemo } from 'react';
import type { Task, TaskFilter } from '@/types';

/**
 * Hook for filtering tasks based on the selected filter
 *
 * @param tasks - Array of tasks to filter
 * @param filter - Current filter selection
 * @returns Filtered array of tasks
 */
export function useFilteredTasks(tasks: Task[], filter: TaskFilter) {
  // Optimized: Create filter functions only once and memoize the result
  return useMemo(() => {
    // Defensive check: ensure tasks is an array
    if (!Array.isArray(tasks)) {
      console.warn('useFilteredTasks received non-array tasks:', tasks);
      return [];
    }

    switch (filter) {
      case 'all':
        return tasks.filter((task) => task.status !== 'complete');
      case 'assigned':
        return tasks.filter(
          (task) =>
            task.owner_id &&
            task.assignee_id &&
            task.owner_id !== task.assignee_id
        );
      case 'overdue':
        return tasks.filter((task) => {
          if (task.status === 'complete') return false;
          const dueDate = task.due_date ? new Date(task.due_date) : new Date();
          return dueDate < new Date();
        });
      case 'complete':
        return tasks.filter((task) => task.status === 'complete');
      case 'pending':
        return tasks.filter((task) => {
          if (task.status === 'complete') return false;
          const dueDate = task.due_date ? new Date(task.due_date) : new Date();
          return dueDate >= new Date();
        });
      default:
        return tasks;
    }
  }, [tasks, filter]);
}

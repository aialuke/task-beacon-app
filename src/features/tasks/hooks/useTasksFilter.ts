import { useMemo } from 'react';
import type { Task, TaskFilter } from '@/types';

/**
 * Standardized hook for filtering tasks
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Tasks, Entity: -, Action: Filter
 */
export function useTasksFilter(tasks: Task[], filter: TaskFilter) {
  return useMemo(() => {
    if (!Array.isArray(tasks)) {
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

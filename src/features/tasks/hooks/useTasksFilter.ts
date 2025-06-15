
import { useMemo } from 'react';

import { sortByProperty, groupBy, paginateArray } from '@/lib/utils/data';
import type { Task, TaskFilter } from '@/types';

/**
 * Standardized hook for filtering and organizing tasks
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Tasks, Entity: -, Action: Filter
 */
export function useTasksFilter(
  tasks: Task[], 
  filter: TaskFilter, 
  options?: {
    groupBy?: keyof Task;
    pagination?: { page: number; pageSize: number };
  }
) {
  return useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }

    let filteredTasks: Task[];

    switch (filter) {
      case 'all':
        filteredTasks = tasks.filter((task) => task.status !== 'complete');
        break;
      case 'assigned':
        filteredTasks = tasks.filter(
          (task) =>
            task.owner_id &&
            task.assignee_id &&
            task.owner_id !== task.assignee_id
        );
        break;
      case 'overdue':
        filteredTasks = tasks.filter((task) => {
          if (task.status === 'complete') return false;
          const dueDate = task.due_date ? new Date(task.due_date) : new Date();
          return dueDate < new Date();
        });
        break;
      case 'complete':
        filteredTasks = tasks.filter((task) => task.status === 'complete');
        break;
      case 'pending':
        filteredTasks = tasks.filter((task) => {
          if (task.status === 'complete') return false;
          const dueDate = task.due_date ? new Date(task.due_date) : new Date();
          return dueDate >= new Date();
        });
        break;
      default:
        filteredTasks = tasks;
    }

    // Sort filtered tasks by priority (high first) and then by due date
    const sortedTasks = sortByProperty(
      sortByProperty(filteredTasks, 'due_date', 'asc'),
      'priority',
      'desc'
    );

    // Apply pagination if requested
    let finalTasks = sortedTasks;
    if (options?.pagination) {
      finalTasks = paginateArray(sortedTasks, options.pagination.page, options.pagination.pageSize);
    }

    // Group tasks if requested
    if (options?.groupBy) {
      return groupBy(finalTasks, options.groupBy);
    }

    return finalTasks;
  }, [tasks, filter, options]);
}

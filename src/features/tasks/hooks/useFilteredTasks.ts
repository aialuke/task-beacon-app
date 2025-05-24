
import { useMemo } from "react";
import { Task } from "@/lib/types";
import { TaskFilter } from "../types";
import { TaskService } from "../services/taskService";

/**
 * Hook for filtering tasks using the task service
 * 
 * This hook now delegates the filtering logic to the TaskService,
 * focusing only on memoization and React-specific concerns.
 * 
 * @param tasks - Array of tasks to filter
 * @param filter - Current filter selection
 * @returns Filtered array of tasks
 */
export function useFilteredTasks(
  tasks: Task[],
  filter: TaskFilter
) {
  // Use the service layer for filtering logic
  return useMemo(() => {
    return TaskService.filterTasks(tasks, filter);
  }, [tasks, filter]);
}

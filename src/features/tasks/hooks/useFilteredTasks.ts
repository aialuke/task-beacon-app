
import { useMemo } from "react";
import { Task } from "@/lib/types";
import { TaskFilter } from "../types";

/**
 * Hook for filtering tasks based on the selected filter
 * 
 * @param tasks - Array of tasks to filter
 * @param filter - Current filter selection
 * @returns Filtered array of tasks
 */
export function useFilteredTasks(
  tasks: Task[],
  filter: TaskFilter
) {
  // Memoize filter functions separately to prevent recreating them on every render
  const filterFunctions = useMemo(() => ({
    all: (task: Task) => task.status !== "complete",
    assigned: (task: Task) => 
      task.owner_id && 
      task.assignee_id && 
      task.owner_id !== task.assignee_id,
    overdue: (task: Task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate < now && task.status !== "complete";
    },
    complete: (task: Task) => task.status === "complete",
    pending: (task: Task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate >= now && task.status !== "complete";
    }
  }), []); // These functions don't depend on any props, so they're created only once

  // Apply the selected filter function to the tasks array
  return useMemo(() => {
    const filterFunction = filterFunctions[filter];
    return tasks.filter(filterFunction);
  }, [tasks, filter, filterFunctions]); // Only re-run when tasks or filter change
}

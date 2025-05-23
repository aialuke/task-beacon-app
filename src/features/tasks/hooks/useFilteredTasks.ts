
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
  return useMemo(() => {
    if (filter === "all") {
      // For "all" filter, show all non-completed tasks
      return tasks.filter((task) => task.status !== "complete");
    }
    
    if (filter === "assigned") {
      // For "assigned" filter, check if the task is assigned to someone other than the owner
      return tasks.filter((task) => 
        task.owner_id && 
        task.assignee_id && 
        task.owner_id !== task.assignee_id
      );
    }
    
    if (filter === "overdue") {
      // For "overdue" filter, check if the due date is in the past and task is not complete
      return tasks.filter((task) => {
        const dueDate = task.due_date ? new Date(task.due_date) : new Date();
        const now = new Date();
        return dueDate < now && task.status !== "complete";
      });
    }
    
    if (filter === "complete") {
      // For "complete" filter, show only completed tasks
      return tasks.filter((task) => task.status === "complete");
    }
    
    // For "pending" filter, show tasks that are not overdue and not complete
    return tasks.filter((task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate >= now && task.status !== "complete";
    });
  }, [tasks, filter]);
}

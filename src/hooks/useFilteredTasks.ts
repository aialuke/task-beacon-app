
import { useMemo } from "react";
import { Task } from "@/lib/types";

export function useFilteredTasks(
  tasks: Task[],
  filter: "all" | "pending" | "overdue" | "complete"
) {
  return useMemo(() => {
    if (filter === "all") {
      // For "Current" filter, exclude completed tasks
      return tasks.filter((task) => task.status !== "complete");
    }
    
    if (filter === "overdue") {
      return tasks.filter((task) => {
        const dueDate = task.due_date ? new Date(task.due_date) : new Date();
        const now = new Date();
        return dueDate < now && task.status !== "complete";
      });
    }
    
    if (filter === "complete") {
      return tasks.filter((task) => task.status === "complete");
    }
    
    // For "pending" filter
    return tasks.filter((task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      return dueDate >= now && task.status !== "complete";
    });
  }, [tasks, filter]);
}

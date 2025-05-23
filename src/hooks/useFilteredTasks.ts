
import { useMemo } from "react";
import { Task } from "@/lib/types";
import { TaskFilter } from "@/contexts/task/types";
import { supabase } from "@/lib/supabase";

export function useFilteredTasks(
  tasks: Task[],
  filter: TaskFilter
) {
  return useMemo(() => {
    if (filter === "all") {
      // For "Current" filter, exclude completed tasks
      return tasks.filter((task) => task.status !== "complete");
    }
    
    if (filter === "assigned") {
      // For "assigned" filter, we need to check if the current user is the owner
      // and the task is assigned to someone else
      // We can't reliably get the current user ID in a useMemo, so we'll
      // filter based on whether assignee_id exists and is different from owner_id
      return tasks.filter((task) => 
        task.owner_id && 
        task.assignee_id && 
        task.owner_id !== task.assignee_id
      );
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

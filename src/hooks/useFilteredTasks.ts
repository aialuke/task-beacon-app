
import { useMemo } from "react";
import { Task } from "@/lib/types";
import { TaskFilter } from "@/contexts/task/types";
import { supabase } from "@/lib/supabase";

export function useFilteredTasks(
  tasks: Task[],
  filter: TaskFilter
) {
  // Get the current user ID
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  };

  return useMemo(() => {
    if (filter === "all") {
      // For "Current" filter, exclude completed tasks
      return tasks.filter((task) => task.status !== "complete");
    }
    
    if (filter === "assigned") {
      // Show tasks that the current user has assigned to others (owner_id is current user, but assignee_id is someone else)
      return tasks.filter((task) => {
        // In a synchronous useMemo we can't use async getCurrentUserId directly
        // This is simplified - in production you'd want to get this from a context or store
        const { data } = supabase.auth.getSession();
        const currentUserId = data?.session?.user.id;
        
        return task.owner_id === currentUserId && 
               task.assignee_id !== null && 
               task.assignee_id !== currentUserId;
      });
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

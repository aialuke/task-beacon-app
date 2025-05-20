
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/lib/supabase";

export function useTaskQueries() {
  // Fetch tasks query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (isMockingSupabase) {
        const { mockDataTasks } = await import("@/lib/mockDataTasks");
        return mockDataTasks;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          parent_task:parent_task_id (
            title,
            description,
            photo_url,
            url_link
          )
        `)
        .order("pinned", { ascending: false })
        .order("due_date", { ascending: true });

      if (error) throw new Error(error.message);
      return data as Task[];
    }
  });

  return {
    tasks: tasks || [],
    isLoading,
    error: error as Error | null
  };
}


import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "@/integrations/supabase/api/tasks.api";

export function useTaskQueries() {
  // Fetch tasks query
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks
  });

  return {
    tasks: response?.data || [],
    isLoading,
    error: error || response?.error || null
  };
}

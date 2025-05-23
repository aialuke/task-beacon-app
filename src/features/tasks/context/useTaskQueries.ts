
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "@/integrations/supabase/api/tasks.api";

/**
 * Hook for querying task data using React Query
 * 
 * @returns Object containing tasks array, loading state, and any error
 */
export function useTaskQueries() {
  // Fetch tasks query
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllTasks()
  });

  return {
    tasks: response?.data?.data || [],
    isLoading,
    error: error || response?.error || null
  };
}

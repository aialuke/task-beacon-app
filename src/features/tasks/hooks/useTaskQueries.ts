
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllTasks } from "@/integrations/supabase/api/tasks.api";
import { useState } from "react";

/**
 * Custom hook for paginated task queries
 * 
 * @param pageSize Number of tasks to fetch per page
 * @returns Object containing tasks array, loading state, pagination controls and error
 */
export function useTaskQueries(pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  
  // Fetch tasks with pagination
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    isPreviousData
  } = useQuery({
    queryKey: ["tasks", currentPage, pageSize],
    queryFn: () => getAllTasks(currentPage, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true // Keep previous page data while fetching new page
  });

  // Prefetch next page
  const hasNextPage = response?.hasNextPage || false;
  
  // Prefetch next page if available
  if (hasNextPage && !isPreviousData) {
    queryClient.prefetchQuery({
      queryKey: ["tasks", currentPage + 1, pageSize],
      queryFn: () => getAllTasks(currentPage + 1, pageSize),
      staleTime: 5 * 60 * 1000
    });
  }

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToNextPage: () => setCurrentPage(old => old + 1),
    goToPreviousPage: () => setCurrentPage(old => Math.max(1, old - 1)),
    isLoading,
    isFetching,
    error: error || response?.error || null
  };
}

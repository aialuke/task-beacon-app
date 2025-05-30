
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllTasks } from '@/integrations/supabase/api/tasks.api';
import { useState } from 'react';
import { Task } from '@/types/shared.types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook for paginated task queries with real database integration
 *
 * @param pageSize Number of tasks to fetch per page
 * @returns Object containing tasks array, loading state, pagination controls and error
 */
export function useTaskQueries(pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Fetch tasks with database-level pagination - only if user is authenticated
  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', currentPage, pageSize, user?.id],
    queryFn: () => getAllTasks(currentPage, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user && !!session, // Only run query if user is authenticated
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Determine if we have a next page
  const hasNextPage = response?.data?.hasNextPage || false;

  // Prefetch next page if available and user is authenticated
  if (hasNextPage && user && session && !isLoading) {
    queryClient.prefetchQuery({
      queryKey: ['tasks', currentPage + 1, pageSize, user.id],
      queryFn: () => getAllTasks(currentPage + 1, pageSize),
      staleTime: 5 * 60 * 1000,
    });
  }

  return {
    tasks: response?.data?.data || [],
    totalCount: response?.data?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToNextPage: () => setCurrentPage(old => old + 1),
    goToPreviousPage: () => setCurrentPage(old => Math.max(1, old - 1)),
    isLoading,
    isFetching,
    error: error || response?.error || null,
  };
}


import { useState } from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks.service';
import { useAuth } from '@/hooks/useAuth';

// Clean imports from organized type system
import type { Task } from '@/types';

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
    queryFn: async () => {
      const response = await TaskService.getMany({
        page: currentPage,
        pageSize: pageSize,
        assignedToMe: false, // Get all tasks, not just assigned to current user
      });
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load tasks');
      }
      return {
        data: response.data.data,
        totalCount: response.data.pagination.totalCount,
        hasNextPage: response.data.pagination.hasNextPage,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user && !!session, // Only run query if user is authenticated
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Determine if we have a next page
  const hasNextPage = response?.hasNextPage || false;

  // Prefetch next page if available and user is authenticated
  if (hasNextPage && user && session && !isLoading) {
    queryClient.prefetchQuery({
      queryKey: ['tasks', currentPage + 1, pageSize, user.id],
      queryFn: async () => {
        const response = await TaskService.getMany({
          page: currentPage + 1,
          pageSize: pageSize,
          assignedToMe: false,
        });
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to load tasks');
        }
        return {
          data: response.data.data,
          totalCount: response.data.pagination.totalCount,
          hasNextPage: response.data.pagination.hasNextPage,
        };
      },
      staleTime: 5 * 60 * 1000,
    });
  }

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToNextPage: () => setCurrentPage((old) => old + 1),
    goToPreviousPage: () => setCurrentPage((old) => Math.max(1, old - 1)),
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
  };
}

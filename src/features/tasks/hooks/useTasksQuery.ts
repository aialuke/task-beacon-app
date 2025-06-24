import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/core/auth';
import { usePagination } from '@/hooks/usePagination';
import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import type { Task } from '@/types';

interface UseTasksQueryOptions {
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

interface UseTasksQueryReturn {
  tasks: Task[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToPage: (page: number) => void;
  };
  isFetching: boolean;
  refetch: () => void;
}

/**
 * Optimized hook for paginated task queries - Phase 3 Refactored
 *
 * Now uses the centralized usePagination hook for state management.
 * Eliminates scattered pagination logic and provides clean abstraction.
 */
export function useTasksQuery(
  options: UseTasksQueryOptions = {},
): UseTasksQueryReturn {
  const { pageSize = 10, onPageChange } = options;
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Use centralized pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: pageSize,
    onPageChange,
  });

  // Optimized query key structure
  const queryKey = [
    ...QueryKeys.tasks,
    'paginated',
    pagination.currentPage,
    pagination.pageSize,
    user?.id,
  ];

  // Fetch tasks with enhanced caching - Suspense handles loading/error states
  const {
    data: response,
    isFetching,
    refetch,
  } = useSuspenseQuery({
    queryKey,
    queryFn: async () => {
      return await TaskService.query.getMany({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        assignedToMe: false,
      });
    },
    select: response => {
      // Transform the response data safely
      if (response.success) {
        return {
          data: response.data.data,
          totalCount: response.data.pagination.totalCount,
        };
      }
      // For failed responses, let error handling be done via onError
      throw new Error(response.error?.message ?? 'Failed to load tasks');
    },
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    enabled: !!user && !!session,
    retry: (failureCount, error) => {
      // Smart retry logic
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    networkMode: 'offlineFirst',
  });

  // Update pagination total count when data changes
  if (response?.totalCount && response.totalCount !== pagination.totalCount) {
    pagination.setTotalCount(response.totalCount);
  }

  // Intelligent prefetching - only when beneficial
  const shouldPrefetch =
    pagination.hasNextPage && response?.data.length === pagination.pageSize;

  if (shouldPrefetch && user && session) {
    const nextPageKey = [
      ...QueryKeys.tasks,
      'paginated',
      pagination.currentPage + 1,
      pagination.pageSize,
      user.id,
    ];

    // Check if next page is already cached
    const existingData = queryClient.getQueryData(nextPageKey);

    if (!existingData) {
      queryClient.prefetchQuery({
        queryKey: nextPageKey,
        queryFn: async () => {
          const response = await TaskService.query.getMany({
            page: pagination.currentPage + 1,
            pageSize: pagination.pageSize,
            assignedToMe: false,
          });

          if (!response.success) {
            throw new Error(
              response.error?.message ?? 'Failed to prefetch tasks',
            );
          }

          return {
            data: response.data.data,
            totalCount: response.data.pagination.totalCount,
          };
        },
      });
    }
  }

  return {
    tasks: response?.data ?? [],
    totalCount: response?.totalCount ?? 0,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      pageSize: pagination.pageSize,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
      goToNextPage: pagination.goToNextPage,
      goToPreviousPage: pagination.goToPreviousPage,
      goToPage: pagination.goToPage,
    },
    isFetching,
    refetch: () => refetch(),
  };
}

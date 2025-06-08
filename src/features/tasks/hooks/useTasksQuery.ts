
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks';
import { QueryKeys, createLoadingState } from '@/lib/api/standardized-api';
import { useAuth } from '@/hooks/core';
import { usePagination } from '@/hooks/usePagination';
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
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Optimized hook for paginated task queries - Phase 3 Refactored
 * 
 * Now uses the centralized usePagination hook for state management.
 * Eliminates scattered pagination logic and provides clean abstraction.
 */
export function useTasksQuery(options: UseTasksQueryOptions = {}): UseTasksQueryReturn {
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
  const queryKey = [...QueryKeys.tasks, 'paginated', pagination.currentPage, pagination.pageSize, user?.id];

  // Fetch tasks with enhanced caching and error handling
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await TaskService.query.getMany({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        assignedToMe: false,
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load tasks');
      }
      
      return {
        data: response.data.data,
        totalCount: response.data.pagination.totalCount,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for better UX
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
  const shouldPrefetch = pagination.hasNextPage && !isLoading && response?.data.length === pagination.pageSize;
  
  if (shouldPrefetch && user && session) {
    const nextPageKey = [...QueryKeys.tasks, 'paginated', pagination.currentPage + 1, pagination.pageSize, user.id];
    
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
            throw new Error(response.error?.message || 'Failed to prefetch tasks');
          }
          
          return {
            data: response.data.data,
            totalCount: response.data.pagination.totalCount,
          };
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  }

  // Standardized loading state
  const loadingState = createLoadingState(isLoading, isFetching, error);

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
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
    isLoading: loadingState.isLoading,
    isFetching: loadingState.isFetching,
    error: loadingState.error,
    refetch: () => refetch(),
  };
}

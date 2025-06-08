
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { QueryKeys, createLoadingState } from '@/lib/api/standardized-api';
import { useAuth } from '@/hooks/useAuth';
import type { Task } from '@/types';

interface UseTasksQueryReturn {
  tasks: Task[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Optimized hook for paginated task queries - Phase 2 Implementation
 * 
 * Enhanced with improved caching, memoization, and performance optimizations.
 */
export function useTasksQuery(pageSize = 10): UseTasksQueryReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Optimized query key structure
  const queryKey = [...QueryKeys.tasks, 'paginated', currentPage, pageSize, user?.id];

  // Memoized navigation functions to prevent unnecessary re-renders
  const goToNextPage = useCallback(() => {
    setCurrentPage((old) => old + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((old) => Math.max(1, old - 1));
  }, []);

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
        page: currentPage,
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

  // Determine if we have a next page
  const hasNextPage = response?.hasNextPage || false;

  // Intelligent prefetching - only when beneficial
  const shouldPrefetch = hasNextPage && !isLoading && response?.data.length === pageSize;
  
  if (shouldPrefetch && user && session) {
    const nextPageKey = [...QueryKeys.tasks, 'paginated', currentPage + 1, pageSize, user.id];
    
    // Check if next page is already cached
    const existingData = queryClient.getQueryData(nextPageKey);
    
    if (!existingData) {
      queryClient.prefetchQuery({
        queryKey: nextPageKey,
        queryFn: async () => {
          const response = await TaskService.query.getMany({
            page: currentPage + 1,
            pageSize: pageSize,
            assignedToMe: false,
          });
          
          if (!response.success) {
            throw new Error(response.error?.message || 'Failed to prefetch tasks');
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
  }

  // Standardized loading state
  const loadingState = createLoadingState(isLoading, isFetching, error);

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToNextPage,
    goToPreviousPage,
    isLoading: loadingState.isLoading,
    isFetching: loadingState.isFetching,
    error: loadingState.error,
    refetch: () => refetch(),
  };
}
// CodeRabbit review

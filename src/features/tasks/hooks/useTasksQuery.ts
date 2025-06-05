
import { useState } from 'react';
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
 * Standardized hook for paginated task queries - Phase 2 Implementation
 * 
 * Uses standardized query keys and error handling patterns.
 * Optimized with prefetching and consistent loading states.
 */
export function useTasksQuery(pageSize = 10): UseTasksQueryReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Use standardized query key
  const queryKey = [...QueryKeys.tasks, currentPage, pageSize, user?.id];

  // Fetch tasks with standardized error handling
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await TaskService.getMany({
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user && !!session,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Determine if we have a next page
  const hasNextPage = response?.hasNextPage || false;

  // Prefetch next page if available (optimized data flow)
  if (hasNextPage && user && session && !isLoading) {
    const nextPageKey = [...QueryKeys.tasks, currentPage + 1, pageSize, user.id];
    
    queryClient.prefetchQuery({
      queryKey: nextPageKey,
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

  // Standardized loading state
  const loadingState = createLoadingState(isLoading, isFetching, error);

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToNextPage: () => setCurrentPage((old) => old + 1),
    goToPreviousPage: () => setCurrentPage((old) => Math.max(1, old - 1)),
    isLoading: loadingState.isLoading,
    isFetching: loadingState.isFetching,
    error: loadingState.error,
    refetch: () => refetch(),
  };
}

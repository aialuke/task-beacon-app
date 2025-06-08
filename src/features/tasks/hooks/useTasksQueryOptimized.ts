
/**
 * Optimized Tasks Query Hook - Phase 3.1 Implementation
 * 
 * Enhanced version of useTasksQuery with improved caching, prefetching, and error handling.
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
import { QueryKeys } from '@/lib/api/standardized-api';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedQuery } from '@/hooks/queries/useOptimizedQueries';
import { useStandardizedLoading } from '@/hooks/queries/useStandardizedLoading';
import { useEnhancedErrorHandling } from '@/hooks/queries/useEnhancedErrorHandling';
import type { Task } from '@/types';

interface UseTasksQueryOptimizedReturn {
  tasks: Task[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  loadingState: ReturnType<typeof useStandardizedLoading>;
  error: string | null;
  refetch: () => void;
  prefetchNextPage: () => void;
}

/**
 * Optimized hook for paginated task queries with enhanced performance
 */
export function useTasksQueryOptimized(pageSize = 10): UseTasksQueryOptimizedReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, session } = useAuth();
  const { createErrorHandler } = useEnhancedErrorHandling({
    operation: 'fetch_tasks',
    component: 'TasksQuery',
  });

  // Optimized query key structure
  const queryKey = [...QueryKeys.tasks, 'paginated', currentPage, pageSize, user?.id];

  // Enhanced query with optimized configuration
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    isInitialLoading,
    refetch,
  } = useOptimizedQuery(
    queryKey,
    async () => {
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
    {
      type: 'content',
      enabled: !!user && !!session,
      staleTime: 3 * 60 * 1000, // 3 minutes for task data
    }
  );

  // Standardized loading state
  const loadingState = useStandardizedLoading({
    isLoading,
    isInitialLoading,
    isFetching,
    error,
    data: response?.data,
    hasData: (response?.data?.length ?? 0) > 0,
  });

  // Enhanced navigation with prefetching
  const goToNextPage = useCallback(() => {
    setCurrentPage((old) => old + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((old) => Math.max(1, old - 1));
  }, []);

  // Intelligent prefetching
  const prefetchNextPage = useCallback(() => {
    if (!response?.hasNextPage || !user || !session) return;
    
    const nextPageKey = [...QueryKeys.tasks, 'paginated', currentPage + 1, pageSize, user.id];
    
    // Check if already cached
    if (queryClient.getQueryData(nextPageKey)) return;
    
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
      staleTime: 3 * 60 * 1000,
    });
  }, [response?.hasNextPage, user, session, currentPage, pageSize, queryClient]);

  // Auto-prefetch when near the end
  const shouldAutoPrefetch = response?.hasNextPage && 
    response?.data?.length === pageSize && 
    !loadingState.isLoading;
    
  if (shouldAutoPrefetch) {
    // Use setTimeout to avoid prefetching during render
    setTimeout(prefetchNextPage, 0);
  }

  return {
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    currentPage,
    pageSize,
    hasNextPage: response?.hasNextPage || false,
    hasPreviousPage: currentPage > 1,
    goToNextPage,
    goToPreviousPage,
    loadingState,
    error: loadingState.error,
    refetch: () => {
      refetch().catch(createErrorHandler('refetch_tasks'));
    },
    prefetchNextPage,
  };
}
// CodeRabbit review
// CodeRabbit review

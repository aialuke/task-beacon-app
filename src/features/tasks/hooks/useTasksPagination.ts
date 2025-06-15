/**
 * Task Pagination Hook - Phase 1 Simplified
 * 
 * Focused hook for paginated task queries only.
 * Separated from basic query concerns for single responsibility.
 */

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/core';
import { usePagination } from '@/hooks/usePagination';
import { TaskService } from '@/lib/api/tasks';
import { handleError } from '@/lib/core/ErrorHandler';
import type { Task } from '@/types';

interface UseTasksPaginationOptions {
  pageSize?: number;
  onPageChange?: (page: number) => void;
  assignedToMe?: boolean;
  enabled?: boolean;
}

export function useTasksPagination(options: UseTasksPaginationOptions = {}) {
  const { 
    pageSize = 10, 
    onPageChange, 
    assignedToMe = false, 
    enabled = true 
  } = options;
  
  const { user, session } = useAuth();

  // Use centralized pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: pageSize,
    onPageChange,
  });

  // Fetch paginated tasks
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['tasks', 'paginated', pagination.currentPage, pagination.pageSize, assignedToMe, user?.id],
    queryFn: async () => {
      const response = await TaskService.query.getMany({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        assignedToMe,
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load tasks');
      }
      
      return {
        data: response.data.data as Task[],
        totalCount: response.data.pagination.totalCount,
      };
    },
    enabled: enabled && !!user && !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
    throwOnError: (error) => {
      handleError(error, {
        context: 'Tasks Pagination',
        showToast: false,
        logToConsole: true,
      });
      return false;
    },
  });

  // Update pagination total count when data changes
  if (response?.totalCount && response.totalCount !== pagination.totalCount) {
    pagination.setTotalCount(response.totalCount);
  }

  return {
    // Data
    tasks: response?.data || [],
    totalCount: response?.totalCount || 0,
    
    // Pagination controls
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
    
    // Loading states
    isLoading,
    isFetching,
    error: error?.message || null,
    
    // Actions
    refetch,
  };
} 
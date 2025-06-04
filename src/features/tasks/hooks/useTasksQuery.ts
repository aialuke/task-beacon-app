import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/lib/api/tasks/task.service';
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
}

/**
 * Standardized hook for paginated task queries
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Tasks, Entity: -, Action: Query
 */
export function useTasksQuery(pageSize = 10): UseTasksQueryReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Fetch tasks with database-level pagination
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
    enabled: !!user && !!session,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Determine if we have a next page
  const hasNextPage = response?.hasNextPage || false;

  // Prefetch next page if available
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

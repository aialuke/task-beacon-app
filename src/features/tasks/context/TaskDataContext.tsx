import { ReactNode } from 'react';

import { UnifiedErrorBoundary } from '@/components/ui/UnifiedErrorBoundary';
import { useTasksQuery } from '@/features/tasks/hooks/useTasksQuery';

import { TaskDataProvider, type TaskDataContextValue } from './task-data-utils';

interface TaskDataContextProviderProps {
  children: ReactNode;
}

/**
 * Task Data Context Provider - Phase 3 Enhanced
 * 
 * Provides server-side data state with enhanced error handling,
 * loading state management, and recovery mechanisms.
 */
export function TaskDataContextProvider({
  children,
}: TaskDataContextProviderProps) {
  // Use standardized task queries with optimized data flow
  const taskQueries = useTasksQuery();

  // Enhanced context value with error recovery
  const contextValue: TaskDataContextValue = {
    tasks: taskQueries.tasks,
    isLoading: taskQueries.isLoading,
    isFetching: taskQueries.isFetching,
    error: taskQueries.error,
    totalCount: taskQueries.totalCount,
    pagination: {
      currentPage: taskQueries.pagination.currentPage,
      totalPages: taskQueries.pagination.totalPages,
      pageSize: taskQueries.pagination.pageSize || 10, // Access pageSize from the hook's usePagination result
      hasNextPage: taskQueries.pagination.hasNextPage,
      hasPreviousPage: taskQueries.pagination.hasPreviousPage,
      goToNextPage: taskQueries.pagination.goToNextPage,
      goToPreviousPage: taskQueries.pagination.goToPreviousPage,
      goToPage: taskQueries.pagination.goToPage,
    },
    retry: taskQueries.refetch || (() => {
      console.warn('TaskDataContext: No refetch function available for retry');
    }),
  };

  return (
    <UnifiedErrorBoundary
      variant="section"
      onError={(error, errorInfo) => {
        console.error('TaskDataContext Error:', error, errorInfo);
        // Could integrate with error reporting service here
      }}
    >
      <TaskDataProvider value={contextValue}>
        {children}
      </TaskDataProvider>
    </UnifiedErrorBoundary>
  );
}



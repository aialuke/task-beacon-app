import { ReactNode, useMemo } from 'react';

import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { useTasksQuery } from '@/features/tasks/hooks/useTasksQuery';
import { createStandardContext } from '@/lib/utils/createContext';
import type { Task } from '@/types';

interface TaskDataContextValue {
  // Data state (from React Query with Suspense patterns)
  tasks: Task[];
  isFetching: boolean;

  // Pagination object (complete pagination API)
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

  // Pagination metadata
  totalCount: number;

  // Error recovery
  retry: () => void;
}

// Create standardized context
const { Provider: TaskDataProvider, useContext: useTaskDataContext } =
  createStandardContext<TaskDataContextValue>({
    name: 'TaskData',
    errorMessage:
      'useTaskDataContext must be used within a TaskDataContextProvider',
  });

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

  // Enhanced context value with error recovery - optimized with useMemo
  const contextValue: TaskDataContextValue = useMemo(
    () => ({
      tasks: taskQueries.tasks,
      isFetching: taskQueries.isFetching,
      totalCount: taskQueries.totalCount,
      pagination: {
        currentPage: taskQueries.pagination.currentPage,
        totalPages: taskQueries.pagination.totalPages,
        pageSize: taskQueries.pagination.pageSize || 10,
        hasNextPage: taskQueries.pagination.hasNextPage,
        hasPreviousPage: taskQueries.pagination.hasPreviousPage,
        goToNextPage: taskQueries.pagination.goToNextPage,
        goToPreviousPage: taskQueries.pagination.goToPreviousPage,
        goToPage: taskQueries.pagination.goToPage,
      },
      retry:
        taskQueries.refetch ??
        function retryFallback() {
          console.warn('Retry not available - no refetch function provided');
        },
    }),
    [
      taskQueries.tasks,
      taskQueries.isFetching,
      taskQueries.totalCount,
      taskQueries.pagination,
      taskQueries.refetch,
    ],
  );

  return (
    <UnifiedErrorBoundary
      variant="section"
      onError={(error, errorInfo) => {
        console.error('TaskDataContext Error:', error, errorInfo);
        // Could integrate with error reporting service here
      }}
    >
      <TaskDataProvider value={contextValue}>{children}</TaskDataProvider>
    </UnifiedErrorBoundary>
  );
}

// Export the standardized hook
export { useTaskDataContext };

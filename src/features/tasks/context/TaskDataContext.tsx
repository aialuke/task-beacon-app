
import { ReactNode } from 'react';
import { createStandardContext } from '@/lib/utils/createContext';
import type { Task } from '@/types';
import { useTasksQuery } from '@/features/tasks/hooks/useTasksQuery';

interface TaskDataContextValue {
  // Data state (from React Query with standardized patterns)
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  
  // Pagination state and controls
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

// Create standardized context
const { Provider: TaskDataProvider, useContext: useTaskDataContext } = createStandardContext<TaskDataContextValue>({
  name: 'TaskData',
  errorMessage: 'useTaskDataContext must be used within a TaskDataContextProvider'
});

interface TaskDataContextProviderProps {
  children: ReactNode;
}

/**
 * Task Data Context Provider - Phase 2 Optimized
 * 
 * Provides only server-side data state with standardized patterns.
 * Uses optimized query hooks with prefetching and consistent error handling.
 * 
 * Follows the principle: React Query for server state, Context for UI state only.
 */
export function TaskDataContextProvider({
  children,
}: TaskDataContextProviderProps) {
  // Use standardized task queries with optimized data flow
  const taskQueries = useTasksQuery();

  // Provide only data-related state with standardized interface
  const contextValue: TaskDataContextValue = {
    tasks: taskQueries.tasks,
    isLoading: taskQueries.isLoading,
    isFetching: taskQueries.isFetching,
    error: taskQueries.error,
    totalCount: taskQueries.totalCount,
    currentPage: taskQueries.currentPage,
    pageSize: taskQueries.pageSize,
    hasNextPage: taskQueries.hasNextPage,
    hasPreviousPage: taskQueries.hasPreviousPage,
    goToNextPage: taskQueries.goToNextPage,
    goToPreviousPage: taskQueries.goToPreviousPage,
  };

  return (
    <TaskDataProvider value={contextValue}>
      {children}
    </TaskDataProvider>
  );
}

// Export the standardized hook
export { useTaskDataContext };

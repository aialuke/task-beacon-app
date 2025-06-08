
import { ReactNode } from 'react';
import { createStandardContext } from '@/lib/utils/createContext';
import { TaskErrorBoundary } from '../components/TaskErrorBoundary';
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
  
  // Error recovery
  retry: () => void;
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
    currentPage: taskQueries.currentPage,
    pageSize: taskQueries.pageSize,
    hasNextPage: taskQueries.hasNextPage,
    hasPreviousPage: taskQueries.hasPreviousPage,
    goToNextPage: taskQueries.goToNextPage,
    goToPreviousPage: taskQueries.goToPreviousPage,
    retry: taskQueries.refetch || (() => {}),
  };

  return (
    <TaskErrorBoundary
      onError={(error, errorInfo) => {
        console.error('TaskDataContext Error:', error, errorInfo);
        // Could integrate with error reporting service here
      }}
    >
      <TaskDataProvider value={contextValue}>
        {children}
      </TaskDataProvider>
    </TaskErrorBoundary>
  );
}

// Export the standardized hook
export { useTaskDataContext };
// CodeRabbit review
// CodeRabbit review


/**
 * Optimized Task Data Context - Phase 3 Implementation
 * 
 * Enhanced context with standardized loading states and error handling.
 */

import { ReactNode } from 'react';
import { createStandardContext } from '@/lib/utils/createContext';
import { TaskErrorBoundary } from '../components/TaskErrorBoundary';
import { useTasksQueryOptimized } from '../hooks/useTasksQueryOptimized';
import { useStandardizedLoading, LoadingState } from '@/hooks/queries/useStandardizedLoading';
import { useErrorBoundaryIntegration } from '@/hooks/queries/useEnhancedErrorHandling';
import type { Task } from '@/types';

interface TaskDataContextOptimizedValue {
  // Data state
  tasks: Task[];
  
  // Enhanced loading state
  loadingState: LoadingState;
  
  // Pagination state and controls
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  
  // Performance optimizations
  prefetchNextPage: () => void;
  
  // Error recovery
  retry: () => void;
  
  // Backward compatibility
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}

// Create standardized context
const { Provider: TaskDataProvider, useContext: useTaskDataContextOptimized } = createStandardContext<TaskDataContextOptimizedValue>({
  name: 'TaskDataOptimized',
  errorMessage: 'useTaskDataContextOptimized must be used within a TaskDataContextOptimizedProvider'
});

interface TaskDataContextOptimizedProviderProps {
  children: ReactNode;
}

/**
 * Optimized Task Data Context Provider - Phase 3 Implementation
 */
export function TaskDataContextOptimizedProvider({
  children,
}: TaskDataContextOptimizedProviderProps) {
  const { reportError } = useErrorBoundaryIntegration();
  
  // Use optimized task queries
  const taskQueries = useTasksQueryOptimized();

  // Enhanced context value with standardized patterns
  const contextValue: TaskDataContextOptimizedValue = {
    tasks: taskQueries.tasks,
    loadingState: taskQueries.loadingState,
    totalCount: taskQueries.totalCount,
    currentPage: taskQueries.currentPage,
    pageSize: taskQueries.pageSize,
    hasNextPage: taskQueries.hasNextPage,
    hasPreviousPage: taskQueries.hasPreviousPage,
    goToNextPage: taskQueries.goToNextPage,
    goToPreviousPage: taskQueries.goToPreviousPage,
    prefetchNextPage: taskQueries.prefetchNextPage,
    retry: taskQueries.refetch,
    
    // Backward compatibility
    isLoading: taskQueries.loadingState.isLoading,
    isFetching: taskQueries.loadingState.isFetching,
    error: taskQueries.loadingState.error,
  };

  return (
    <TaskErrorBoundary
      onError={(error, errorInfo) => {
        reportError(error, errorInfo.componentStack ? { componentStack: errorInfo.componentStack } : undefined);
      }}
    >
      <TaskDataProvider value={contextValue}>
        {children}
      </TaskDataProvider>
    </TaskErrorBoundary>
  );
}

// Export the optimized hook
export { useTaskDataContextOptimized };

// Backward compatibility - alias to original name
export const useTaskDataContext = useTaskDataContextOptimized;
export const TaskDataContextProvider = TaskDataContextOptimizedProvider;

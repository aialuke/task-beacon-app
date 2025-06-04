
import { ReactNode } from 'react';
import { createStandardContext } from '@/lib/utils/createContext';

// Clean imports from organized type system  
import type { Task } from '@/types';
import { useTasksQuery } from '@/features/tasks/hooks/useTasksQuery';

interface TaskDataContextValue {
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
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
 * Task Data Context Provider
 * 
 * Provides task data state and pagination controls to child components.
 * Uses the standardized context pattern for consistent error handling.
 */
export function TaskDataContextProvider({
  children,
}: TaskDataContextProviderProps) {
  const taskQueries = useTasksQuery();

  return (
    <TaskDataProvider value={taskQueries}>
      {children}
    </TaskDataProvider>
  );
}

// Export the standardized hook
export { useTaskDataContext };

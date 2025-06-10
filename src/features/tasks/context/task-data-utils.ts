import { createStandardContext } from '@/lib/utils/createContext';
import type { Task } from '@/types';

interface TaskDataContextValue {
  // Data state (from React Query with standardized patterns)
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  
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
const { Provider: TaskDataProvider, useContext: useTaskDataContext } = createStandardContext<TaskDataContextValue>({
  name: 'TaskData',
  errorMessage: 'useTaskDataContext must be used within a TaskDataContextProvider'
});

// Export the context components
export { TaskDataProvider, useTaskDataContext };
export type { TaskDataContextValue };
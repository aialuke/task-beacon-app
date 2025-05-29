import { createContext, useContext, ReactNode } from 'react';
import { useTaskQueries } from '@/features/tasks/hooks/useTaskQueries';
import { Task } from '@/types/shared.types';

interface TaskDataContextValue {
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const TaskDataContext = createContext<TaskDataContextValue | undefined>(
  undefined
);

interface TaskDataContextProviderProps {
  children: ReactNode;
}

export function TaskDataContextProvider({
  children,
}: TaskDataContextProviderProps) {
  const taskQueries = useTaskQueries();

  return (
    <TaskDataContext.Provider value={taskQueries}>
      {children}
    </TaskDataContext.Provider>
  );
}

export function useTaskDataContext() {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error(
      'useTaskDataContext must be used within a TaskDataContextProvider'
    );
  }
  return context;
}

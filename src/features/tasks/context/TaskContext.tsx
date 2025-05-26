
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/types";
import { useTaskQueries } from "@/features/tasks/hooks/useTaskQueries";
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";

interface TaskDataContextType {
  // Task queries
  tasks: Task[];
  isLoading: boolean;
  isFetching?: boolean;
  error: Error | null;
  
  // Task mutations
  toggleTaskPin: (task: Task) => Promise<void>;
  toggleTaskComplete: (task: Task) => Promise<void>;
  createFollowUpTask: (parentTask: Task, newTaskData: any) => Promise<void>;
  
  // Pagination
  currentPage: number;
  totalCount: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);

/**
 * Provider for task data operations (queries and mutations)
 * 
 * Manages task data, loading states, and data mutations.
 * Focused solely on data concerns.
 */
export function TaskContextProvider({ children }: { children: ReactNode }) {
  const [pageSize, setPageSize] = useState(10);

  const { 
    tasks, 
    isLoading, 
    error,
    currentPage,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching
  } = useTaskQueries(pageSize);
  
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutations();

  return (
    <TaskDataContext.Provider value={{
      // Data properties
      tasks,
      isLoading,
      isFetching,
      error: error as Error,
      
      // Data mutations
      toggleTaskPin,
      toggleTaskComplete,
      createFollowUpTask,
      
      // Pagination properties
      currentPage,
      totalCount,
      pageSize,
      setPageSize,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage
    }}>
      {children}
    </TaskDataContext.Provider>
  );
}

/**
 * Hook for accessing task data context
 */
export function useTaskContext() {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  return context;
}

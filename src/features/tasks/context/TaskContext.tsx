
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types";
import { useTaskQueries } from "@/features/tasks/hooks/useTaskQueries";
import { useTaskMutation } from "@/features/tasks/hooks/mutations/useTaskMutation";

// Define data-focused context type
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
 * Provider component for task data-related state and operations
 * 
 * Manages tasks data, loading state, data mutations, and pagination
 * 
 * @param children - React components that will consume the task context
 */
export function TaskContextProvider({ children }: { children: ReactNode }) {
  // State for pagination
  const [pageSize, setPageSize] = useState(10);

  // Get task data and mutations
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
  
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutation();

  return (
    <TaskDataContext.Provider value={{
      // Data properties
      tasks,
      isLoading,
      isFetching,
      error: error as Error, // Cast to Error type to satisfy the type constraint
      
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
 * Custom hook for using the task data context
 * 
 * @returns The task data context value
 * @throws Error if used outside of a TaskContextProvider
 */
export function useTaskContext() {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  return context;
}

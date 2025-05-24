
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types";
import { useTaskQueries } from "@/features/tasks/hooks/useTaskQueries";
import { useTaskMutation } from "@/features/tasks/hooks/useTaskMutation";

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
 */
export function TaskContextProvider({ children }: { children: ReactNode }) {
  console.log("[TaskContextProvider] Initializing provider");
  
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
  
  console.log("[TaskContextProvider] Tasks from query:", tasks?.length || 0);
  
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutation();

  console.log("[TaskContextProvider] Provider ready, providing context");

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
 * Custom hook for using the task data context
 */
export function useTaskContext() {
  console.log("[useTaskContext] Hook called");
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    console.error("[useTaskContext] Context is undefined - not wrapped in provider");
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  console.log("[useTaskContext] Context found, tasks:", context.tasks?.length || 0);
  return context;
}

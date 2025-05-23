
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types";
import { TaskContextType, TaskFilter } from "../types";
import { useTaskQueries } from "@/features/tasks/hooks/useTaskQueries";
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Provider component for task-related state and operations
 * 
 * Manages the task list, filters, expanded state, and task mutations
 * 
 * @param children - React components that will consume the task context
 */
export function TaskContextProvider({ children }: { children: ReactNode }) {
  // States
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
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
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutations();

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      isFetching,
      error: error as Error, // Cast to Error type to satisfy the type constraint
      filter,
      setFilter,
      expandedTaskId,
      setExpandedTaskId,
      toggleTaskPin,
      toggleTaskComplete,
      createFollowUpTask,
      // Pagination props
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
    </TaskContext.Provider>
  );
}

/**
 * Custom hook for using the task context
 * 
 * @returns The task context value
 * @throws Error if used outside of a TaskContextProvider
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  return context;
}

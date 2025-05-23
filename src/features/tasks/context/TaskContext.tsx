
// Move from src/contexts/TaskContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types";
import { TaskContextType, TaskFilter } from "../types";
import { useTaskQueries } from "./useTaskQueries";
import { useTaskMutations } from "./useTaskMutations";

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

  // Get task data and mutations
  const { tasks, isLoading, error } = useTaskQueries();
  const { toggleTaskPin, toggleTaskComplete, createFollowUpTask } = useTaskMutations();

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      error: error as Error, // Cast to Error type to satisfy the type constraint
      filter,
      setFilter,
      expandedTaskId,
      setExpandedTaskId,
      toggleTaskPin,
      toggleTaskComplete,
      createFollowUpTask,
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

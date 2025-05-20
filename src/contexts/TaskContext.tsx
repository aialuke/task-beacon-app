
import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/lib/types";
import { TaskContextType, TaskFilter } from "./task/types";
import { useTaskQueries } from "./task/useTaskQueries";
import { useTaskMutations } from "./task/useTaskMutations";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

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
      error,
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

// Custom hook for using task context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  return context;
}

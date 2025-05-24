
import { createContext, useContext, useState, ReactNode } from "react";
import { TaskFilter } from "../types";

// Define the shape of our UI context
interface TaskUIContextType {
  // UI filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  
  // Expanded state
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  
  // Dialog state
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const TaskUIContext = createContext<TaskUIContextType | undefined>(undefined);

/**
 * Provider component for task UI-related state
 */
export function TaskUIContextProvider({ children }: { children: ReactNode }) {
  console.log("[TaskUIContextProvider] Initializing UI provider");
  
  // UI States
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  console.log("[TaskUIContextProvider] UI provider ready");

  return (
    <TaskUIContext.Provider value={{
      filter,
      setFilter,
      expandedTaskId,
      setExpandedTaskId,
      isDialogOpen,
      setDialogOpen
    }}>
      {children}
    </TaskUIContext.Provider>
  );
}

/**
 * Custom hook for using the task UI context
 */
export function useTaskUIContext() {
  console.log("[useTaskUIContext] Hook called");
  const context = useContext(TaskUIContext);
  if (context === undefined) {
    console.error("[useTaskUIContext] Context is undefined - not wrapped in provider");
    throw new Error("useTaskUIContext must be used within a TaskUIContextProvider");
  }
  console.log("[useTaskUIContext] UI context found, filter:", context.filter);
  return context;
}

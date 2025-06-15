
import { ReactNode, useState, useEffect } from "react";

import { TaskFilter } from "../types";

import { TaskUIProvider, type TaskUIContextType } from './task-ui-utils';

/**
 * Provider component for task UI-related state
 * Updated to use standardized context creation pattern
 */
export function TaskUIContextProvider({ children }: { children: ReactNode }) {
  // UI States - using standard React hooks
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => { window.removeEventListener("resize", checkIfMobile); };
  }, []);

  const contextValue: TaskUIContextType = {
    filter,
    setFilter,
    expandedTaskId,
    setExpandedTaskId,
    isMobile,
  };

  return (
    <TaskUIProvider value={contextValue}>
      {children}
    </TaskUIProvider>
  );
}



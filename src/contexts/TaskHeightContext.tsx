// src/contexts/TaskHeightContext.tsx
import React, { useState, useCallback, ReactNode } from "react";
import { TaskHeightContext, TaskHeightContextType, TaskHeightMap } from "@/lib/task-height-utils";

export const TaskHeightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [taskHeights, setTaskHeights] = useState<TaskHeightMap>({});

  const registerTaskHeight = useCallback((taskId: string, height: number) => {
    setTaskHeights(prev => ({
      ...prev,
      [taskId]: height
    }));
  }, []);

  return (
    <TaskHeightContext.Provider value={{ registerTaskHeight }}>
      {children}
    </TaskHeightContext.Provider>
  );
};
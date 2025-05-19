// src/lib/task-height-utils.ts
import React, { createContext, useContext } from "react";

export interface TaskHeightMap {
  [key: string]: number;
}

export interface TaskHeightContextType {
  registerTaskHeight: (taskId: string, height: number) => void;
}

export const TaskHeightContext = createContext<TaskHeightContextType | undefined>(undefined);

export const useTaskHeight = (): TaskHeightContextType => {
  const context = useContext(TaskHeightContext);
  if (context === undefined) {
    throw new Error("useTaskHeight must be used within a TaskHeightProvider");
  }
  return context;
};
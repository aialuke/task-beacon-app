// src/lib/expanded-task-utils.ts
import React, { createContext, useContext } from "react";

export interface ExpandedTaskContextType {
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
}

export const ExpandedTaskContext = createContext<ExpandedTaskContextType | undefined>(undefined);

export const useExpandedTask = (): ExpandedTaskContextType => {
  const context = useContext(ExpandedTaskContext);
  if (context === undefined) {
    throw new Error("useExpandedTask must be used within an ExpandedTaskProvider");
  }
  return context;
};
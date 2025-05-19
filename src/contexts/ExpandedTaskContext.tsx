// src/contexts/ExpandedTaskContext.tsx
import React, { useState, ReactNode } from "react";
import { ExpandedTaskContext, ExpandedTaskContextType } from "@/lib/expanded-task-utils";

export const ExpandedTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  return (
    <ExpandedTaskContext.Provider value={{ expandedTaskId, setExpandedTaskId }}>
      {children}
    </ExpandedTaskContext.Provider>
  );
};
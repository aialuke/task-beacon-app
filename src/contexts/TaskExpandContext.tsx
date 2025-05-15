
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TaskExpandContextType {
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  registerTaskHeight: (taskId: string, height: number) => void;
}

const TaskExpandContext = createContext<TaskExpandContextType | undefined>(undefined);

interface TaskHeightMap {
  [key: string]: number;
}

export const TaskExpandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskHeights, setTaskHeights] = useState<TaskHeightMap>({});

  // Simplified context - we only track heights for animation purposes
  const registerTaskHeight = useCallback((taskId: string, height: number) => {
    setTaskHeights(prev => ({
      ...prev,
      [taskId]: height
    }));
  }, []);

  return (
    <TaskExpandContext.Provider value={{
      expandedTaskId,
      setExpandedTaskId,
      registerTaskHeight,
    }}>
      {children}
    </TaskExpandContext.Provider>
  );
};

export const useTaskExpand = (): TaskExpandContextType => {
  const context = useContext(TaskExpandContext);
  if (context === undefined) {
    throw new Error('useTaskExpand must be used within a TaskExpandProvider');
  }
  return context;
};

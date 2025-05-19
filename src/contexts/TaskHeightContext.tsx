import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TaskHeightMap {
  [key: string]: number;
}

interface TaskHeightContextType {
  registerTaskHeight: (taskId: string, height: number) => void;
}

const TaskHeightContext = createContext<TaskHeightContextType | undefined>(undefined);

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

export const useTaskHeight = (): TaskHeightContextType => {
  const context = useContext(TaskHeightContext);
  if (context === undefined) {
    throw new Error('useTaskHeight must be used within a TaskHeightProvider');
  }
  return context;
};
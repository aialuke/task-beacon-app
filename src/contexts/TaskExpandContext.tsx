
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TaskExpandContextType {
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  getTaskOffset: (taskId: string) => number;
  registerTaskHeight: (taskId: string, height: number) => void;
}

const TaskExpandContext = createContext<TaskExpandContextType | undefined>(undefined);

interface TaskHeightMap {
  [key: string]: number;
}

export const TaskExpandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskHeights, setTaskHeights] = useState<TaskHeightMap>({});

  const registerTaskHeight = useCallback((taskId: string, height: number) => {
    setTaskHeights(prev => ({
      ...prev,
      [taskId]: height
    }));
  }, []);

  const getTaskOffset = useCallback((taskId: string): number => {
    // If no task is expanded or if this is the expanded task, no offset
    if (!expandedTaskId || taskId === expandedTaskId) return 0;

    // If this task appears before the expanded task in the DOM, no offset
    const allTaskIds = Object.keys(taskHeights);
    const expandedIndex = allTaskIds.indexOf(expandedTaskId);
    const currentIndex = allTaskIds.indexOf(taskId);

    if (expandedIndex === -1 || currentIndex <= expandedIndex) return 0;

    // Return the expanded content height as offset for tasks below
    return taskHeights[expandedTaskId] || 0;
  }, [expandedTaskId, taskHeights]);

  return (
    <TaskExpandContext.Provider value={{
      expandedTaskId,
      setExpandedTaskId,
      getTaskOffset,
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

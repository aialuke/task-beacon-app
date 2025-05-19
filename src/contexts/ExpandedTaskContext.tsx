import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExpandedTaskContextType {
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
}

const ExpandedTaskContext = createContext<ExpandedTaskContextType | undefined>(undefined);

export const ExpandedTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  return (
    <ExpandedTaskContext.Provider value={{ expandedTaskId, setExpandedTaskId }}>
      {children}
    </ExpandedTaskContext.Provider>
  );
};

export const useExpandedTask = (): ExpandedTaskContextType => {
  const context = useContext(ExpandedTaskContext);
  if (context === undefined) {
    throw new Error('useExpandedTask must be used within an ExpandedTaskProvider');
  }
  return context;
};
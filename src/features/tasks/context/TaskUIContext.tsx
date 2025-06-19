import { ReactNode, useState, useMemo } from 'react';

import { useIsMobile } from '@/hooks/useMediaQuery';
import { createStandardContext } from '@/lib/utils/createContext';

import { TaskFilter } from '../types';

// Define the shape of our UI context
interface TaskUIContextType {
  // UI filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;

  // Expanded state
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;

  // Mobile detection
  isMobile: boolean;
}

// Create standardized context
const { Provider: TaskUIProvider, useContext: useTaskUIContext } =
  createStandardContext<TaskUIContextType>({
    name: 'TaskUI',
    errorMessage:
      'useTaskUIContext must be used within a TaskUIContextProvider',
  });

/**
 * Provider component for task UI-related state
 * Updated to use standardized context creation pattern
 */
export function TaskUIContextProvider({ children }: { children: ReactNode }) {
  // UI States - using standard React hooks
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Use centralized responsive logic instead of manual window resize handling
  const isMobile = useIsMobile();

  const contextValue: TaskUIContextType = useMemo(() => ({
    filter,
    setFilter,
    expandedTaskId,
    setExpandedTaskId,
    isMobile,
  }), [filter, expandedTaskId, isMobile]);

  return <TaskUIProvider value={contextValue}>{children}</TaskUIProvider>;
}

// Export the standardized hook
export { useTaskUIContext };

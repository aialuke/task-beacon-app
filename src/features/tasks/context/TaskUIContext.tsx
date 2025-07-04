import { ReactNode, useState, useMemo, useEffect } from 'react';

import { createStandardContext } from '@/lib/utils/createContext';

import { TaskFilter } from '../types';

// Define the shape of our UI context
interface TaskUIContextType {
  // UI filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;

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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile();
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', checkMobile);

    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  const contextValue: TaskUIContextType = useMemo(
    () => ({
      filter,
      setFilter,
      isMobile,
    }),
    [filter, isMobile],
  );

  return <TaskUIProvider value={contextValue}>{children}</TaskUIProvider>;
}

// Export the standardized hook
export { useTaskUIContext };

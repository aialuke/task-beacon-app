import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
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

const TaskUIContext = createContext<TaskUIContextType | undefined>(undefined);

/**
 * Provider component for task UI-related state
 *
 * Manages UI-only concerns like filters, expanded state, and mobile detection
 *
 * @param children - React components that will consume the context
 */
export function TaskUIContextProvider({ children }: { children: ReactNode }) {
  // UI States
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const value = useMemo(
    () => ({
      filter,
      setFilter,
      expandedTaskId,
      setExpandedTaskId,
      isMobile,
    }),
    [filter, expandedTaskId, isMobile]
  );

  return (
    <TaskUIContext.Provider value={value}>{children}</TaskUIContext.Provider>
  );
}

/**
 * Custom hook for using the task UI context
 *
 * @returns The task UI context value
 * @throws Error if used outside of a TaskUIContextProvider
 */
export function useTaskUIContext() {
  const context = useContext(TaskUIContext);
  if (context === undefined) {
    throw new Error(
      'useTaskUIContext must be used within a TaskUIContextProvider'
    );
  }
  return context;
}

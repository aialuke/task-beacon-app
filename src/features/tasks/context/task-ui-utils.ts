import { createStandardContext } from '@/lib/utils/createContext';

import { TaskFilter } from "../types";

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
const { Provider: TaskUIProvider, useContext: useTaskUIContext } = createStandardContext<TaskUIContextType>({
  name: 'TaskUI',
  errorMessage: 'useTaskUIContext must be used within a TaskUIContextProvider'
});

// Export the context components
export { TaskUIProvider, useTaskUIContext };
export type { TaskUIContextType }; 
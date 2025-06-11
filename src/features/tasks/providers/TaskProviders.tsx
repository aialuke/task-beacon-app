// === EXTERNAL LIBRARIES ===
import React from 'react';

// === FEATURE CONTEXTS ===
import { 
  TaskDataContextProvider,
  useTaskDataContext 
} from '../context/TaskDataContext';
import {
  TaskUIContextProvider,
  useTaskUIContext,
} from '../context/TaskUIContext';
// === FEATURE HOOKS ===
import { useTasksFilter } from '../hooks/useTasksFilter';

interface TaskProvidersProps {
  children: React.ReactNode;
}

/**
 * Simplified task providers - Step 2.4 Revised
 *
 * Provides both task data and UI state contexts using standard patterns.
 * Removed complex unified system in favor of proven React patterns.
 */
export function TaskProviders({ children }: TaskProvidersProps) {
  return (
    <TaskDataContextProvider>
      <TaskUIContextProvider>{children}</TaskUIContextProvider>
    </TaskDataContextProvider>
  );
}

/**
 * Convenience hook for filtering operations
 * Combines task data, filtering state, and filtered results
 *
 * @returns Object with filtered tasks and filter controls
 */
export function useTaskFiltering() {
  const { tasks } = useTaskDataContext();
  const { filter, setFilter } = useTaskUIContext();
  const filteredTasks = useTasksFilter(tasks, filter);

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    totalCount: tasks.length,
    filteredCount: filteredTasks.length,
  };
}

/**
 * Higher-order component for wrapping components with task providers
 *
 * @param Component - Component that needs task context
 * @returns Wrapped component with task providers
 */
export function withTaskProviders<T extends object>(
  Component: React.ComponentType<T>
) {
  const WrappedComponent = (props: T) => (
    <TaskProviders>
      <Component {...props} />
    </TaskProviders>
  );

  WrappedComponent.displayName = `withTaskProviders(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

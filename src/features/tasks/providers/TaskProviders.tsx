import React from 'react';
import { TaskDataContextProvider } from '../context/TaskDataContext';
import { TaskUIContextProvider, useTaskUIContext } from '../context/TaskUIContext';
import { useTaskDataContext } from '../context/TaskDataContext';
import { useFilteredTasks } from '../hooks/useFilteredTasks';

interface TaskProvidersProps {
  children: React.ReactNode;
}

/**
 * Feature-specific provider composition for task management
 * 
 * Provides both task data and UI state contexts in the correct order.
 * Should be used to wrap task-related routes or components that need
 * access to task state.
 * 
 * Provider order:
 * 1. TaskDataContext - Server state and data operations
 * 2. TaskUIContext - Client state and UI preferences
 */
export function TaskProviders({ children }: TaskProvidersProps) {
  return (
    <TaskDataContextProvider>
      <TaskUIContextProvider>
        {children}
      </TaskUIContextProvider>
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
  const filteredTasks = useFilteredTasks(tasks, filter);
  
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
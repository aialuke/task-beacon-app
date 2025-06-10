import React from 'react';

import { useTaskDataContext, useTaskUIContext } from '../context';
import { useTasksFilter } from '../hooks/useTasksFilter';

import { TaskProviders } from './TaskProviders';

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
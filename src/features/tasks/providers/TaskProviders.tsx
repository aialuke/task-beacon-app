import React, { useEffect, useState } from 'react';
import { TaskDataContextProvider, useTaskDataContext } from '../context/TaskDataContext';
import { TaskUIContextProvider, useTaskUIContext } from '../context/TaskUIContext';
import { useFilteredTasks } from '../hooks/useFilteredTasks';

interface TaskProvidersProps {
  children: React.ReactNode;
  debug?: boolean;
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
export function TaskProviders({ children, debug = false }: TaskProvidersProps) {
  return (
    <TaskDataContextProvider>
      <TaskUIContextProvider>
        {debug && process.env.NODE_ENV === 'development' && <TaskProviderDebugger />}
        {children}
      </TaskUIContextProvider>
    </TaskDataContextProvider>
  );
}

/**
 * Convenience hook for components that need both task contexts
 * 
 * @returns Object containing both data and UI context values
 */
export function useTaskContexts() {
  const dataContext = useTaskDataContext();
  const uiContext = useTaskUIContext();
  
  return {
    data: dataContext,
    ui: uiContext,
  };
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
 * Optional hook for TaskDataContext - doesn't throw if outside provider
 * Useful for components that conditionally use task data
 * 
 * @returns TaskDataContext value or null if not available
 */
export function useTaskDataContextOptional() {
  try {
    return useTaskDataContext();
  } catch {
    return null;
  }
}

/**
 * Optional hook for TaskUIContext - doesn't throw if outside provider
 * Useful for components that conditionally use task UI state
 * 
 * @returns TaskUIContext value or null if not available
 */
export function useTaskUIContextOptional() {
  try {
    return useTaskUIContext();
  } catch {
    return null;
  }
}

/**
 * Enhanced hook to check task provider status and readiness
 * Useful for conditional rendering and debugging
 * 
 * @returns Object with provider availability status
 */
export function useTaskProviderStatus() {
  const [status, setStatus] = useState({
    hasDataContext: false,
    hasUIContext: false,
    isReady: false,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const dataContext = useTaskDataContextOptional();
      const uiContext = useTaskUIContextOptional();
      
      setStatus({
        hasDataContext: !!dataContext,
        hasUIContext: !!uiContext,
        isReady: !!dataContext && !!uiContext,
        isLoading: false,
      });
    } catch {
      setStatus({
        hasDataContext: false,
        hasUIContext: false,
        isReady: false,
        isLoading: false,
      });
    }
  }, []);

  return status;
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

/**
 * Development-only debugger component for task providers
 * Shows current context state in development mode
 */
function TaskProviderDebugger() {
  const dataContext = useTaskDataContextOptional();
  const uiContext = useTaskUIContextOptional();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        fontFamily: 'monospace',
      }}
    >
      <div><strong>Task Provider Status:</strong></div>
      <div>Data Context: {dataContext ? '✅' : '❌'}</div>
      <div>UI Context: {uiContext ? '✅' : '❌'}</div>
      {dataContext && (
        <div>
          <div>Tasks: {dataContext.tasks.length}</div>
          <div>Loading: {dataContext.isLoading ? '⏳' : '✅'}</div>
          <div>Page: {dataContext.currentPage}</div>
        </div>
      )}
      {uiContext && (
        <div>
          <div>Filter: {uiContext.filter}</div>
          <div>Mobile: {uiContext.isMobile ? '📱' : '🖥️'}</div>
          <div>Expanded: {uiContext.expandedTaskId || 'None'}</div>
        </div>
      )}
    </div>
  );
}

// Legacy compatibility - keeping the original function for backward compatibility
export { useTaskProviderStatus as useTaskProvidersStatus };

/**
 * Hook for performance monitoring of context re-renders
 * Development-only utility for tracking context update frequency
 */
export function useTaskContextPerformance() {
  const [renderCount, setRenderCount] = useState({
    data: 0,
    ui: 0,
    total: 0,
  });

  const dataContext = useTaskDataContextOptional();
  const uiContext = useTaskUIContextOptional();

  useEffect(() => {
    setRenderCount(prev => ({
      ...prev,
      data: prev.data + 1,
      total: prev.total + 1,
    }));
  }, [dataContext]);

  useEffect(() => {
    setRenderCount(prev => ({
      ...prev,
      ui: prev.ui + 1,
      total: prev.total + 1,
    }));
  }, [uiContext]);

  return process.env.NODE_ENV === 'development' ? renderCount : null;
} 
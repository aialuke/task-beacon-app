
import { memo, useMemo } from 'react';
import type { Task } from '@/types';

interface TaskListCoreProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  renderTask: (task: Task) => React.ReactNode;
  renderLoading: (count: number) => React.ReactNode;
  renderEmpty: () => React.ReactNode;
  renderError: (error: string, onRetry?: () => void) => React.ReactNode;
  pageSize: number;
}

/**
 * Core Task List Component - Simplified Performance Optimization
 * 
 * Focused component for rendering task lists with minimal re-renders.
 * Uses React.memo and standard React patterns for better maintainability.
 */
const TaskListCore = memo(function TaskListCore({
  tasks,
  loading,
  error,
  onRetry,
  renderTask,
  renderLoading,
  renderEmpty,
  renderError,
  pageSize,
}: TaskListCoreProps) {
  // Memoize task elements using standard useMemo - sufficient for this use case
  const taskElements = useMemo(
    () => tasks.map(renderTask),
    [tasks, renderTask]
  );

  // Determine content based on state
  const content = useMemo(() => {
    if (error) {
      return renderError(error, onRetry);
    }
    
    if (loading) {
      return renderLoading(pageSize);
    }
    
    if (tasks.length === 0) {
      return renderEmpty();
    }
    
    return (
      <div className="space-y-6" role="list" aria-label="Task list">
        {taskElements}
      </div>
    );
  }, [error, loading, tasks.length, renderError, renderLoading, renderEmpty, taskElements, onRetry, pageSize]);

  return content;
});

export default TaskListCore;

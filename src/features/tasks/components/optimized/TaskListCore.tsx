
import { memo, useMemo } from 'react';
import { useOptimizedMemo } from '@/hooks/performance';
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
 * Core Task List Component - Phase 2 Optimization
 * 
 * Focused component for rendering task lists with minimal re-renders.
 * Uses React.memo and optimized rendering patterns.
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
  // Memoize task elements to prevent unnecessary re-renders
  const taskElements = useOptimizedMemo(
    () => tasks.map(renderTask),
    [tasks, renderTask],
    { 
      name: 'task-list-core-elements',
      warnOnSlowComputation: true,
    }
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

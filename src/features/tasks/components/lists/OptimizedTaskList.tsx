
/**
 * Simplified Task List - Step 2.4.6.2c
 * 
 * Converted from over-engineered optimized patterns to standard React patterns
 */

import { memo, useMemo, useCallback } from 'react';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';
import { OptimizedTaskCard } from '../cards/OptimizedTaskCard';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { useTasksFilter } from '@/features/tasks/hooks/useTasksFilter';
import type { Task } from '@/types';

interface OptimizedTaskListProps {
  onTaskStatusToggle?: (taskId: string, newStatus: 'pending' | 'complete') => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  selectedTaskIds?: Set<string>;
  showActions?: boolean;
}

function OptimizedTaskListComponent({
  onTaskStatusToggle,
  onTaskEdit,
  onTaskDelete,
  selectedTaskIds = new Set(),
  showActions = true,
}: OptimizedTaskListProps) {
  const {
    tasks,
    isLoading,
    error,
    totalCount,
    pageSize,
  } = useTaskDataContext();

  const { filter, isMobile } = useTaskUIContext();

  // Standard React memoization for filtered tasks
  const filteredTasks = useTasksFilter(tasks, filter);

  // Standard memoization for pagination check
  const shouldShowPagination = useMemo(
    () => totalCount > pageSize,
    [totalCount, pageSize]
  );

  // Standard callback for task rendering
  const renderTask = useCallback((task: Task) => (
    <OptimizedTaskCard
      key={task.id}
      task={task}
      onStatusToggle={onTaskStatusToggle}
      onEdit={onTaskEdit}
      onDelete={onTaskDelete}
      isSelected={selectedTaskIds.has(task.id)}
      showActions={showActions}
    />
  ), [onTaskStatusToggle, onTaskEdit, onTaskDelete, selectedTaskIds, showActions]);

  // Standard memoization for task list content
  const taskListContent = useMemo(() => {
    if (filteredTasks.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">No tasks found</p>
            <p className="text-sm text-muted-foreground/80">Create your first task to get started</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-4 sm:space-y-6 ${isMobile ? "pb-20" : "pb-6"}`}>
        {filteredTasks.map(renderTask)}
      </div>
    );
  }, [filteredTasks, renderTask, isMobile]);

  if (isLoading) {
    return (
      <UnifiedLoadingStates variant="card" count={3} message="Loading tasks..." />
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {taskListContent}
      
      {/* Pagination would go here if shouldShowPagination is true */}
      {shouldShowPagination && (
        <div className="border-t border-border pt-6">
          {/* Pagination component would be rendered here */}
        </div>
      )}
    </div>
  );
}

// Standard React memo with shallow equality check
function shallowEqual<T extends Record<string, any>>(prevProps: T, nextProps: T): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  
  return true;
}

export const OptimizedTaskList = memo(OptimizedTaskListComponent, shallowEqual);

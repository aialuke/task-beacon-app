
import { memo, useCallback } from 'react';
import TaskFilterNavbar from '../TaskFilterNavbar';
import type { TaskFilter } from '@/features/tasks/types';

interface TaskListFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

/**
 * Task List Filters Component - Phase 2 Optimization
 * 
 * Isolated filter component with optimized callbacks.
 */
const TaskListFilters = memo(function TaskListFilters({
  filter,
  onFilterChange,
}: TaskListFiltersProps) {
  // Memoize filter change handler to prevent child re-renders
  const handleFilterChange = useCallback((newFilter: TaskFilter) => {
    onFilterChange(newFilter);
  }, [onFilterChange]);

  return (
    <section className="w-full px-4 sm:px-6" aria-label="Task filters">
      <TaskFilterNavbar filter={filter} onFilterChange={handleFilterChange} />
    </section>
  );
});

export default TaskListFilters;

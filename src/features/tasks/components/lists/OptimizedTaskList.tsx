
import { memo } from 'react';
import TaskList from './TaskList';

/**
 * Optimized Task List - Phase 2 Simplified
 * 
 * Now extends the main TaskList component instead of duplicating logic.
 * Removed duplicate filtering and optimization logic.
 */
function OptimizedTaskList() {
  // Simply render the main TaskList component
  // All optimization and filtering is handled by TaskList itself
  return <TaskList />;
}

export default memo(OptimizedTaskList);

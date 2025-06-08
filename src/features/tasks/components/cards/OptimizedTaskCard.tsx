
import { memo } from 'react';
import TaskCard from './TaskCard';
import type { Task } from '@/types';

interface OptimizedTaskCardProps {
  task: Task;
  onStatusToggle?: (taskId: string, newStatus: 'pending' | 'complete') => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

/**
 * Optimized Task Card - Phase 2 Simplified
 * 
 * Now extends the main TaskCard component instead of duplicating logic.
 * Removed over-engineered patterns in favor of standard React patterns.
 */
function OptimizedTaskCard({
  task,
  onStatusToggle,
  onEdit,
  onDelete,
  isSelected = false,
  showActions = true,
}: OptimizedTaskCardProps) {
  // Simply render the main TaskCard component
  // All the optimization and memoization is handled by TaskCard itself
  return <TaskCard task={task} />;
}

// Use standard React memo
export default memo(OptimizedTaskCard);

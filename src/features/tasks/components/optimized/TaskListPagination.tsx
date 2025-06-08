
import { memo, useMemo } from 'react';
import TaskPagination from '../TaskPagination';

interface TaskListPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isFetching: boolean;
  isLoading: boolean;
  shouldShow: boolean;
}

/**
 * Task List Pagination Component - Phase 2 Optimization
 * 
 * Optimized pagination component with memoized props.
 */
const TaskListPagination = memo(function TaskListPagination({
  currentPage,
  totalCount,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  goToNextPage,
  goToPreviousPage,
  isFetching,
  isLoading,
  shouldShow,
}: TaskListPaginationProps) {
  // Memoize pagination props to prevent unnecessary re-renders
  const paginationProps = useMemo(() => ({
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching,
    isLoading,
  }), [
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isFetching,
    isLoading,
  ]);

  if (!shouldShow) {
    return null;
  }

  return <TaskPagination {...paginationProps} />;
});

export default TaskListPagination;
// CodeRabbit review
// CodeRabbit review

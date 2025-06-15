import type { TaskStatus, TaskFilter } from '@/types';

/**
 * UI-related types for task components
 */
interface TaskListUIProps {
  className?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
}

interface TaskCardUIProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
  isPinLoading?: boolean;
}

interface TaskTimerProps {
  dueDate: string | null;
  status: TaskStatus;
  size?: number;
}

interface TaskDialogState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'followUp' | null;
  taskId: string | null;
}

/**
 * Task UI Context interface
 */
interface TaskUIContextType {
  // UI filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;

  // Expanded state
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;

  // Mobile detection
  isMobile: boolean;
}

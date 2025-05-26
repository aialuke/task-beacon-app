
import { TaskStatus, TaskFilter } from "@/types/shared.types";

/**
 * UI-related types for task components
 */
export interface TaskListUIProps {
  className?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
}

export interface TaskCardUIProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

export interface TaskTimerProps {
  dueDate: string | null;
  status: TaskStatus;
  size?: number;
}

export interface TaskDialogState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'followUp' | null;
  taskId: string | null;
}

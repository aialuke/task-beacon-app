import type { Task } from '@/types';
import type { BaseComponentProps } from '@/types/shared/components.types';

/**
 * Task Component Type Definitions
 * 
 * Centralized types for task-related components including display,
 * interaction, and management component props.
 */

// Base task component props
export interface BaseTaskComponentProps extends BaseComponentProps {
  task: Task;
}

// Task card related props
export interface TaskCardProps extends BaseTaskComponentProps {
  className?: string;
}

export interface TaskCardContentProps extends BaseTaskComponentProps {
  isExpanded?: boolean;
}

export interface TaskCardHeaderProps extends BaseTaskComponentProps {
  isExpanded: boolean;
  toggleExpand: () => void;
}

// Task details props
export interface TaskDetailsContentProps extends BaseTaskComponentProps {
  isExpanded?: boolean;
}

// Task actions props
export interface TaskActionsProps extends BaseTaskComponentProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  variant?: 'compact' | 'full';
}

// Task list props
export interface TaskListProps extends BaseComponentProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onTaskClick?: (task: Task) => void;
}

// Task dashboard props
export interface TaskDashboardProps extends BaseComponentProps {
  showFilters?: boolean;
  showStats?: boolean;
  defaultFilter?: string;
}

// Countdown timer props
export interface CountdownTimerProps extends BaseComponentProps {
  dueDate: string | null;
  status: 'pending' | 'complete' | 'overdue';
  size?: number;
  showTooltip?: boolean;
}

// Task image gallery props
export interface TaskImageGalleryProps extends BaseComponentProps {
  images: string[];
  onImageClick?: (image: string, index: number) => void;
  maxImages?: number;
  showAddButton?: boolean;
  onAddImage?: () => void;
}

// Task filter props
export interface TaskFilterProps extends BaseComponentProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  filterOptions: {
    value: string;
    label: string;
    count?: number;
  }[];
}

// Task status props
export interface TaskStatusProps extends BaseComponentProps {
  status: Task['status'];
  onChange?: (status: Task['status']) => void;
  readonly?: boolean;
}

// Task priority props (if used)
export interface TaskPriorityProps extends BaseComponentProps {
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  onChange?: (priority: TaskPriorityProps['priority']) => void;
  readonly?: boolean;
}
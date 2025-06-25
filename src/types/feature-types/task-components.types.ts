import type { Task } from '@/types';
import type { BaseComponentProps } from '@/types/shared/components.types';

/**
 * Task Component Type Definitions
 *
 * Centralized types for task-related components including display,
 * interaction, and management component props.
 */

// Task card related props
export interface TaskCardProps extends BaseComponentProps {
  task: Task;
  className?: string;
}

export interface TaskCardContentProps extends BaseComponentProps {
  task: Task;
}

export interface TaskCardHeaderProps extends BaseComponentProps {
  task: Task;
}

// Task details props
export interface TaskDetailsContentProps extends BaseComponentProps {
  task: Task;
}

// Task interaction props
export interface CountdownTimerProps {
  dueDate: string;
  onComplete?: () => void;
  compact?: boolean;
  showProgress?: boolean;
  className?: string;
}

export interface TaskActionsProps {
  task: Task;
  onView: () => void;
}

export interface TaskImageGalleryProps {
  task: Task;
  images: string[];
  onImageClick?: (imageUrl: string) => void;
  className?: string;
}

export interface TaskStatusProps {
  task: Task;
  className?: string;
}

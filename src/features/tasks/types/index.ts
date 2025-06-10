/**
 * Task Feature Types Index - Phase 2 Consolidated
 * 
 * Centralized export of all task-related types for the feature.
 * Follows standardized naming conventions with Props suffix.
 */

// Import types for local use
import type { Task, TaskStatus, TaskFilter, TaskCreateData, TaskUpdateData } from '@/types';

// Re-export core task types from main types (shared across features)
export type {
  Task,
  TaskStatus,
  TaskFilter,
  TaskPriority,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
  ParentTask,
  ID as TaskId,
  Timestamp as TaskTimestamp,
} from '@/types';

// Export feature-specific types
export * from './task-form.types';
export * from './task-ui.types';

// Standardized component props interfaces (with Props suffix)
export interface TaskDetailsContainerProps {
  className?: string;
}

export interface TaskDetailsViewProps {
  task: Task | null | undefined;
  status: TaskStatus | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onNavigateToTask: (taskId: string) => void;
  onNavigateToParentTask: () => void;
  className?: string;
}

export interface TaskListContainerProps {
  className?: string;
  filter?: TaskFilter;
  onFilterChange?: (filter: TaskFilter) => void;
}

export interface TaskFormContainerProps {
  initialData?: Partial<TaskCreateData>;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
  className?: string;
}

// Hook return types (standardized naming)
export interface UseTaskQueryReturn {
  data: Task | null | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseTaskMutationsReturn {
  createTask: (data: TaskCreateData) => void;
  updateTask: (data: { id: string; data: TaskUpdateData }) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  isLoading: boolean;
} 
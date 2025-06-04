
/**
 * Task Feature Types - Updated to use streamlined type system
 * 
 * This file now imports from the organized type system instead of duplicating definitions.
 */

// Import from organized type system
export type {
  Task,
  TaskStatus,
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
  TaskSearchFilters,
  TaskListResponse,
} from '@/types/feature-types/task.types';

// Re-export UI-specific types that remain feature-specific
export type {
  TaskListUIProps,
  TaskCardUIProps,
  TaskTimerProps,
  TaskDialogState,
  TaskUIContextType,
} from './types/task-ui.types';

// Re-export form-specific types
export type {
  TaskFormData,
  TaskFormOptions,
} from './types/task-form.types';

// Legacy compatibility
export type {
  Task as TaskType,
  TaskStatus as TaskStatusType,
} from '@/types';

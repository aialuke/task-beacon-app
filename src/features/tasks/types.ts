
/**
 * Task Feature Types - Unified Import System
 * 
 * This file now imports from the unified type system instead of duplicating definitions.
 */

// Import from unified type system (single source of truth)
export type {
  TaskFilter,
  TaskFilterOptions,
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

// Legacy compatibility exports (will be phased out)
export type {
  Task as TaskType,
  TaskStatus as TaskStatusType,
} from '@/types';

/**
 * Types Index - Domain-Specific Organization
 *
 * Streamlined index that imports from domain-specific type files.
 * This provides better tree-shaking and clearer type organization.
 */

// === DATABASE TYPES ===
export type {
  TaskWithRelations as Task,
  ProfileTable as User,
  TaskWithRelations,
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
} from './database';

// === DOMAIN-SPECIFIC TYPE EXPORTS ===

// Authentication types
export type { AuthUser, Session, AuthResponse } from './auth.types';

// API types
export type { ApiResponse, ApiError } from './api.types';

// UI component types
export type {
  AuthFloatingInputProps,
  FormFloatingInputProps,
  FloatingTextareaProps,
  ActionButtonProps,
} from './shared/components.types';

// Task component types
export type {
  TaskCardProps,
  TaskCardContentProps,
  TaskCardHeaderProps,
  TaskDetailsContentProps,
  CountdownTimerProps,
  TaskActionsProps,
  TaskImageGalleryProps,
  TaskStatusProps,
} from './feature-types/task-components.types';

// Async state types: (no longer re-exporting BaseAsyncState as it is unused)

// Feature-specific types
export type {
  TaskFilter,
  TaskCreateData,
  TaskUpdateData,
  UserQueryOptions,
} from './feature-types';

// Utility types
export type { ID, Timestamp } from './utility.types';

// Navigation types
export type { TaskNavigationHook } from '../lib/navigation/useTaskNavigation';

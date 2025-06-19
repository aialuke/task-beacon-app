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
export type { ApiResponse, ApiError, ServiceResult } from './api.types';

// UI component types
export type {
  BaseComponentProps,
  BaseFloatingInputProps,
  AuthFloatingInputProps,
  FormFloatingInputProps,
  FloatingInputProps,
  FloatingTextareaProps,
  ActionButtonProps,
  BaseModalProps,
  LoadingStateProps,
  ErrorStateProps,
} from './shared/components.types';

// Task form types
export type {
  TaskFormFields,
  TaskFormInitialValues,
  TaskFormSubmissionOptions,
  TaskFormOptions,
  TaskFormState,
  TaskFormValidationState,
  TaskFormSubmissionState,
  TaskFormHookReturn,
  TaskFormComponentProps,
} from './feature-types/task-forms.types';

// Task component types
export type {
  BaseTaskComponentProps,
  TaskCardProps,
  TaskCardContentProps,
  TaskCardHeaderProps,
  TaskDetailsContentProps,
  TaskActionsProps,
  TaskListProps,
  TaskDashboardProps,
  CountdownTimerProps,
  TaskImageGalleryProps,
  TaskFilterProps,
  TaskStatusProps,
  TaskPriorityProps,
} from './feature-types/task-components.types';

// Pagination types
export type { PaginationAPI, PaginationState, PaginationConfig } from './pagination.types';

// Async state types
export type {
  BaseAsyncState,
  AsyncOperationState,
  BatchAsyncOperationState,
  OptimisticAsyncOperationState,
  StandardLoadingState,
  FormSubmissionState,
  QueryState,
  MutationState,
  ApiResponseState,
} from './async-state.types';

// Feature-specific types
export type {
  TaskFilter,
  TaskCreateData,
  TaskUpdateData,
  UserQueryOptions,
} from './feature-types';

// Utility types
export type { ID, Timestamp } from './utility.types';

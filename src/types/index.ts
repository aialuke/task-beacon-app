
/**
 * Main Types Index - Streamlined Type System
 * 
 * Centralized and organized type exports with clear categorization and improved IntelliSense.
 * This replaces the previous complex type organization with a simpler, more maintainable system.
 */

// === CORE TYPES (Most commonly used) ===
export type {
  // Database types
  TaskWithRelations as Task,
  ProfileTable as User,
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
  TaskTable,
  ProfileTable,
  TaskWithRelations,
  ProfileWithRelations,
} from './database';

export type {
  // API types
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
} from './api.types';

export type {
  // Form types
  FormState,
  ValidationResult,
  FormSubmissionResult,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
} from './form.types';

export type {
  // Component types
  BaseComponentProps,
  ButtonProps,
  ModalProps,
  CardProps,
  TableProps,
  LoadingProps,
  Size,
  Variant,
  ColorScheme,
} from './component.types';

// === UTILITY TYPES ===
export type {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Merge,
  Override,
  PropsWithClassName,
  PropsWithChildren,
  AsyncState,
  LoadingState,
  ID,
  Timestamp,
  Status,
} from './utility.types';

// === FEATURE-SPECIFIC TYPES ===
export type {
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
} from './feature-types/task.types';

export type {
  UserPreferences,
  NotificationPreferences,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
} from './feature-types/user.types';

// Re-export database utilities for convenience
export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database';

// Re-export commonly used patterns
export type {
  EventHandler,
  AsyncEventHandler,
  ApiState,
  FormErrors,
  FormTouched,
} from './utility.types';


/**
 * Main Types Index - Streamlined and Simplified
 * 
 * Single source of truth for all types with clear categorization.
 * Eliminates duplication and provides better IntelliSense.
 */

// === CORE DATABASE TYPES ===
export type {
  // Primary entities
  TaskWithRelations as Task,
  ProfileTable as User,
  TaskTable,
  ProfileTable,
  TaskWithRelations,
  ProfileWithRelations,
  
  // Enums
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
  
  // Database utilities
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database';

// === API TYPES ===
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
} from './api.types';

// === FORM TYPES ===
export type {
  FormState,
  ValidationResult,
  FormSubmissionResult,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
} from './form.types';

// === UI COMPONENT TYPES ===
export type {
  BaseComponentProps,
  ButtonProps,
  ModalProps,
  CardProps,
  LoadingProps,
  Size,
  Variant,
  ColorScheme,
} from './component.types';

// === FEATURE-SPECIFIC TYPES ===
export type {
  // Task domain
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
  
  // User domain
  UserPreferences,
  NotificationPreferences,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
} from './feature-types';

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
  EventHandler,
  AsyncEventHandler,
} from './utility.types';

// Re-export commonly used type patterns for convenience
export type {
  ApiState,
} from './utility.types';

// Add missing exports for backward compatibility
export interface FormErrors {
  [key: string]: string[];
}

export interface FormTouched {
  [key: string]: boolean;
}

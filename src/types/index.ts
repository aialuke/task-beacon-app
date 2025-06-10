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
  TaskTable,
  ProfileTable,
  TaskWithRelations,
  ProfileWithRelations,
  TaskStatusEnum as TaskStatus,
  UserRoleEnum as UserRole,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database';

// === DOMAIN-SPECIFIC TYPE EXPORTS ===

// Authentication types
export type {
  AuthUser,
  Session,
  AuthResponse,
  AuthContextType,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  SignUpOptions,
} from './auth.types';

// API types
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  BaseQueryParams,
  ActionResult,
  DatabaseOperationResult,
  ApiState,
} from './api.types';

// UI component types
export type {
  Size,
  Variant,
  ColorScheme,
  BaseComponentProps,
  ButtonProps,
  ModalProps,
  CardProps,
  LoadingProps,
  SelectOption,
  FilterOptions,
  ModalState,
  NotificationType,
  Notification,
  NotificationAction,
} from './ui.types';

// Form types
export type {
  FormState,
  FormErrors,
  FormTouched,
  ValidationResult,
  ValidationRule,
  FieldValidationState,
  FormSubmissionResult,
  FormSubmissionState,
  BaseFieldProps,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  FormConfig,
} from './form.types';

// Pagination types
export type {
  PaginationMeta,
  PaginationParams,
  PaginationState,
  PaginationControls,
  PaginationAPI,
  PaginatedResponse,
  PaginationConfig,
  PaginationValidationResult,
  PaginationRange,
  BaseQueryParams as PaginationQueryParams,
} from './pagination.types';

// Async state types
export type {
  BaseAsyncState,
  AsyncOperationState,
  BatchAsyncOperationState,
  OptimisticAsyncOperationState,
  StandardLoadingState,
  FormSubmissionState as AsyncFormSubmissionState,
  QueryState,
} from './async-state.types';

// Feature-specific types
export type {
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
  UserPreferences,
  NotificationPreferences,
  UserCreateData,
  UserUpdateData,
  UserQueryOptions,
} from './feature-types';

// Utility types
export type {
  DeepPartial,
  DeepRequired,
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

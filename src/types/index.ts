
/**
 * Main Types Index - Streamlined and Organized
 * 
 * Clean, focused type exports without duplication.
 */

// === CORE ENTITIES ===
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

// === API LAYER ===
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
} from './api.types';

// === FORMS & VALIDATION ===
export type {
  FormState,
  ValidationResult,
  FormSubmissionResult,
  InputFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
} from './form.types';

// === UI COMPONENTS ===
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

// === TASK FEATURES ===
export type {
  TaskFilter,
  TaskPriority,
  ParentTask,
  TaskCreateData,
  TaskUpdateData,
  TaskQueryOptions,
} from './feature-types';

// === UTILITIES ===
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

// Convenience type aliases
export type ApiState = AsyncState;

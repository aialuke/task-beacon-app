/**
 * Main Types Index
 * 
 * Centralized type exports for the entire application.
 * Provides convenient access to all type categories with clear organization.
 */

// === MOST COMMONLY USED TYPES (for convenience) ===
export type {
  // Core shared patterns
  ID,
  Timestamp,
  ApiResponse,
  ApiError,
  FormState,
  ValidationResult,
  LoadingState,
  UserRole,
  Status,
  AsyncState,
  BaseEntity,
} from './shared';

export type {
  // Core entities from feature types
  Task,
  User,
  TaskStatus,
  TaskPriority,
  TaskFilter,
  ParentTask,
} from './feature-types';

// === COMPREHENSIVE EXPORTS BY CATEGORY ===

// Shared/Common Types
export type * from './shared';

// Feature-Specific Types  
export type * from './feature-types';

// Utility Types
export type {
  // Form utilities
  UseFormStateOptions,
  FieldState,
  FieldProps,
  FormConfig,
  FormHelpers,
  
  // Validation utilities (prefixed to avoid conflicts)
  ValidationResult as UtilityValidationResult,
  ValidationDetail,
  ValidationOptions,
  
  // TypeScript helpers
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Merge,
  Override,
  Path,
  PathValue,
  SetPath,
  Brand,
  Branded,
  PropsWithClassName,
  PropsWithChildren,
} from './utility';

// === LEGACY EXPORTS (for backward compatibility) ===
export type {
  Task as TaskType,
  User as UserType,
} from './feature-types'; 
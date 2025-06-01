/**
 * Main Types Index
 * 
 * Centralized type exports for the entire application.
 * Provides convenient access to all type categories.
 */

// Most commonly used types (for convenience)
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
} from './shared';

export type {
  // Core entities from feature types
  Task,
  User,
  TaskStatus,
  TaskFilter,
  ParentTask,
} from './feature-types';

// Comprehensive exports by category
export type * from './shared';
export type * from './feature-types';

// Utility types (avoiding conflicts with shared types)
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

// Legacy exports for backward compatibility
export type {
  Task as TaskType,
  User as UserType,
} from './feature-types';

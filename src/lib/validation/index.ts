/**
 * Unified Validation System - Main Entry Point
 * 
 * Single source of truth for all validation patterns.
 * Consolidates scattered validation logic into a unified API.
 */

// ============================================================================
// CORE VALIDATION SYSTEM
// ============================================================================

export * from './unified-validation';
export * from './schemas';
export * from './validators';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Core schemas
export {
  signInSchema,
  signUpSchema,
  profileUpdateSchema,
  taskFormSchema,
  createTaskSchema,
  paginationSchema,
  sortingSchema,
  fileUploadSchema,
} from './schemas';

// Core validators
export {
  validateSignIn,
  validateSignUp,
  validateProfileUpdate,
  validateTaskForm,
  validateTaskCreation,
  validatePagination,
  validateSorting,
  validateFileUpload,
} from './validators';

// Core validation utilities
export {
  useUnifiedValidation,
  validateUnifiedField,
  validateUnifiedForm,
  validateUnifiedTask,
  validateUnifiedProfile,
  validateUnifiedSignIn,
  validateUnifiedSignUp,
  UNIFIED_VALIDATION_MESSAGES,
} from './unified-validation';

// Helper functions
export {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  toValidationResult,
} from './validators';

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// For backward compatibility with existing imports
export { UNIFIED_VALIDATION_MESSAGES as VALIDATION_MESSAGES } from './unified-validation';
export { toValidationResult as validateWithZod } from './validators';

// Legacy schema aliases
export { signInSchema as signInFormSchema } from './schemas';
export { signUpSchema as signUpFormSchema } from './schemas';
export { taskFormSchema as taskCreateFormSchema } from './schemas';
export { profileUpdateSchema as profileFormSchema } from './schemas';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  SignInInput,
  SignUpInput,
  ProfileUpdateInput,
  ProfileCreateInput,
  TaskPriority,
  TaskStatus,
  BaseTask,
  CreateTaskInput,
  TaskFormInput,
  PaginationInput,
  SortingInput,
  FileUploadInput,
} from './schemas';

export type {
  ValidationResult,
} from './validators';

export type {
  UnifiedValidationResult,
} from './unified-validation'; 
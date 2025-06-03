/**
 * Centralized validation module
 * 
 * Provides comprehensive validation utilities for the application.
 * Includes synchronous format validators, async database validators,
 * and business logic validators.
 */

// Types and constants
export * from './types';

// Error handling utilities
export {
  createSuccessResult,
  createErrorResult,
  createStandardResult,
  createValidationDetail,
  getStandardMessage,
  combineValidationResults,
  withErrorHandling,
} from './error-handling';

// Database validators (async)
export {
  validateUserExists,
  validateTaskExists,
  validateMultipleUsersExist,
  validateMultipleTasksExist,
} from './database-validators';

// Business validators (async)
export {
  validateTaskOwnership,
} from './business-validators';

// Format validators (pure functions)
export {
  validateEmail,
  validateUrl,
  validateUserName,
  validateDueDate,
} from './format-validators';

// Entity validators (composite)
export {
  validateProfileData,
} from './entity-validators';

// Re-export commonly used combinations
export type {
  BasicValidationResult as ValidationResult,
  StandardValidationResult as DetailedValidationResult,
  ValidationContext,
  ValidationErrorCode,
  ValidationWarningCode,
} from './types'; 
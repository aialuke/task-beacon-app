
/**
 * Centralized validation module
 * 
 * Provides comprehensive validation utilities for the application.
 * Includes synchronous format validators, async database validators,
 * and business logic validators.
 */

// === TYPES AND CONSTANTS ===
export * from './types';

// === ERROR HANDLING UTILITIES ===
export {
  createSuccessResult,
  createErrorResult,
  createStandardResult,
  createValidationDetail,
  getStandardMessage,
  combineValidationResults,
  withErrorHandling,
} from './error-handling';

// === DATABASE VALIDATORS (ASYNC) ===
export {
  validateUserExists,
  validateTaskExists,
  validateMultipleUsersExist,
  validateMultipleTasksExist,
} from './database-validators';

// === BUSINESS VALIDATORS (ASYNC) ===
export {
  validateTaskOwnership,
} from './business-validators';

// === FORMAT VALIDATORS (PURE FUNCTIONS) ===
export {
  validateEmail,
  validateUserName,
  validateDueDate,
} from './format-validators';

// === ENTITY VALIDATORS (COMPOSITE) ===
export {
  validateProfileData,
} from './entity-validators';

// === RE-EXPORT COMMONLY USED COMBINATIONS ===
export type {
  BasicValidationResult as ValidationResult,
  StandardValidationResult as DetailedValidationResult,
  ValidationContext,
  ValidationErrorCode,
  ValidationWarningCode,
} from './types';

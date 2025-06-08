
/**
 * Centralized validation module - Optimized Exports
 * 
 * Provides comprehensive validation utilities for the application.
 * Includes synchronous format validators, async database validators,
 * and business logic validators.
 */

// === EXTERNAL LIBRARIES ===
// (none currently used directly)

// === INTERNAL UTILITIES ===
// (validation utilities are self-contained)

// === TYPES AND CONSTANTS ===
export * from './types';

// === ERROR HANDLING UTILITIES ===
export {
  createSuccessResult,
  createErrorResult,
  createStandardResult,
  createValidationDetail,
  combineValidationResults,
} from './result-creators';

export {
  getStandardMessage,
} from './message-constants';

export {
  withErrorHandling,
} from './async-wrapper';

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

// === RE-EXPORT COMMONLY USED TYPES ===
export type {
  BasicValidationResult as ValidationResult,
  StandardValidationResult as DetailedValidationResult,
  ValidationContext,
  ValidationErrorCode,
  ValidationWarningCode,
} from './types';
// CodeRabbit review

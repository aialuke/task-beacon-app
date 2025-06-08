
/**
 * Validation Module - Consolidated Core Functions
 * 
 * Unified validation interface combining database, business, and format validation.
 * Eliminates duplication between database validators and service validators.
 */

// === TYPES ===
export type {
  BasicValidationResult as ValidationResult,
  ValidationContext,
  ValidationErrorCode,
  ValidationWarningCode,
} from './types';

// === ESSENTIAL DATABASE VALIDATORS ===
export {
  validateUserExists,
  validateTaskExists,
  validateMultipleUsersExist,
  validateMultipleTasksExist,
} from './database-validators';

// === BUSINESS LOGIC VALIDATORS ===
export {
  validateTaskOwnership,
} from './business-validators';

// === CONSOLIDATED ENTITY VALIDATORS ===
export {
  validateProfileData,
} from './entity-validators';

// === ERROR HANDLING UTILITIES ===
export {
  createSuccessResult,
  createErrorResult,
  withErrorHandling,
} from './result-creators';

// === MESSAGE HANDLING ===
export {
  getStandardMessage,
} from './message-constants';

// === INTEGRATION WITH NEW VALIDATION UTILS ===
export {
  validateField,
  validateForm,
  validateFieldAsync,
  validateFormAsync,
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isValidUserName,
  isValidTaskTitle,
  isValidTaskDescription,
  isDateInFuture,
} from '@/lib/utils/validation';

// === CONSOLIDATED DATABASE OPERATIONS ===
// These replace the duplicate validation methods from database.service.ts
export {
  validateUsersByEmail,
  validateBatchUserExistence,
  validateEntityExistence,
} from './database-operations';

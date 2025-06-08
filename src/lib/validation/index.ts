
/**
 * Validation Module - Streamlined Core Functions
 * 
 * Simplified to focus only on essential database and business validation.
 * Now integrates with the new modular validation utilities.
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

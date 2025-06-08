
/**
 * Validation Module - Clean Interface
 * 
 * Provides a unified interface to all validation utilities.
 */

// === CORE VALIDATION ===
export {
  isValidText,
  isValidEmailFormat,
  isValidUrlFormat,
  validateField,
  validateForm,
  type ValidationResult,
} from './core-validation';

// === ASYNC VALIDATION ===
export {
  validateFieldAsync,
  validateFormAsync,
} from './async-validation';

// === FIELD-SPECIFIC VALIDATION ===
export {
  isValidUserName,
  isValidTaskTitle,
  isValidTaskDescription,
  isDateInFuture,
  isValidUrl,
  isValidEmail,
  isValidPassword,
} from './field-validation';

// === RE-EXPORTS FROM CENTRALIZED SCHEMAS ===
export {
  // Validation functions
  validateWithZod,
  validateFormWithZod,
  
  // Schemas
  emailSchema,
  passwordSchema,
  userNameSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
  futureDateSchema,
  
  // Types
  type ValidationResult as ZodValidationResult,
} from '@/schemas';

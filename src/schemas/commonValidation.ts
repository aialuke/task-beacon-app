
/**
 * Common Validation - Legacy Compatibility Layer
 * 
 * Re-exports from the new centralized validation system for backward compatibility.
 * This file provides the same interface as before while using the new Zod-based system.
 */

// Re-export core validation functions for backward compatibility
export {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  emailSchema,
  passwordSchema,
  userNameSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
  futureDateSchema,
  createTextSchema,
  validateWithZod,
  validateFormWithZod,
  VALIDATION_MESSAGES,
} from './validation';

// Re-export common schemas
export {
  paginationSchema,
  sortingSchema,
  searchFormSchema,
  fileUploadSchema,
  validatePagination,
  validateSorting,
  validateFileUpload,
} from './common.schemas';

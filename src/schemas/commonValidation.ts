
/**
 * Common Validation - Cleaned Legacy Compatibility
 * 
 * Simplified re-exports from the centralized validation system.
 */

// Re-export core validation functions
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

/**
 * Validation utilities public API
 * 
 * This file maintains backward compatibility by re-exporting all validation
 * functions from their new modular locations. Import paths can remain the same.
 */

// Export standardized types
export type { 
  BasicValidationResult as ValidationResult,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationContext,
  StandardValidationResult,
  StandardValidationDetail,
  AsyncValidationConfig
} from './types';

// Export error handling utilities
export {
  createSuccessResult,
  createErrorResult,
  createStandardResult,
  combineValidationResults,
  getStandardMessage,
  StandardErrorMessages,
  StandardWarningMessages
} from './error-handling';

// Database validators (async operations)
export {
  validateUserExists,
  validateTaskExists,
  // New batch validation functions
  validateMultipleUsersExist,
  validateMultipleTasksExist,
  validateUsersAndTasksExist
} from './database-validators';

// Business validators (domain rules)
export {
  validateTaskOwnership,
} from './business-validators';

// Format validators (pure functions)
export {
  validateEmail,
  validateUrl,
  validateTaskTitle,
  validateTaskDescription,
  validateUserName,
  validateDueDate,
} from './format-validators';

// Entity validators (composite validation)
export {
  validateTaskData,
  validateProfileData,
} from './entity-validators';

// Database operations (centralized utilities)
export {
  DatabaseValidationOps,
  validateMultipleExistence,
  validateEntityCollection,
  type ValidationQueryOptions,
  type BatchExistenceRequest,
  type BatchExistenceResult,
  type TaskOwnershipData
} from './database-operations';

// Convenience exports for organized imports
export * as DatabaseValidators from './database-validators';
export * as BusinessValidators from './business-validators';
export * as FormatValidators from './format-validators';
export * as EntityValidators from './entity-validators';
export * as DatabaseOperations from './database-operations';
export * as ValidationTypes from './types';
export * as ErrorHandling from './error-handling'; 
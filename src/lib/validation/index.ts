
/**
 * Simplified Validation Module - Phase 4 Cleanup
 * 
 * Streamlined to focus on essential database and business validation.
 * Format validation has been moved to the centralized Zod system.
 */

// === TYPES ===
export type {
  BasicValidationResult as ValidationResult,
  StandardValidationResult as DetailedValidationResult,
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

// === SIMPLIFIED MESSAGE HANDLING ===
export {
  getStandardMessage,
} from './message-constants';

// === REMOVED COMPLEX UTILITIES ===
// The following have been simplified or moved to centralized Zod system:
// - Format validators (moved to @/schemas)
// - Complex entity validators (simplified)
// - Over-engineered result creators (streamlined)
// - Redundant validation patterns (consolidated)

// === MIGRATION NOTICE ===
// For format validation (email, password, etc.), use the centralized Zod system:
// import { emailSchema, passwordSchema, validateWithZod } from '@/schemas';

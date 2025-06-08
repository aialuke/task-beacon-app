
/**
 * Validation Utilities - Simplified Redirect Layer
 * 
 * This file now only provides essential redirects to the centralized Zod validation system.
 * All legacy validation logic has been removed.
 */

// === CORE VALIDATION EXPORTS ===
export {
  // Core validation functions
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isDateInFuture,
  
  // Validation schemas
  emailSchema,
  passwordSchema,
  userNameSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
  futureDateSchema,
  
  // Validation utilities
  validateWithZod,
  validateFormWithZod,
  
  // Types
  type ValidationResult,
} from '@/schemas';

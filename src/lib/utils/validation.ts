
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

// === ADDITIONAL VALIDATION FUNCTIONS FOR COMPATIBILITY ===

/**
 * User name validation using centralized schema
 */
export function isValidUserName(name: string): boolean {
  const result = userNameSchema.safeParse(name);
  return result.success;
}

/**
 * Task title validation using centralized schema
 */
export function isValidTaskTitle(title: string): boolean {
  const result = taskTitleSchema.safeParse(title);
  return result.success;
}

/**
 * Task description validation using centralized schema
 */
export function isValidTaskDescription(description: string): boolean {
  const result = taskDescriptionSchema.safeParse(description);
  return result.success;
}

/**
 * Generic text validation
 */
export function isValidText(text: string, minLength = 0, maxLength = 1000): boolean {
  if (typeof text !== 'string') return false;
  return text.length >= minLength && text.length <= maxLength;
}

/**
 * Field validation utility
 */
export function validateField(fieldName: string, value: unknown): ValidationResult {
  switch (fieldName.toLowerCase()) {
    case 'email':
      return validateWithZod(emailSchema, value);
    case 'password':
      return validateWithZod(passwordSchema, value);
    case 'title':
      return validateWithZod(taskTitleSchema, value);
    case 'description':
      return validateWithZod(taskDescriptionSchema, value);
    case 'url':
      return validateWithZod(urlSchema, value);
    case 'name':
      return validateWithZod(userNameSchema, value);
    default:
      return { isValid: true, errors: [] };
  }
}

/**
 * Form validation utility
 */
export function validateForm(data: Record<string, unknown>): ValidationResult {
  const schemas: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    switch (key.toLowerCase()) {
      case 'email':
        schemas[key] = emailSchema;
        break;
      case 'password':
        schemas[key] = passwordSchema;
        break;
      case 'title':
        schemas[key] = taskTitleSchema;
        break;
      case 'description':
        schemas[key] = taskDescriptionSchema;
        break;
      case 'url':
        schemas[key] = urlSchema;
        break;
      case 'name':
        schemas[key] = userNameSchema;
        break;
    }
  });
  
  const result = validateFormWithZod(data, schemas);
  
  const errors: string[] = [];
  if (!result.isValid && result.errors) {
    Object.values(result.errors).forEach(fieldErrors => {
      if (fieldErrors && fieldErrors.length > 0) {
        errors.push(...fieldErrors);
      }
    });
  }
  
  return {
    isValid: result.isValid,
    errors,
  };
}

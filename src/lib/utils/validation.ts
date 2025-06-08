
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
  const { userNameSchema, validateWithZod } = require('@/schemas');
  const result = validateWithZod(userNameSchema, name);
  return result.isValid;
}

/**
 * Task title validation using centralized schema
 */
export function isValidTaskTitle(title: string): boolean {
  const { taskTitleSchema, validateWithZod } = require('@/schemas');
  const result = validateWithZod(taskTitleSchema, title);
  return result.isValid;
}

/**
 * Task description validation using centralized schema
 */
export function isValidTaskDescription(description: string): boolean {
  const { taskDescriptionSchema, validateWithZod } = require('@/schemas');
  const result = validateWithZod(taskDescriptionSchema, description);
  return result.isValid;
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
export function validateField(fieldName: string, value: unknown): { isValid: boolean; errors: string[] } {
  const { 
    emailSchema, 
    passwordSchema, 
    taskTitleSchema, 
    taskDescriptionSchema, 
    urlSchema, 
    userNameSchema,
    validateWithZod 
  } = require('@/schemas');

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
export function validateForm(data: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const { 
    emailSchema, 
    passwordSchema, 
    taskTitleSchema, 
    taskDescriptionSchema, 
    urlSchema, 
    userNameSchema,
    validateFormWithZod 
  } = require('@/schemas');

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
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        errors.push(...fieldErrors);
      }
    });
  }
  
  return {
    isValid: result.isValid,
    errors,
  };
}

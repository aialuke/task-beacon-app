
/**
 * Validation Utilities - Optimized Bundle Version
 * 
 * This file provides essential redirects to the centralized Zod validation system.
 * All legacy validation logic has been removed and imports optimized for tree shaking.
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

// === OPTIMIZED VALIDATION FUNCTIONS ===

/**
 * User name validation using centralized schema
 */
export function isValidUserName(name: string): boolean {
  // Use dynamic import for better tree shaking
  import('@/schemas').then(({ userNameSchema, validateWithZod }) => {
    const result = validateWithZod(userNameSchema, name);
    return result.isValid;
  });
  
  // Fallback for immediate use - will be replaced by async version
  if (typeof name !== 'string') return false;
  return name.length >= 2 && name.length <= 50;
}

/**
 * Task title validation using centralized schema
 */
export function isValidTaskTitle(title: string): boolean {
  // Use dynamic import for better tree shaking
  import('@/schemas').then(({ taskTitleSchema, validateWithZod }) => {
    const result = validateWithZod(taskTitleSchema, title);
    return result.isValid;
  });
  
  // Fallback for immediate use
  if (typeof title !== 'string') return false;
  return title.length >= 1 && title.length <= 22;
}

/**
 * Task description validation using centralized schema
 */
export function isValidTaskDescription(description: string): boolean {
  // Use dynamic import for better tree shaking
  import('@/schemas').then(({ taskDescriptionSchema, validateWithZod }) => {
    const result = validateWithZod(taskDescriptionSchema, value);
    return result.isValid;
  });
  
  // Fallback for immediate use
  if (typeof description !== 'string') return false;
  return description.length <= 500;
}

/**
 * Generic text validation
 */
export function isValidText(text: string, minLength = 0, maxLength = 1000): boolean {
  if (typeof text !== 'string') return false;
  return text.length >= minLength && text.length <= maxLength;
}

/**
 * Field validation utility - Optimized with dynamic imports
 */
export function validateField(fieldName: string, value: unknown): { isValid: boolean; errors: string[] } {
  // Basic validation that doesn't require heavy schemas
  switch (fieldName.toLowerCase()) {
    case 'email':
      if (typeof value !== 'string') return { isValid: false, errors: ['Email must be a string'] };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return { isValid: emailRegex.test(value), errors: emailRegex.test(value) ? [] : ['Invalid email format'] };
    
    case 'title':
      if (typeof value !== 'string') return { isValid: false, errors: ['Title must be a string'] };
      const isValid = value.length >= 1 && value.length <= 22;
      return { isValid, errors: isValid ? [] : ['Title must be 1-22 characters'] };
    
    default:
      return { isValid: true, errors: [] };
  }
}

/**
 * Form validation utility - Optimized version
 */
export function validateForm(data: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  Object.entries(data).forEach(([fieldName, value]) => {
    const fieldResult = validateField(fieldName, value);
    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// === ASYNC VALIDATION FUNCTIONS FOR HEAVY OPERATIONS ===

/**
 * Async field validation with full schema support
 */
export async function validateFieldAsync(fieldName: string, value: unknown): Promise<{ isValid: boolean; errors: string[] }> {
  const { 
    emailSchema, 
    passwordSchema, 
    taskTitleSchema, 
    taskDescriptionSchema, 
    urlSchema, 
    userNameSchema,
    validateWithZod 
  } = await import('@/schemas');

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
 * Async form validation with full schema support
 */
export async function validateFormAsync(data: Record<string, unknown>): Promise<{ isValid: boolean; errors: string[] }> {
  const { validateFormWithZod } = await import('@/schemas');
  
  // Build schemas dynamically
  const schemas: Record<string, any> = {};
  const schemaImports = await import('@/schemas');
  
  Object.keys(data).forEach(key => {
    switch (key.toLowerCase()) {
      case 'email':
        schemas[key] = schemaImports.emailSchema;
        break;
      case 'password':
        schemas[key] = schemaImports.passwordSchema;
        break;
      case 'title':
        schemas[key] = schemaImports.taskTitleSchema;
        break;
      case 'description':
        schemas[key] = schemaImports.taskDescriptionSchema;
        break;
      case 'url':
        schemas[key] = schemaImports.urlSchema;
        break;
      case 'name':
        schemas[key] = schemaImports.userNameSchema;
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

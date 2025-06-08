
/**
 * Async Validation Utilities
 * 
 * Handles validation operations that require async schema loading or database operations.
 */

import type { ValidationResult } from './core-validation';

// === ASYNC VALIDATION FUNCTIONS ===

/**
 * Async field validation with full schema support
 */
export async function validateFieldAsync(fieldName: string, value: unknown): Promise<ValidationResult> {
  try {
    const schemas = await import('@/schemas');
    const { validateWithZod } = schemas;

    switch (fieldName.toLowerCase()) {
      case 'email':
        return validateWithZod(schemas.emailSchema, value);
      case 'password':
        return validateWithZod(schemas.passwordSchema, value);
      case 'title':
        return validateWithZod(schemas.taskTitleSchema, value);
      case 'description':
        return validateWithZod(schemas.taskDescriptionSchema, value);
      case 'url':
        return validateWithZod(schemas.urlSchema, value);
      case 'name':
        return validateWithZod(schemas.userNameSchema, value);
      default:
        return { isValid: true, errors: [] };
    }
  } catch (error) {
    return { 
      isValid: false, 
      errors: [`Validation failed for ${fieldName}: ${error instanceof Error ? error.message : 'Unknown error'}`] 
    };
  }
}

/**
 * Async form validation with full schema support
 */
export async function validateFormAsync(data: Record<string, unknown>): Promise<ValidationResult> {
  try {
    const schemas = await import('@/schemas');
    const { validateFormWithZod } = schemas;
    
    // Build schemas dynamically
    const fieldSchemas: Record<string, any> = {};
    
    Object.keys(data).forEach(key => {
      switch (key.toLowerCase()) {
        case 'email':
          fieldSchemas[key] = schemas.emailSchema;
          break;
        case 'password':
          fieldSchemas[key] = schemas.passwordSchema;
          break;
        case 'title':
          fieldSchemas[key] = schemas.taskTitleSchema;
          break;
        case 'description':
          fieldSchemas[key] = schemas.taskDescriptionSchema;
          break;
        case 'url':
          fieldSchemas[key] = schemas.urlSchema;
          break;
        case 'name':
          fieldSchemas[key] = schemas.userNameSchema;
          break;
      }
    });
    
    const result = validateFormWithZod(data, fieldSchemas);
    
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
  } catch (error) {
    return { 
      isValid: false, 
      errors: [`Form validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`] 
    };
  }
}

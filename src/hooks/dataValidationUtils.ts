
/**
 * Data Validation Utilities - Simplified
 * 
 * Streamlined to use centralized Zod validation system.
 */

import { 
  validateWithZod,
  validateFormWithZod,
  emailSchema,
  passwordSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
  type ValidationResult,
} from '@/schemas';

/**
 * Validation error display utility
 */
export function showValidationErrors(errors: Record<string, string[]> | string[]) {
  if (Array.isArray(errors)) {
    return {
      errors: errors,
      warnings: [],
      isValid: errors.length === 0,
    };
  }
  
  const flatErrors: string[] = [];
  Object.values(errors).forEach(fieldErrors => {
    flatErrors.push(...fieldErrors);
  });
  
  return {
    errors: flatErrors,
    warnings: [],
    isValid: flatErrors.length === 0,
  };
}

/**
 * Data validation using centralized Zod schemas
 */
export function validateAndShowErrors(data: Record<string, unknown>) {
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
      default:
        schemas[key] = emailSchema.optional();
    }
  });
  
  const validationResult = validateFormWithZod(data, schemas);
  
  if (validationResult.isValid) {
    return showValidationErrors([]);
  }
  
  return showValidationErrors(validationResult.errors || {});
}

/**
 * Single field validation
 */
export function validateSingleField(fieldName: string, value: unknown): ValidationResult {
  let schema: any;
  
  switch (fieldName.toLowerCase()) {
    case 'email':
      schema = emailSchema;
      break;
    case 'password':
      schema = passwordSchema;
      break;
    case 'title':
      schema = taskTitleSchema;
      break;
    case 'description':
      schema = taskDescriptionSchema;
      break;
    case 'url':
      schema = urlSchema;
      break;
    default:
      schema = emailSchema.optional();
  }
  
  const result = validateWithZod(schema, value);
  
  return {
    isValid: result.isValid,
    errors: result.isValid ? [] : result.errors,
    data: result.isValid ? value : undefined,
  };
}

/**
 * Multiple field validation
 */
export function validateMultipleFields(fields: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  let isValid = true;
  
  Object.entries(fields).forEach(([fieldName, value]) => {
    const fieldResult = validateSingleField(fieldName, value);
    if (!fieldResult.isValid) {
      isValid = false;
      errors.push(...fieldResult.errors);
    }
  });
  
  return {
    isValid,
    errors,
    data: isValid ? fields : undefined,
  };
}


/**
 * Validation Utilities Hook - Phase 2 Update
 * 
 * Enhanced to use centralized Zod validation system from Phase 1.
 * Provides backward-compatible interface while leveraging new validation infrastructure.
 */

// === EXTERNAL LIBRARIES ===
import { z } from 'zod';

// === INTERNAL UTILITIES ===
import { 
  validateWithZod,
  validateFormWithZod,
  emailSchema,
  passwordSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  urlSchema,
} from '@/schemas';

// === TYPES ===
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidationOptions {
  stopOnFirstError?: boolean;
}

/**
 * Enhanced object validation using centralized Zod schemas
 */
export function validateObject<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const { stopOnFirstError = false } = options;
  
  const result = validateWithZod(schema, data);
  
  if (result.isValid) {
    return { isValid: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  result.errors.forEach((error, index) => {
    const key = `field_${index}`;
    errors[key] = error;
    if (stopOnFirstError) return;
  });
  
  return {
    isValid: false,
    errors,
    firstError: result.errors[0],
  };
}

/**
 * Enhanced field validation using centralized schemas
 */
export function validateFieldValue(field: string, value: string): ValidationResult {
  let schema: z.ZodSchema<any>;
  
  switch (field.toLowerCase()) {
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
      // For unknown fields, create a basic string schema
      schema = z.string().optional();
  }
  
  const result = validateWithZod(schema, value);
  
  return {
    isValid: result.isValid,
    errors: result.isValid ? {} : { [field]: result.errors[0] || 'Validation failed' },
    firstError: result.isValid ? undefined : result.errors[0],
  };
}

/**
 * Enhanced form validation using centralized Zod system
 */
export function validateFormData(data: Record<string, unknown>): ValidationResult {
  // Create dynamic schema based on field names
  const schemas: Record<string, z.ZodSchema<any>> = {};
  
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
        schemas[key] = z.string().optional();
    }
  });
  
  const formResult = validateFormWithZod(data, schemas);
  
  const errors: Record<string, string> = {};
  if (!formResult.isValid && formResult.errors) {
    Object.entries(formResult.errors).forEach(([field, fieldErrors]) => {
      if (fieldErrors && fieldErrors.length > 0) {
        errors[field] = fieldErrors[0];
      }
    });
  }
  
  return {
    isValid: formResult.isValid,
    errors,
    firstError: Object.values(errors)[0],
  };
}

/**
 * Backward compatibility function for validation with error
 */
export function validateWithError<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  return validateObject(schema, data, { stopOnFirstError: true });
}

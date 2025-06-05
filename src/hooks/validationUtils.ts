
/**
 * Validation Utilities Hook - Phase 4 Consolidation
 * 
 * Now uses the unified validation system to eliminate duplication.
 * Provides a hook-friendly interface while leveraging centralized validation.
 */

// === EXTERNAL LIBRARIES ===
import { z } from 'zod';

// === INTERNAL UTILITIES ===
import { 
  validateForm as utilValidateForm,
  validateField as utilValidateField,
  type ValidationResult as UtilValidationResult 
} from '@/lib/utils/validation';

// === TYPES ===
// Maintain compatibility with existing hook interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface ValidationOptions {
  stopOnFirstError?: boolean;
}

/**
 * Converts utility validation result to hook-compatible format
 */
function convertValidationResult(utilResult: UtilValidationResult): ValidationResult {
  if (utilResult.isValid) {
    return { isValid: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  utilResult.errors.forEach((error, index) => {
    errors[index.toString()] = error;
  });
  
  return {
    isValid: false,
    errors,
    firstError: utilResult.errors[0],
  };
}

/**
 * Validates an object using Zod schema with unified error handling
 */
export function validateObject<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const { stopOnFirstError = false } = options;
  
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
        if (stopOnFirstError) break;
      }
      const firstError = Object.values(errors)[0];
      return {
        isValid: false,
        errors,
        firstError,
      };
    }
    const errorMessage = 'Validation failed';
    return {
      isValid: false,
      errors: { general: errorMessage },
      firstError: errorMessage,
    };
  }
}

/**
 * Validates with error using consolidated utility system
 */
export function validateWithError<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  return validateObject(schema, data, { stopOnFirstError: true });
}

/**
 * Hook-friendly validation using consolidated field validation
 */
export function validateFieldValue(field: string, value: string): ValidationResult {
  const utilResult = utilValidateField(field, value);
  return convertValidationResult(utilResult);
}

/**
 * Hook-friendly form validation using consolidated form validation
 */
export function validateFormData(data: Record<string, unknown>): ValidationResult {
  const utilResult = utilValidateForm(data);
  return convertValidationResult(utilResult);
}


/**
 * Validation Utilities Hook - Updated for Modular System
 * 
 * Streamlined to use the new modular validation system.
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

import {
  validateField,
  validateForm,
  type ValidationResult,
} from '@/lib/utils/validation';

// === TYPES ===
export interface ValidationOptions {
  stopOnFirstError?: boolean;
}

/**
 * Object validation using centralized Zod schemas
 */
export function validateObject<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const result = validateWithZod(schema, data);
  
  if (result.isValid) {
    return { isValid: true, errors: [] };
  }
  
  return {
    isValid: false,
    errors: result.errors,
  };
}

/**
 * Field validation using the new modular system
 */
export function validateFieldValue(field: string, value: string): ValidationResult {
  return validateField(field, value);
}

/**
 * Form validation using the new modular system
 */
export function validateFormData(data: Record<string, unknown>): ValidationResult {
  return validateForm(data);
}

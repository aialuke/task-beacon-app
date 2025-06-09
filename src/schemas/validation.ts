/**
 * Validation Schemas - Phase 2 Consolidated
 * 
 * Uses unified validation system to eliminate duplication.
 * Re-exports from unified-validation.ts for backward compatibility.
 */

import { z } from 'zod';

// === UNIFIED VALIDATION IMPORTS ===
export {
  UNIFIED_VALIDATION_MESSAGES as VALIDATION_MESSAGES,
  unifiedEmailSchema as emailSchema,
  unifiedPasswordSchema as passwordSchema,
  unifiedUserNameSchema as userNameSchema,
  unifiedTaskTitleSchema as taskTitleSchema,
  unifiedTaskDescriptionSchema as taskDescriptionSchema,
  unifiedUrlSchema as urlSchema,
  createUnifiedTextSchema as createTextSchema,
  validateUnifiedField as validateField,
  validateUnifiedForm as validateFormWithZod,
  useUnifiedValidation,
} from '@/lib/validation/unified-validation';

// === LEGACY INTERFACES FOR COMPATIBILITY ===

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: unknown;
}

// === LEGACY VALIDATION FUNCTION ===

/**
 * Legacy validation function for backward compatibility
 * @deprecated Use unified validation functions instead
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  try {
    const result = schema.parse(data);
    return {
      isValid: true,
      errors: [],
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => err.message),
        data: undefined,
      };
    }
    
    return {
      isValid: false,
      errors: ['Validation failed with unknown error'],
      data: undefined,
    };
  }
}

// === FUTURE DATE VALIDATION FOR BACKWARD COMPATIBILITY ===

/**
 * @deprecated Use unified validation instead
 */
export const futureDateSchema = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(''))
  .refine(
    (date) => {
      if (!date || typeof date !== 'string') return true;
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return false;
      const now = new Date();
      return dateObj > now;
    },
    'Date cannot be in the past'
  );

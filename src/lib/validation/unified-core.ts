/**
 * Unified Validation Core - Core Validation Functions
 *
 * Core validation logic and result processing.
 * Provides the foundation for all validation operations.
 */

import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface UnifiedValidationResult<T = unknown> {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: T;
  fieldErrors?: Record<string, string>;
}

/**
 * Profile-specific validation result interface
 */
export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  fieldErrors: {
    name?: string;
    email?: string;
    avatar_url?: string;
  };
}

/**
 * Generic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Zod validation result type
 */
export type ZodValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
    };

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Core validation function using Zod schemas
 */
export function validateWithUnifiedSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): UnifiedValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      errors: [],
      data: result.data,
    };
  }

  const errors = result.error.errors.map(err => err.message);

  return {
    isValid: false,
    errors,
  };
}

/**
 * Field-level validation with dynamic schema selection
 */
export async function validateUnifiedField(
  fieldName: string,
  value: unknown
): Promise<UnifiedValidationResult<unknown>> {
  // Import schemas dynamically to avoid circular dependencies
  const {
    unifiedEmailSchema,
    unifiedPasswordSchema,
    unifiedUserNameSchema,
    unifiedTaskTitleSchema,
    unifiedTaskDescriptionSchema,
    unifiedUrlSchema,
  } = await import('./unified-schemas');

  const fieldSchemas: Record<string, z.ZodSchema<unknown>> = {
    email: unifiedEmailSchema,
    password: unifiedPasswordSchema,
    name: unifiedUserNameSchema,
    userName: unifiedUserNameSchema,
    title: unifiedTaskTitleSchema,
    taskTitle: unifiedTaskTitleSchema,
    description: unifiedTaskDescriptionSchema,
    taskDescription: unifiedTaskDescriptionSchema,
    url: unifiedUrlSchema,
  };

  const schema = fieldSchemas[fieldName];
  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown field: ${fieldName}`],
    };
  }

  return validateWithUnifiedSchema(schema, value);
}

/**
 * Multi-field form validation
 */
export function validateUnifiedForm<T extends Record<string, unknown>>(
  data: T,
  schemas: Partial<Record<keyof T, z.ZodSchema<unknown>>>
): UnifiedValidationResult<Partial<T>> {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};
  const validatedData: Partial<T> = {};
  let isValid = true;

  for (const [field, schema] of Object.entries(schemas) as [
    keyof T,
    z.ZodSchema<unknown>,
  ][]) {
    const fieldResult = validateWithUnifiedSchema(schema, data[field]);

    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors);
      fieldErrors[field as string] =
        fieldResult.errors[0] || 'Validation failed';
      isValid = false;
    } else if (fieldResult.data !== undefined) {
      validatedData[field] = fieldResult.data as T[keyof T];
    }
  }

  return {
    isValid,
    errors,
    fieldErrors: isValid ? undefined : fieldErrors,
    data: isValid ? validatedData : undefined,
  };
}


/**
 * Validation Functions - Legacy Support & Utility Functions
 *
 * Provides validation functions for use across the application.
 * Acts as a bridge between old validation patterns and new unified schemas.
 */

import { z, ZodError } from 'zod';

import {
  unifiedSignInSchema,
  unifiedSignUpSchema,
  unifiedProfileUpdateSchema,
  unifiedTaskFormSchema,
} from './unified-schemas';

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    errors: Array<{
      field: string;
      message: string;
      path: string[];
    }>;
  };
}

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Generic Zod validator function
 */
function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            path: err.path as string[],
          })),
        },
      };
    }

    return {
      success: false,
      error: {
        message: 'Unknown validation error',
        errors: [],
      },
    };
  }
}

// ============================================================================
// AUTHENTICATION VALIDATORS
// ============================================================================

/**
 * Validate sign-in data
 */
export function validateSignIn(data: unknown): ValidationResult {
  return validateWithZod(unifiedSignInSchema, data);
}

/**
 * Validate sign-up data
 */
export function validateSignUp(data: unknown): ValidationResult {
  return validateWithZod(unifiedSignUpSchema, data);
}

// ============================================================================
// PROFILE VALIDATORS
// ============================================================================

/**
 * Validate profile update data
 */
export function validateProfileUpdate(data: unknown): ValidationResult {
  return validateWithZod(unifiedProfileUpdateSchema, data);
}

// ============================================================================
// TASK VALIDATORS
// ============================================================================

/**
 * Validate task form data
 */
export function validateTaskForm(data: unknown): ValidationResult {
  return validateWithZod(unifiedTaskFormSchema, data);
}

// ============================================================================
// FIELD-SPECIFIC VALIDATORS
// ============================================================================

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) return false;

  const [, domain] = email.split('@');
  return Boolean(domain && domain.includes('.') && domain.length > 2);
}

/**
 * Password strength validation
 */
export function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

/**
 * URL validation
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    // Check for domain-like patterns
    const domainPattern =
      /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(url.trim());
  }
}

/**
 * Required field validation
 */
export function validateRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

/**
 * Text length validation
 */
export function validateLength(
  text: string,
  min: number = 0,
  max: number = Infinity
): boolean {
  if (!text || typeof text !== 'string') return min === 0;
  const length = text.trim().length;
  return length >= min && length <= max;
}

/**
 * Numeric range validation
 */
export function validateRange(
  value: number,
  min: number = -Infinity,
  max: number = Infinity
): boolean {
  if (typeof value !== 'number' || isNaN(value)) return false;
  return value >= min && value <= max;
}

/**
 * Date validation
 */
export function validateDate(date: string | Date): boolean {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * Future date validation
 */
export function validateFutureDate(date: string | Date): boolean {
  if (!validateDate(date)) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  return dateObj > now;
}

// ============================================================================
// COMPOSITE VALIDATORS
// ============================================================================

/**
 * Validate multiple fields with custom rules
 */
export function validateFields(
  data: Record<string, unknown>,
  rules: Record<string, (value: unknown) => boolean>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validator]) => {
    const value = data[field];
    if (!validator(value)) {
      errors[field] = `Invalid ${field}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Async validation wrapper
 */
export async function validateAsync<T>(
  validator: () => Promise<T>
): Promise<ValidationResult<T>> {
  try {
    const result = await validator();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Validation failed',
        errors: [],
      },
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clean validation data by removing empty strings and null values
 */
export function cleanValidationData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

/**
 * Transform validation errors to field-specific format
 */
export function transformValidationErrors(
  errors: ZodError
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  errors.errors.forEach(error => {
    const field = error.path.join('.');
    fieldErrors[field] = error.message;
  });

  return fieldErrors;
}

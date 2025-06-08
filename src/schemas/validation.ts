/**
 * Centralized Zod Validation Schemas - Phase 1 Implementation
 * 
 * This file consolidates all validation logic into a single Zod-based system.
 * Replaces the multiple validation approaches identified in the audit.
 */

import { z } from 'zod';

// === VALIDATION RESULT TYPE ===
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: unknown;
}

// === VALIDATION MESSAGES ===
export const VALIDATION_MESSAGES = {
  // Email validation
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  
  // Password validation
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_WEAK: 'Password must contain uppercase, lowercase, number, and special character',
  
  // User validation
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name cannot exceed 50 characters',
  
  // Task validation
  TITLE_REQUIRED: 'Task title is required',
  TITLE_TOO_LONG: 'Title cannot exceed 22 characters',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 500 characters',
  
  // URL validation
  URL_INVALID: 'Please enter a valid URL',
  
  // Date validation
  DATE_INVALID: 'Please enter a valid date',
  DATE_IN_PAST: 'Date cannot be in the past',
  
  // General validation
  REQUIRED_FIELD: 'This field is required',
} as const;

// === ENHANCED VALIDATION FUNCTIONS ===

/**
 * Enhanced email validation with domain checking
 */
const isValidEmailEnhanced = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email.trim())) return false;
  
  // Additional domain validation
  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
};

/**
 * Enhanced password validation with comprehensive rules
 */
const isValidPasswordEnhanced = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&     // Uppercase letter
    /[a-z]/.test(password) &&     // Lowercase letter
    /[0-9]/.test(password) &&     // Number
    /[^A-Za-z0-9]/.test(password) // Special character
  );
};

/**
 * Enhanced URL validation that accepts domains without protocol
 */
const isValidUrlEnhanced = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true; // Allow empty URLs
  
  const trimmed = url.trim();
  if (!trimmed) return true;
  
  // Check if it already has a protocol
  if (/^https?:\/\//.test(trimmed)) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }
  
  // Check for domain pattern without protocol
  const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return domainPattern.test(trimmed);
};

/**
 * Enhanced future date validation
 */
const isDateInFuture = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== 'string') return true; // Allow empty dates
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const now = new Date();
  return date > now;
};

// === CORE ZOD SCHEMAS ===

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .refine(isValidEmailEnhanced, VALIDATION_MESSAGES.EMAIL_INVALID);

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  .refine(isValidPasswordEnhanced, VALIDATION_MESSAGES.PASSWORD_TOO_WEAK);

/**
 * User name validation schema
 */
export const userNameSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.NAME_REQUIRED)
  .min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(50, VALIDATION_MESSAGES.NAME_TOO_LONG)
  .transform(str => str.trim());

/**
 * Task title validation schema
 */
export const taskTitleSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
  .max(22, VALIDATION_MESSAGES.TITLE_TOO_LONG)
  .transform(str => str.trim());

/**
 * Task description validation schema
 */
export const taskDescriptionSchema = z
  .string()
  .max(500, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional()
  .nullable()
  .transform(val => val?.trim() || null);

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .refine(isValidUrlEnhanced, VALIDATION_MESSAGES.URL_INVALID)
  .optional()
  .nullable()
  .or(z.literal(''));

/**
 * Future date validation schema
 */
export const futureDateSchema = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(''))
  .refine(
    (date) => !date || isDateInFuture(date),
    VALIDATION_MESSAGES.DATE_IN_PAST
  );

/**
 * Generic text validation schema with configurable limits
 */
export const createTextSchema = (
  minLength = 0,
  maxLength = 1000,
  required = false
) => {
  let schema = z.string();

  if (required) {
    schema = schema.min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);
  }

  if (minLength > 0) {
    schema = schema.min(minLength, `Text must be at least ${minLength} characters`);
  }

  if (maxLength < 1000) {
    schema = schema.max(maxLength, `Text cannot exceed ${maxLength} characters`);
  }

  return schema;
};

// === UTILITY FUNCTIONS ===

/**
 * Validates any value against a Zod schema and returns a standardized result
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { isValid: true, errors: [], data: result.data };
  }
  
  const errors = result.error.errors.map(err => err.message);
  return { isValid: false, errors };
}

/**
 * Validates form data against multiple field schemas
 */
export function validateFormWithZod<T extends Record<string, any>>(
  data: T,
  schemas: Partial<Record<keyof T, z.ZodSchema<any>>>
): { isValid: boolean; errors: Partial<Record<keyof T, string[]>>; validatedData?: Partial<T> } {
  const errors: Partial<Record<keyof T, string[]>> = {};
  const validatedData: Partial<T> = {};
  let isValid = true;

  for (const [field, schema] of Object.entries(schemas) as [keyof T, z.ZodSchema<any>][]) {
    const fieldResult = validateWithZod(schema, data[field]);
    
    if (!fieldResult.isValid) {
      errors[field] = fieldResult.errors;
      isValid = false;
    } else if (fieldResult.data !== undefined) {
      validatedData[field] = fieldResult.data;
    }
  }

  return { isValid, errors, validatedData: isValid ? validatedData : undefined };
}

// === RE-EXPORT VALIDATION FUNCTIONS FOR COMPATIBILITY ===
// These provide backward compatibility during migration

export const isValidEmail = isValidEmailEnhanced;
export const isValidPassword = isValidPasswordEnhanced;
export const isValidUrl = isValidUrlEnhanced;

export { isDateInFuture };

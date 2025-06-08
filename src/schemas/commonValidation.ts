
/**
 * Common Validation Schemas - Phase 4 Consolidation
 * 
 * Now uses consolidated validation functions to eliminate duplication.
 */

// === EXTERNAL LIBRARIES ===
import { z } from 'zod';

// === INTERNAL UTILITIES ===
import {
  isValidEmail,
  isValidPassword,
  isDateInFuture,
} from '@/lib/utils/shared'; // Use consolidated shared utilities

// Common validation messages
export const COMMON_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_WEAK:
    'Password must contain uppercase, lowercase, number, and special character',
  URL_INVALID: 'Please enter a valid URL',
  DATE_INVALID: 'Please enter a valid date',
  DATE_IN_PAST: 'Date cannot be in the past',
  REQUIRED_FIELD: 'This field is required',
  TEXT_TOO_LONG: 'Text is too long',
  TEXT_TOO_SHORT: 'Text is too short',
} as const;

// Re-export consolidated validation functions
export { isValidEmail, isValidPassword, isDateInFuture };

/**
 * Generic text validation with configurable limits
 * Uses consolidated validation patterns
 */
export const createTextSchema = (
  minLength = 0,
  maxLength = 1000,
  required = false
) => {
  let schema = z.string();

  if (required) {
    schema = schema.min(1, COMMON_VALIDATION_MESSAGES.REQUIRED_FIELD);
  }

  if (minLength > 0) {
    schema = schema.min(
      minLength,
      `Text must be at least ${minLength} characters`
    );
  }

  if (maxLength < 1000) {
    schema = schema.max(
      maxLength,
      `Text cannot exceed ${maxLength} characters`
    );
  }

  return schema;
};

/**
 * Email validation schema using consolidated validation
 */
export const emailSchema = z.string()
  .min(1, COMMON_VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .refine(isValidEmail, COMMON_VALIDATION_MESSAGES.EMAIL_INVALID);

/**
 * Password validation schema using consolidated validation
 */
export const passwordSchema = z.string()
  .min(1, COMMON_VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(8, COMMON_VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  .refine(isValidPassword, COMMON_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK);

/**
 * Future date validation schema using consolidated validation
 */
export const futureDateSchema = z.string()
  .refine(
    (date) => isDateInFuture(date),
    COMMON_VALIDATION_MESSAGES.DATE_IN_PAST
  );
// CodeRabbit review

import { z } from 'zod';

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

// Common validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  if (!url || url.length === 0) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date > new Date();
};

// Common schema patterns
export const emailSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .refine(isValidEmail, COMMON_VALIDATION_MESSAGES.EMAIL_INVALID);

export const passwordSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(8, COMMON_VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  .refine(isValidPassword, COMMON_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK);

export const urlSchema = z
  .string()
  .refine(isValidUrl, COMMON_VALIDATION_MESSAGES.URL_INVALID)
  .optional()
  .or(z.literal(''));

export const futureDateSchema = z
  .string()
  .min(1, COMMON_VALIDATION_MESSAGES.REQUIRED_FIELD)
  .refine(isDateInFuture, COMMON_VALIDATION_MESSAGES.DATE_IN_PAST);

// Generic text validation with configurable limits
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

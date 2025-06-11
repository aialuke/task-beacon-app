/**
 * Validation Messages - Centralized Error Messages
 *
 * Single source of truth for all validation error messages.
 * Provides consistent, user-friendly error messaging across the application.
 */

export const UNIFIED_VALIDATION_MESSAGES = {
  // Field Requirements
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',

  // Email
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',

  // Password
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_WEAK:
    'Password must include uppercase, lowercase, number, and special character',

  // Username/Name
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name cannot exceed 50 characters',

  // Username
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_TOO_SHORT: 'Username must be at least 2 characters',
  USERNAME_TOO_LONG: 'Username cannot exceed 50 characters',
  USERNAME_INVALID:
    'Username can only contain letters, numbers, and underscores',

  // Task fields
  TITLE_REQUIRED: 'Task title is required',
  TITLE_TOO_LONG: 'Title cannot exceed 22 characters',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 500 characters',

  // URLs
  URL_INVALID: 'Please enter a valid URL',

  // Dates
  DATE_INVALID: 'Please enter a valid date',
  DATE_FUTURE: 'Date must be in the future',
  DATE_PAST: 'Date must be in the past',

  // Text Content
  TEXT_TOO_SHORT: (min: number) => `Text must be at least ${min} characters`,
  TEXT_TOO_LONG: (max: number) => `Text cannot exceed ${max} characters`,
} as const;

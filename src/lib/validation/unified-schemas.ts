/**
 * Unified Validation Schemas - Zod Schema Definitions
 *
 * Centralized Zod schemas for consistent data validation.
 * Single source of truth for validation rules and data transformation.
 */

import { z } from 'zod';

import { UNIFIED_VALIDATION_MESSAGES } from './messages';

// ============================================================================
// ENHANCED VALIDATION FUNCTIONS
// ============================================================================

const isValidEmailEnhanced = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) return false;

  // Additional domain validation
  const [, domain] = email.split('@');
  // Fix: Ensure boolean return type
  return Boolean(domain && domain.includes('.') && domain.length > 2);
};

const isValidPasswordEnhanced = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) && // Uppercase letter
    /[a-z]/.test(password) && // Lowercase letter
    /[0-9]/.test(password) && // Number
    /[^A-Za-z0-9]/.test(password) // Special character
  );
};

// ============================================================================
// CORE ZOD SCHEMAS
// ============================================================================

/**
 * Email validation schema
 */
export const unifiedEmailSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .max(254, UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_LONG(254))
  .refine(isValidEmailEnhanced, UNIFIED_VALIDATION_MESSAGES.EMAIL_INVALID)
  .transform(email => email.toLowerCase().trim());

/**
 * Password validation schema
 */
export const unifiedPasswordSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(8, UNIFIED_VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  .refine(
    isValidPasswordEnhanced,
    UNIFIED_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK
  );

/**
 * User name validation schema
 */
export const unifiedUserNameSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.NAME_REQUIRED)
  .min(2, UNIFIED_VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(50, UNIFIED_VALIDATION_MESSAGES.NAME_TOO_LONG)
  .transform(name => name.trim());

/**
 * Task title validation schema
 */
export const unifiedTaskTitleSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.TITLE_REQUIRED)
  .max(22, UNIFIED_VALIDATION_MESSAGES.TITLE_TOO_LONG)
  .transform(title => title.trim());

/**
 * Task description validation schema
 */
export const unifiedTaskDescriptionSchema = z
  .string()
  .max(500, UNIFIED_VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional()
  .transform(desc => desc?.trim());

/**
 * URL validation schema
 */
export const unifiedUrlSchema = z
  .string()
  .url(UNIFIED_VALIDATION_MESSAGES.URL_INVALID)
  .optional();

// ============================================================================
// SCHEMA FACTORIES
// ============================================================================

/**
 * Generic text schema factory
 */
export const createUnifiedTextSchema = (
  minLength = 0,
  maxLength = 1000,
  required = false
) => {
  let schema = z.string();

  if (required) {
    schema = schema.min(1, UNIFIED_VALIDATION_MESSAGES.REQUIRED);
  }

  if (minLength > 0) {
    schema = schema.min(
      minLength,
      UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_SHORT(minLength)
    );
  }

  if (maxLength < 1000) {
    schema = schema.max(
      maxLength,
      UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_LONG(maxLength)
    );
  }

  return schema;
};

// ============================================================================
// COMMON FORM SCHEMAS
// ============================================================================

/**
 * Sign-in form schema
 */
export const unifiedSignInSchema = z.object({
  email: unifiedEmailSchema,
  password: unifiedPasswordSchema,
});

/**
 * Sign-up form schema
 */
export const unifiedSignUpSchema = z.object({
  email: unifiedEmailSchema,
  password: unifiedPasswordSchema,
  name: unifiedUserNameSchema,
});

/**
 * Task form schema
 */
export const unifiedTaskFormSchema = z.object({
  title: unifiedTaskTitleSchema,
  description: unifiedTaskDescriptionSchema,
  url: unifiedUrlSchema,
});

/**
 * Username validation schema (specific for profiles)
 */
export const unifiedUsernameSchema = z
  .string()
  .min(2, UNIFIED_VALIDATION_MESSAGES.USERNAME_TOO_SHORT)
  .max(50, UNIFIED_VALIDATION_MESSAGES.USERNAME_TOO_LONG)
  .regex(/^[a-zA-Z0-9_]+$/, UNIFIED_VALIDATION_MESSAGES.USERNAME_INVALID)
  .transform(username => username.trim())
  .nullable()
  .optional();

/**
 * User roles enum
 */
export const unifiedUserRoleEnum = z.enum(['admin', 'manager', 'user']);

/**
 * Enhanced URL schema with nullable support
 */
export const unifiedNullableUrlSchema = z
  .string()
  .url(UNIFIED_VALIDATION_MESSAGES.URL_INVALID)
  .nullable()
  .optional();

/**
 * Base profile schema (matches database structure)
 */
export const unifiedProfileSchema = z.object({
  id: z.string().uuid(),
  email: unifiedEmailSchema,
  name: unifiedUsernameSchema,
  avatar_url: unifiedNullableUrlSchema,
  role: unifiedUserRoleEnum.nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

/**
 * Profile creation schema
 */
export const unifiedProfileCreateSchema = unifiedProfileSchema
  .omit({
    created_at: true,
    updated_at: true,
  })
  .partial({
    id: true,
    role: true,
    avatar_url: true,
    name: true,
  })
  .required({
    email: true,
  });

/**
 * Profile update schema
 */
export const unifiedProfileUpdateSchema = unifiedProfileSchema
  .partial()
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );

/**
 * Profile form schema
 */
export const unifiedProfileFormSchema = z.object({
  name: unifiedUsernameSchema,
  email: unifiedEmailSchema,
  avatar_url: unifiedNullableUrlSchema,
});

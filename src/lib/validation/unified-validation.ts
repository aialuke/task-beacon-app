import { z } from 'zod';
import { useCallback } from 'react';

/**
 * Unified Validation System - Phase 1 Consolidation
 * 
 * Replaces all scattered validation patterns with a single, consistent Zod-based system.
 * Eliminates manual validation, async validation wrappers, and component-specific validation.
 */

// === UNIFIED VALIDATION RESULT INTERFACE ===
export interface UnifiedValidationResult<T = unknown> {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: T;
  fieldErrors?: Record<string, string>;
}

// === UNIFIED VALIDATION MESSAGES ===
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
  PASSWORD_TOO_WEAK: 'Password must include uppercase, lowercase, number, and special character',
  
  // Username/Name
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name cannot exceed 50 characters',
  
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

// === ENHANCED VALIDATION FUNCTIONS ===
const isValidEmailEnhanced = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email.trim())) return false;
  
  // Additional domain validation
  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
};

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

// === UNIFIED ZOD SCHEMAS ===

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
  .refine(isValidPasswordEnhanced, UNIFIED_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK);

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
    schema = schema.min(minLength, UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_SHORT(minLength));
  }

  if (maxLength < 1000) {
    schema = schema.max(maxLength, UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_LONG(maxLength));
  }

  return schema;
};

// === UNIFIED VALIDATION FUNCTIONS ===

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
 * Validate individual field with unified schema
 */
export function validateUnifiedField(
  fieldName: string,
  value: unknown
): UnifiedValidationResult {
  let schema: z.ZodSchema<unknown>;

  switch (fieldName.toLowerCase()) {
    case 'email':
      schema = unifiedEmailSchema;
      break;
    case 'password':
      schema = unifiedPasswordSchema;
      break;
    case 'name':
    case 'username':
    case 'full_name':
      schema = unifiedUserNameSchema;
      break;
    case 'title':
      schema = unifiedTaskTitleSchema;
      break;
    case 'description':
      schema = unifiedTaskDescriptionSchema;
      break;
    case 'url':
      schema = unifiedUrlSchema;
      break;
    default:
      return { isValid: true, errors: [] };
  }

  return validateWithUnifiedSchema(schema, value);
}

/**
 * Validate form data with unified schemas
 */
export function validateUnifiedForm<T extends Record<string, unknown>>(
  data: T,
  schemas: Partial<Record<keyof T, z.ZodSchema<unknown>>>
): UnifiedValidationResult<Partial<T>> {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};
  const validatedData: Partial<T> = {};
  let isValid = true;

  for (const [field, schema] of Object.entries(schemas) as [keyof T, z.ZodSchema<unknown>][]) {
    const fieldResult = validateWithUnifiedSchema(schema, data[field]);
    
    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors);
      fieldErrors[field as string] = fieldResult.errors[0] || 'Validation failed';
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

// === UNIFIED VALIDATION HOOK ===

/**
 * Unified validation hook that replaces all scattered validation patterns
 */
export function useUnifiedValidation() {
  const validateField = useCallback((fieldName: string, value: unknown) => {
    return validateUnifiedField(fieldName, value);
  }, []);

  const validateForm = useCallback(<T extends Record<string, unknown>>(
    data: T,
    schemas: Partial<Record<keyof T, z.ZodSchema<unknown>>>
  ) => {
    return validateUnifiedForm(data, schemas);
  }, []);

  const validateEmail = useCallback((email: string) => {
    return validateWithUnifiedSchema(unifiedEmailSchema, email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    return validateWithUnifiedSchema(unifiedPasswordSchema, password);
  }, []);

  const validateUserName = useCallback((name: string) => {
    return validateWithUnifiedSchema(unifiedUserNameSchema, name);
  }, []);

  const validateTaskTitle = useCallback((title: string) => {
    return validateWithUnifiedSchema(unifiedTaskTitleSchema, title);
  }, []);

  const validateTaskDescription = useCallback((description: string) => {
    return validateWithUnifiedSchema(unifiedTaskDescriptionSchema, description);
  }, []);

  const validateUrl = useCallback((url: string) => {
    return validateWithUnifiedSchema(unifiedUrlSchema, url);
  }, []);

  return {
    // Core validation functions
    validateField,
    validateForm,
    validateWithSchema: validateWithUnifiedSchema,

    // Field-specific validators
    validateEmail,
    validatePassword,
    validateUserName,
    validateTaskTitle,
    validateTaskDescription,
    validateUrl,

    // Schemas for direct use
    schemas: {
      email: unifiedEmailSchema,
      password: unifiedPasswordSchema,
      userName: unifiedUserNameSchema,
      taskTitle: unifiedTaskTitleSchema,
      taskDescription: unifiedTaskDescriptionSchema,
      url: unifiedUrlSchema,
    },
  };
}

// === COMMON FORM SCHEMAS ===

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
 * Profile form schema
 */
export const unifiedProfileFormSchema = z.object({
  name: unifiedUserNameSchema,
  email: unifiedEmailSchema,
  avatar_url: unifiedUrlSchema,
});

// === VALIDATION UTILITIES ===

/**
 * Validate sign-in data
 */
export function validateUnifiedSignIn(data: unknown): UnifiedValidationResult<z.infer<typeof unifiedSignInSchema>> {
  return validateWithUnifiedSchema(unifiedSignInSchema, data);
}

/**
 * Validate sign-up data
 */
export function validateUnifiedSignUp(data: unknown): UnifiedValidationResult<z.infer<typeof unifiedSignUpSchema>> {
  return validateWithUnifiedSchema(unifiedSignUpSchema, data);
}

/**
 * Validate task data
 */
export function validateUnifiedTask(data: unknown): UnifiedValidationResult<z.infer<typeof unifiedTaskFormSchema>> {
  return validateWithUnifiedSchema(unifiedTaskFormSchema, data);
}

/**
 * Validate profile data
 */
export function validateUnifiedProfile(data: unknown): UnifiedValidationResult<z.infer<typeof unifiedProfileFormSchema>> {
  return validateWithUnifiedSchema(unifiedProfileFormSchema, data);
} 
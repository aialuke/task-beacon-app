/**
 * Consolidated Validation Utilities
 * 
 * All validation utility functions consolidated from scattered schema files.
 * Provides a unified API for validation operations.
 */

import { 
  signInSchema, 
  signUpSchema, 
  profileUpdateSchema, 
  profileCreateSchema,
  createTaskSchema,
  taskFormSchema,
  paginationSchema,
  sortingSchema,
  fileUploadSchema
} from './schemas';

// ============================================================================
// AUTHENTICATION VALIDATORS
// ============================================================================

export function validateSignIn(data: unknown) {
  return signInSchema.safeParse(data);
}

export function validateSignUp(data: unknown) {
  return signUpSchema.safeParse(data);
}

// ============================================================================
// PROFILE VALIDATORS
// ============================================================================

export function validateProfileUpdate(data: unknown) {
  return profileUpdateSchema.safeParse(data);
}

export function validateProfileCreate(data: unknown) {
  return profileCreateSchema.safeParse(data);
}

// ============================================================================
// TASK VALIDATORS
// ============================================================================

export function validateTaskCreation(data: unknown) {
  return createTaskSchema.safeParse(data);
}

export function validateTaskForm(data: unknown) {
  return taskFormSchema.safeParse(data);
}

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

export function validatePagination(data: unknown) {
  return paginationSchema.safeParse(data);
}

export function validateSorting(data: unknown) {
  return sortingSchema.safeParse(data);
}

export function validateFileUpload(data: unknown) {
  return fileUploadSchema.safeParse(data);
}



// ============================================================================
// VALIDATION RESULT HELPERS
// ============================================================================

export interface ValidationResult<T = unknown> {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: T;
  fieldErrors?: Record<string, string>;
}

/**
 * Convert Zod SafeParseResult to ValidationResult
 */
export function toValidationResult<T>(result: ReturnType<typeof signInSchema.safeParse>): ValidationResult<T> {
  if (result.success) {
    return {
      isValid: true,
      errors: [],
      data: result.data as T,
    };
  }

  const errors = result.error.errors.map(err => err.message);
  const fieldErrors: Record<string, string> = {};
  
  result.error.errors.forEach(err => {
    const field = err.path.join('.');
    if (field) {
      fieldErrors[field] = err.message;
    }
  });

  return {
    isValid: false,
    errors,
    fieldErrors,
  };
}

// ============================================================================
// VALIDATION HOOKS UTILITIES
// ============================================================================



/**
 * Validate email format specifically
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email.trim())) return false;
  
  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
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
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(url.trim());
  }
}

/**
 * Check if date is in future
 */
export function isDateInFuture(date: string): boolean {
  if (!date || typeof date !== 'string') return true; // Allow empty dates
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  const now = new Date();
  return dateObj > now;
} 
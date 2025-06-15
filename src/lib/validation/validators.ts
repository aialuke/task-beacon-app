/**
 * Consolidated Validation Utilities
 *
 * All validation utility functions consolidated from scattered schema files.
 * Provides a unified API for validation operations.
 */

import {
  signInSchema,
  signUpSchema,
  passwordResetSchema,
  passwordChangeSchema,
  profileUpdateSchema,
  profileCreateSchema,
  createTaskSchema,
  updateTaskSchema,
  taskFormSchema,
  taskFilterSchema,
  paginationSchema,
  sortingSchema,
  fileUploadSchema,
  type SignInInput,
  type SignUpInput,
  type PasswordResetInput,
  type PasswordChangeInput,
  type ProfileUpdateInput,
  type ProfileCreateInput,
  type CreateTaskInput,
  type UpdateTaskInput,
  type TaskFormInput,
  type TaskFilterInput,
  type PaginationInput,
  type SortingInput,
  type FileUploadInput,
} from './schemas';

// ============================================================================
// AUTHENTICATION VALIDATORS
// ============================================================================

function validateSignIn(data: unknown) {
  return signInSchema.safeParse(data);
}

function validateSignUp(data: unknown) {
  return signUpSchema.safeParse(data);
}

function validatePasswordReset(data: unknown) {
  return passwordResetSchema.safeParse(data);
}

function validatePasswordChange(data: unknown) {
  return passwordChangeSchema.safeParse(data);
}

// ============================================================================
// PROFILE VALIDATORS
// ============================================================================

export function validateProfileUpdate(
  data: Partial<ProfileUpdateInput>
): ProfileValidationResult {
  const errors: Record<string, string> = {};
  const fieldErrors: {
    name?: string;
    email?: string;
    avatar_url?: string;
  } = {};

  // Name validation
  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      errors.name = 'Name must be a string';
      fieldErrors.name = 'Name must be a string';
    } else if (data.name.trim().length === 0) {
      errors.name = 'Name is required';
      fieldErrors.name = 'Name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
      fieldErrors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
      fieldErrors.name = 'Name must be less than 100 characters';
    }
  }

  // Email validation
  if (data.email !== undefined) {
    if (typeof data.email !== 'string') {
      errors.email = 'Email must be a string';
      fieldErrors.email = 'Email must be a string';
    } else if (data.email.trim().length === 0) {
      errors.email = 'Email is required';
      fieldErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(data.email); // Fix: ensure boolean type
      if (!isValidEmail) {
        errors.email = 'Please enter a valid email address';
        fieldErrors.email = 'Please enter a valid email address';
      }
    }
  }

  // Avatar URL validation
  if (data.avatar_url !== undefined && data.avatar_url !== null) {
    if (typeof data.avatar_url !== 'string') {
      errors.avatar_url = 'Avatar URL must be a string';
      fieldErrors.avatar_url = 'Avatar URL must be a string';
    } else if (data.avatar_url.trim().length > 0) {
      try {
        new URL(data.avatar_url);
      } catch {
        errors.avatar_url = 'Please enter a valid URL';
        fieldErrors.avatar_url = 'Please enter a valid URL';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    fieldErrors,
  };
}

function validateProfileCreate(data: unknown) {
  return profileCreateSchema.safeParse(data);
}

// ============================================================================
// TASK VALIDATORS
// ============================================================================

function validateTaskCreation(data: unknown) {
  return createTaskSchema.safeParse(data);
}

function validateTaskUpdate(data: unknown) {
  return updateTaskSchema.safeParse(data);
}

function validateTaskForm(data: unknown) {
  return taskFormSchema.safeParse(data);
}

function validateTaskFilter(data: unknown) {
  return taskFilterSchema.safeParse(data);
}

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

function validatePagination(data: unknown) {
  return paginationSchema.safeParse(data);
}

function validateSorting(data: unknown) {
  return sortingSchema.safeParse(data);
}

function validateFileUpload(data: unknown) {
  return fileUploadSchema.safeParse(data);
}

// ============================================================================
// TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transform form data to API format for task creation
 */
function transformTaskFormToApiData(
  formData: TaskFormInput
): Partial<CreateTaskInput> {
  return {
    title: formData.title,
    description: formData.description || undefined,
    priority: formData.priority,
    due_date: formData.dueDate || undefined,
    url_link: formData.url || undefined,
    assignee_id: formData.assigneeId || undefined,
  };
}

// ============================================================================
// VALIDATION RESULT HELPERS
// ============================================================================

interface ValidationResult<T = unknown> {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  data?: T;
  fieldErrors?: Record<string, string>;
}

/**
 * Convert Zod SafeParseResult to ValidationResult
 */
function toValidationResult<T>(
  result: ReturnType<typeof signInSchema.safeParse>
): ValidationResult<T> {
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
 * Generic field validator
 */
function validateField(
  fieldName: string,
  value: unknown
): { isValid: boolean; error?: string } {
  // This could be extended to map field names to specific validators
  // For now, we'll keep it simple and return a basic validation
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'This field is required' };
  }

  return { isValid: true };
}

/**
 * Validate email format specifically
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) return false;

  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
}

/**
 * Validate password strength
 */
function isValidPassword(password: string): boolean {
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
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    const domainPattern =
      /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(url.trim());
  }
}

/**
 * Check if date is in future
 */
function isDateInFuture(date: string): boolean {
  if (!date || typeof date !== 'string') return true; // Allow empty dates

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  const now = new Date();
  // Fix: Ensure boolean return type
  return Boolean(dateObj > now);
}

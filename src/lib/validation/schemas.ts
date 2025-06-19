/**
 * Consolidated Validation Schemas
 *
 * All validation schemas consolidated from scattered schema files.
 * Uses unified validation patterns for consistency.
 */

import { z } from 'zod';

import { UNIFIED_VALIDATION_MESSAGES } from './messages';

// ============================================================================
// HELPER VALIDATION FUNCTIONS
// ============================================================================

const isValidEmailEnhanced = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) return false;

  // Additional domain validation
  const [, domain] = email.split('@');
  return domain && domain.includes('.') && domain.length > 2;
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

const emailSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.EMAIL_REQUIRED)
  .max(254, UNIFIED_VALIDATION_MESSAGES.TEXT_TOO_LONG(254))
  .refine(isValidEmailEnhanced, UNIFIED_VALIDATION_MESSAGES.EMAIL_INVALID)
  .transform(email => email.toLowerCase().trim());

const passwordSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(8, UNIFIED_VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
  .refine(
    isValidPasswordEnhanced,
    UNIFIED_VALIDATION_MESSAGES.PASSWORD_TOO_WEAK
  );

const userNameSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.NAME_REQUIRED)
  .min(2, UNIFIED_VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(50, UNIFIED_VALIDATION_MESSAGES.NAME_TOO_LONG)
  .transform(name => name.trim());

const taskTitleSchema = z
  .string()
  .min(1, UNIFIED_VALIDATION_MESSAGES.TITLE_REQUIRED)
  .max(22, UNIFIED_VALIDATION_MESSAGES.TITLE_TOO_LONG)
  .transform(title => title.trim());

const taskDescriptionSchema = z
  .string()
  .max(500, UNIFIED_VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional()
  .transform(desc => desc?.trim());

const urlSchema = z
  .string()
  .url(UNIFIED_VALIDATION_MESSAGES.URL_INVALID)
  .optional();

// ============================================================================
// TASK SCHEMAS
// ============================================================================

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

const uuidSchema = z.string().uuid('Invalid ID format');

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

// Pagination schemas removed - unused in codebase

// ============================================================================
// USER AUTHENTICATION SCHEMAS
// ============================================================================

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    name: userNameSchema.optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Password reset and change schemas removed - unused in codebase

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

export const profileUpdateSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  avatar_url: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

// profileCreateSchema removed - unused in codebase

const taskStatusSchema = z.enum(['pending', 'complete', 'overdue'], {
  errorMap: () => ({ message: 'Status must be pending, complete, or overdue' }),
});

const futureDateSchema = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(''))
  .refine(date => {
    if (!date || typeof date !== 'string') return true;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return false;
    const now = new Date();
    return dateObj > now;
  }, 'Date cannot be in the past');

const baseTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  status: taskStatusSchema.default('pending'),
  due_date: futureDateSchema,
  photo_url: z.string().url('Invalid photo URL').optional().nullable(),
  url_link: urlSchema,
  assignee_id: uuidSchema.optional().nullable(),
  parent_task_id: uuidSchema.optional().nullable(),
});

// createTaskSchema and updateTaskSchema removed - unused in codebase

export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .default(''),
  dueDate: z.string().default(''),
  url: z
    .string()
    .refine(url => {
      if (!url || !url.trim()) return true;
      try {
        new URL(url);
        return true;
      } catch {
        const domainPattern =
          /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        return domainPattern.test(url.trim());
      }
    }, 'Please enter a valid URL')
    .default(''),
  assigneeId: z.string().default(''),
});

// taskFilterSchema and fileUploadSchema removed - unused in codebase

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;

// Unused types removed:
// SignInInput, SignUpInput, PasswordResetInput, PasswordChangeInput
// ProfileCreateInput, CreateTaskInput, UpdateTaskInput, TaskFilterInput
// PaginationInput, SortingInput, FileUploadInput

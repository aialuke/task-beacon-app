/**
 * Consolidated Validation Schemas
 *
 * All validation schemas consolidated from scattered schema files.
 * Uses unified validation patterns for consistency.
 */

import { z } from 'zod';

import { DEFAULT_PAGINATION_CONFIG } from '@/lib/utils/pagination';
import type { TaskPriority as TaskPriorityType } from '@/types/feature-types/task.types';

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

// Import TaskPriority from the canonical location

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

const uuidSchema = z.string().uuid('Invalid ID format');
const timestampSchema = z.string().datetime('Invalid timestamp format');

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  pageSize: z
    .number()
    .int()
    .min(
      DEFAULT_PAGINATION_CONFIG.minPageSize,
      `Page size must be at least ${DEFAULT_PAGINATION_CONFIG.minPageSize}`
    )
    .max(
      DEFAULT_PAGINATION_CONFIG.maxPageSize,
      `Page size cannot exceed ${DEFAULT_PAGINATION_CONFIG.maxPageSize}`
    )
    .default(DEFAULT_PAGINATION_CONFIG.defaultPageSize),
  total: z.number().int().min(0).optional(),
});

export const sortingSchema = z.object({
  field: z.string().min(1, 'Sort field is required'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

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

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

export const profileUpdateSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  avatar_url: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export const profileCreateSchema = z.object({
  id: uuidSchema,
  name: userNameSchema,
  email: emailSchema,
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
});

const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'], {
  errorMap: () => ({
    message: 'Priority must be low, medium, high, or urgent',
  }),
});

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
  priority: taskPrioritySchema.default('medium'),
  status: taskStatusSchema.default('pending'),
  due_date: futureDateSchema,
  photo_url: z.string().url('Invalid photo URL').optional().nullable(),
  url_link: urlSchema,
  assignee_id: uuidSchema.optional().nullable(),
  parent_task_id: uuidSchema.optional().nullable(),
});

export const createTaskSchema = baseTaskSchema.partial({
  priority: true,
  status: true,
});

export const updateTaskSchema = baseTaskSchema.partial();

export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .default(''),
  priority: taskPrioritySchema.default('medium'),
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

export const taskFilterSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: uuidSchema.optional(),
  search: z.string().optional(),
  due_date_from: z.string().optional(),
  due_date_to: z.string().optional(),
  parent_task_id: uuidSchema.optional(),
});

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const fileUploadSchema = z.object({
  file: z.any(),
  maxSize: z
    .number()
    .positive()
    .default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z
    .array(z.string())
    .default(['image/jpeg', 'image/png', 'image/webp']),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;

// Use the canonical TaskPriority type instead of inferring from schema;
type TaskStatus = z.infer<typeof taskStatusSchema>;
type BaseTask = z.infer<typeof baseTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortingInput = z.infer<typeof sortingSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;

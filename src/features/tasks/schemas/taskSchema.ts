import { z } from 'zod';

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Task title is required',
  TITLE_TOO_SHORT: 'Title must be at least 1 character',
  TITLE_TOO_LONG: 'Title cannot exceed 22 characters',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 500 characters',
  PRIORITY_REQUIRED: 'Priority is required',
  PRIORITY_INVALID: 'Priority must be low, medium, high, or urgent',
  STATUS_REQUIRED: 'Status is required',
  STATUS_INVALID: 'Status must be pending, complete, or overdue',
  DUE_DATE_INVALID: 'Due date must be a valid date',
  URL_INVALID: 'Please enter a valid URL',
  USER_ID_REQUIRED: 'User ID is required',
} as const;

// Validation helper for URLs (allow empty or valid URL)
const isValidUrl = (url: string): boolean => {
  if (!url || url.length === 0) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Title schema with proper character limits (matching database constraints)
export const taskTitleSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
  .max(22, VALIDATION_MESSAGES.TITLE_TOO_LONG)
  .transform(str => str.trim());

// Description schema
export const taskDescriptionSchema = z
  .string()
  .max(500, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional()
  .nullable()
  .transform(val => val?.trim() || null);

// Base task schema for validation
export const baseTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.PRIORITY_INVALID }),
  }).default('medium'),
  status: z
    .enum(['pending', 'complete', 'overdue'], {
      errorMap: () => ({ message: VALIDATION_MESSAGES.STATUS_INVALID }),
    })
    .default('pending'),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .or(z.literal('')),
  photoUrl: z
    .string()
    .optional()
    .nullable()
    .or(z.literal('')),
  url: z
    .string()
    .refine(isValidUrl, VALIDATION_MESSAGES.URL_INVALID)
    .optional()
    .nullable()
    .or(z.literal('')),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional().nullable().or(z.literal('')),
});

// Schema for creating tasks (more flexible)
export const createTaskSchema = baseTaskSchema.partial({
  priority: true,
  status: true,
});

// Schema for updating tasks (all fields optional)
export const updateTaskSchema = baseTaskSchema.partial();

// Schema for form validation (compatible with existing form structure)
export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: z.string().max(500, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG).default(''),
  dueDate: z.string().default(''),
  url: z.string().refine(isValidUrl, VALIDATION_MESSAGES.URL_INVALID).default(''),
  pinned: z.boolean().default(false),
  assigneeId: z.string().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;

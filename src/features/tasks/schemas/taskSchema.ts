import { z } from 'zod';

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Task title is required',
  TITLE_TOO_SHORT: 'Title must be at least 1 character',
  TITLE_TOO_LONG: 'Title cannot exceed 200 characters',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 2000 characters',
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

export const baseTaskSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(200, VALIDATION_MESSAGES.TITLE_TOO_LONG),
  description: z
    .string()
    .max(2000, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: VALIDATION_MESSAGES.PRIORITY_INVALID }),
  }),
  status: z
    .enum(['pending', 'complete', 'overdue'], {
      errorMap: () => ({ message: VALIDATION_MESSAGES.STATUS_INVALID }),
    })
    .default('pending'),
  dueDate: z
    .string()
    .optional()
    .or(z.literal('')),
  photoUrl: z
    .string()
    .optional()
    .or(z.literal('')),
  url: z
    .string()
    .refine(isValidUrl, VALIDATION_MESSAGES.URL_INVALID)
    .optional()
    .or(z.literal('')),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional().or(z.literal('')),
});

export const createTaskSchema = baseTaskSchema;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

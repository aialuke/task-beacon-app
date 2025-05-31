
import { z } from 'zod';
import { 
  validateTaskTitle, 
  validateTaskDescription, 
  validateUrl, 
  validateDueDate 
} from '@/lib/validation/databaseValidation';

// Custom validation messages aligned with database constraints
const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Task title is required',
  TITLE_TOO_LONG: 'Task title cannot exceed 22 characters',
  TITLE_TOO_SHORT: 'Task title must be at least 1 character',
  DUE_DATE_REQUIRED: 'Due date is required',
  DUE_DATE_INVALID: 'Please enter a valid date',
  DUE_DATE_PAST: 'Due date cannot be in the past',
  URL_INVALID: 'Please enter a valid URL',
  ASSIGNEE_INVALID: 'Please select a valid assignee',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 500 characters',
} as const;

// Custom validation functions that match database constraints
const isValidUrl = (url: string): boolean => {
  const result = validateUrl(url);
  return result.isValid;
};

const isValidDate = (date: string): boolean => {
  const result = validateDueDate(date);
  return result.isValid;
};

const isValidTitle = (title: string): boolean => {
  const result = validateTaskTitle(title);
  return result.isValid;
};

const isValidDescription = (description: string | undefined): boolean => {
  const result = validateTaskDescription(description);
  return result.isValid;
};

// Base schema for task validation - aligned with database constraints
export const baseTaskSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(22, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .refine(isValidTitle, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .transform(val => val.trim()),
  description: z
    .string()
    .max(500, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
    .refine(isValidDescription, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
    .optional()
    .or(z.literal('')),
  dueDate: z
    .string()
    .min(1, VALIDATION_MESSAGES.DUE_DATE_REQUIRED)
    .refine(isValidDate, VALIDATION_MESSAGES.DUE_DATE_PAST),
  url: z
    .string()
    .refine(isValidUrl, VALIDATION_MESSAGES.URL_INVALID)
    .optional()
    .or(z.literal('')),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional().or(z.literal('')),
});

// Schema for creating a new task
export const createTaskSchema = baseTaskSchema;

// Schema for updating an existing task
export const updateTaskSchema = baseTaskSchema.partial().extend({
  id: z.string().min(1, 'Task ID is required'),
});

// Schema for completing a task
export const completeTaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  status: z.enum(['pending', 'complete'], {
    errorMap: () => ({
      message: "Status must be either 'pending' or 'complete'",
    }),
  }),
});

// Schema for follow-up task creation
export const followUpTaskSchema = baseTaskSchema.extend({
  parentTaskId: z.string().min(1, 'Parent task ID is required'),
});

// Type definitions derived from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
export type FollowUpTaskInput = z.infer<typeof followUpTaskSchema>;

// Export validation messages for reuse
export { VALIDATION_MESSAGES };

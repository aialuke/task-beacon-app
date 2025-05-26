
import { z } from "zod";

// Custom validation messages
const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Task title is required",
  TITLE_TOO_LONG: "Task title cannot exceed 22 characters",
  TITLE_TOO_SHORT: "Task title must be at least 1 character",
  DUE_DATE_REQUIRED: "Due date is required",
  DUE_DATE_INVALID: "Please enter a valid date",
  URL_INVALID: "Please enter a valid URL",
  ASSIGNEE_INVALID: "Please select a valid assignee",
  DESCRIPTION_TOO_LONG: "Description cannot exceed 500 characters",
} as const;

// Custom validation functions
const isValidUrl = (url: string): boolean => {
  if (!url || url.length === 0) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidDate = (date: string): boolean => {
  if (!date) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime()) && parsed > new Date(Date.now() - 24 * 60 * 60 * 1000); // Not in the past
};

// Base schema for task validation
export const baseTaskSchema = z.object({
  title: z.string()
    .min(1, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(22, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .trim(),
  description: z.string()
    .max(500, VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
    .optional()
    .or(z.literal("")),
  dueDate: z.string()
    .min(1, VALIDATION_MESSAGES.DUE_DATE_REQUIRED)
    .refine(isValidDate, VALIDATION_MESSAGES.DUE_DATE_INVALID),
  url: z.string()
    .refine(isValidUrl, VALIDATION_MESSAGES.URL_INVALID)
    .optional()
    .or(z.literal("")),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional().or(z.literal("")),
});

// Schema for creating a new task
export const createTaskSchema = baseTaskSchema;

// Schema for updating an existing task
export const updateTaskSchema = baseTaskSchema.partial().extend({
  id: z.string().min(1, "Task ID is required"),
});

// Schema for completing a task
export const completeTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  status: z.enum(["pending", "complete"], {
    errorMap: () => ({ message: "Status must be either 'pending' or 'complete'" })
  }),
});

// Schema for follow-up task creation
export const followUpTaskSchema = baseTaskSchema.extend({
  parentTaskId: z.string().min(1, "Parent task ID is required"),
});

// Type definitions derived from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
export type FollowUpTaskInput = z.infer<typeof followUpTaskSchema>;

// Export validation messages for reuse
export { VALIDATION_MESSAGES };


/**
 * Task Validation Schemas - Phase 1 Implementation
 * 
 * Extends the existing task schema with comprehensive validation for all task operations.
 */

import { z } from 'zod';
import { taskTitleSchema, taskDescriptionSchema, urlSchema, futureDateSchema } from './validation';

// === TASK SPECIFIC ENUMS ===

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'], {
  errorMap: () => ({ message: 'Priority must be low, medium, high, or urgent' }),
});

export const taskStatusSchema = z.enum(['pending', 'complete', 'overdue'], {
  errorMap: () => ({ message: 'Status must be pending, complete, or overdue' }),
});

// === TASK SCHEMAS ===

/**
 * Base task validation schema
 */
export const baseTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  priority: taskPrioritySchema.default('medium'),
  status: taskStatusSchema.default('pending'),
  due_date: futureDateSchema,
  photo_url: z.string().url('Invalid photo URL').optional().nullable(),
  url_link: urlSchema,
  assignee_id: z.string().uuid('Invalid assignee ID').optional().nullable(),
  parent_task_id: z.string().uuid('Invalid parent task ID').optional().nullable(),
});

/**
 * Task creation schema (for API calls)
 */
export const createTaskSchema = baseTaskSchema.partial({
  priority: true,
  status: true,
}).omit({
  // Remove fields that are auto-generated or set by the system
});

/**
 * Task update schema (all fields optional)
 */
export const updateTaskSchema = baseTaskSchema.partial();

/**
 * Form-friendly task schema (uses string values for form inputs)
 */
export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: z.string().max(500, 'Description cannot exceed 500 characters').default(''),
  priority: taskPrioritySchema.default('medium'),
  dueDate: z.string().default(''), // Form uses string for date inputs
  url: z.string().refine(
    (url) => {
      if (!url || !url.trim()) return true;
      try {
        new URL(url);
        return true;
      } catch {
        // Check for domain pattern without protocol
        const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        return domainPattern.test(url.trim());
      }
    },
    'Please enter a valid URL'
  ).default(''),
  assigneeId: z.string().default(''),
});

/**
 * Task filter schema for search and filtering
 */
export const taskFilterSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: z.string().uuid().optional(),
  search: z.string().optional(),
  due_date_from: z.string().optional(),
  due_date_to: z.string().optional(),
  parent_task_id: z.string().uuid().optional(),
});

/**
 * Bulk task operation schema
 */
export const bulkTaskOperationSchema = z.object({
  task_ids: z.array(z.string().uuid('Invalid task ID')).min(1, 'At least one task must be selected'),
  operation: z.enum(['delete', 'complete', 'archive', 'assign']),
  assignee_id: z.string().uuid().optional(), // Required for assign operation
}).refine(
  (data) => {
    if (data.operation === 'assign') {
      return !!data.assignee_id;
    }
    return true;
  },
  {
    message: 'Assignee ID is required for assign operation',
    path: ['assignee_id'],
  }
);

// === TYPE EXPORTS ===

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type BaseTask = z.infer<typeof baseTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
export type BulkTaskOperationInput = z.infer<typeof bulkTaskOperationSchema>;

// === VALIDATION UTILITIES ===

/**
 * Validates task creation data
 */
export function validateTaskCreation(data: unknown) {
  return createTaskSchema.safeParse(data);
}

/**
 * Validates task update data
 */
export function validateTaskUpdate(data: unknown) {
  return updateTaskSchema.safeParse(data);
}

/**
 * Validates task form data
 */
export function validateTaskForm(data: unknown) {
  return taskFormSchema.safeParse(data);
}

/**
 * Validates task filter data
 */
export function validateTaskFilter(data: unknown) {
  return taskFilterSchema.safeParse(data);
}

/**
 * Transforms form data to API format
 */
export function transformFormToApiData(formData: TaskFormInput): Partial<CreateTaskInput> {
  return {
    title: formData.title,
    description: formData.description || undefined,
    priority: formData.priority,
    due_date: formData.dueDate || undefined,
    url_link: formData.url || undefined,
    assignee_id: formData.assigneeId || undefined,
  };
}

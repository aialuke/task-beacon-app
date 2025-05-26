
import { z } from "zod";

// Base schema for task validation
export const baseTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(22, "Title cannot exceed 22 characters"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  url: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional(),
});

// Schema for creating a new task
export const createTaskSchema = baseTaskSchema;

// Schema for updating an existing task
export const updateTaskSchema = baseTaskSchema.partial();

// Schema for completing a task
export const completeTaskSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "complete"]),
});

// Type definitions derived from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;


import { z } from "zod";
import { TaskStatus } from "@/lib/types";

// Base schema for task validation
export const baseTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(22, "Title cannot exceed 22 characters"),
  description: z.string().nullish(),
  dueDate: z.string().optional(),
  url: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  pinned: z.boolean().default(false),
  assigneeId: z.string().optional(),
});

// Schema for creating a new task
export const createTaskSchema = baseTaskSchema;

// Schema for follow-up tasks
export const followUpTaskSchema = baseTaskSchema.extend({
  parentTaskId: z.string().min(1, "Parent task ID is required"),
});

// Schema for updating an existing task
export const updateTaskSchema = baseTaskSchema.partial();

// Schema for completing a task
export const completeTaskSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "complete", "overdue"] as const),
});

// Type definitions derived from schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type FollowUpTaskInput = z.infer<typeof followUpTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;

// Schema validation functions
export function validateTaskInput(data: unknown): CreateTaskInput {
  return createTaskSchema.parse(data);
}

export function validateFollowUpTaskInput(data: unknown): FollowUpTaskInput {
  return followUpTaskSchema.parse(data);
}

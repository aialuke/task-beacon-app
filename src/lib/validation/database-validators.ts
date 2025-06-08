/**
 * Database-level validation utilities for existence checks and ownership validation
 * 
 * These validators perform async operations against the database to verify
 * entity existence and user permissions.
 */
import { 
  BasicValidationResult,
  ValidationErrorCode,
  ValidationContext,
  AsyncValidationResult,
  AsyncValidationConfig 
} from './types';
import { 
  createSuccessResult,
  createErrorResult,
  getStandardMessage 
} from './error-handling';
import { DatabaseValidationOps } from './database-operations';

// Re-export for backward compatibility
export type { BasicValidationResult as ValidationResult } from './types';

/**
 * Validates if a user exists by email
 */
export const validateUserExists = async (
  email: string,
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<BasicValidationResult> => {
  if (!email || email.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Email is required'));
  }

  // Use centralized database operations
  return DatabaseValidationOps.validateUserExists(email, context);
};

/**
 * Validates if a task exists
 */
export const validateTaskExists = async (
  taskId: string,
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<BasicValidationResult> => {
  if (!taskId || taskId.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Task ID is required'));
  }

  // Use centralized database operations
  return DatabaseValidationOps.validateTaskExists(taskId, context);
};

/**
 * Batch validate multiple users exist
 */
export const validateMultipleUsersExist = async (
  emails: string[],
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<BasicValidationResult> => {
  if (!emails || emails.length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'At least one email is required'));
  }

  // Filter out empty emails
  const validEmails = emails.filter(email => email && email.trim().length > 0);
  
  if (validEmails.length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Valid emails are required'));
  }

  // Use batch operations for better performance
  const result = await DatabaseValidationOps.validateUsersAndTasks(validEmails, [], context);
  return result.usersResult;
};

/**
 * Batch validate multiple tasks exist
 */
export const validateMultipleTasksExist = async (
  taskIds: string[],
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<BasicValidationResult> => {
  if (!taskIds || taskIds.length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'At least one task ID is required'));
  }

  // Filter out empty task IDs
  const validTaskIds = taskIds.filter(taskId => taskId && taskId.trim().length > 0);
  
  if (validTaskIds.length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Valid task IDs are required'));
  }

  // Use batch operations for better performance
  const result = await DatabaseValidationOps.validateUsersAndTasks([], validTaskIds, context);
  return result.tasksResult;
};

/**
 * Batch validate both users and tasks exist
 */
export const validateUsersAndTasksExist = async (
  emails: string[],
  taskIds: string[],
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<{
  usersResult: BasicValidationResult;
  tasksResult: BasicValidationResult;
  combinedResult: BasicValidationResult;
}> => {
  // Filter out empty values
  const validEmails = emails.filter(email => email && email.trim().length > 0);
  const validTaskIds = taskIds.filter(taskId => taskId && taskId.trim().length > 0);

  // Use batch operations for optimal performance
  return DatabaseValidationOps.validateUsersAndTasks(validEmails, validTaskIds, context);
}; // CodeRabbit review

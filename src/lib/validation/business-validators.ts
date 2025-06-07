
/**
 * Business logic validation utilities
 * 
 * These validators enforce domain-specific rules and business constraints
 * such as ownership, permissions, and business rules.
 */
import { DatabaseService } from '@/lib/api';
import { 
  BasicValidationResult,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationContext,
  AsyncValidationConfig 
} from './types';
import { 
  createSuccessResult,
  createErrorResult,
  withErrorHandling,
  getStandardMessage 
} from './error-handling';

/**
 * Validates user permissions for task operations
 * 
 * Checks if a user has the right to access or modify a specific task
 * based on ownership or assignment.
 */
export const validateTaskOwnership = async (
  taskId: string,
  userId: string,
  context?: ValidationContext,
  config?: AsyncValidationConfig
): Promise<BasicValidationResult> => {
  const ctx = { validator: 'validateTaskOwnership', field: 'taskId', ...context };

  if (!taskId || taskId.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'Task ID is required'));
  }

  if (!userId || userId.trim().length === 0) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.REQUIRED, 'User ID is required'));
  }

  const operationResult = await withErrorHandling(
    async () => {
      // Use DatabaseService abstraction instead of direct Supabase
      const response = await DatabaseService.getTaskOwnership(taskId);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to get task ownership data');
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      return response.data;
    },
    ctx,
    ValidationErrorCode.DATABASE_ERROR
  );

  if (!operationResult.success) {
    // Check if it's a not found error
    if (operationResult.result.errors.some(err => err.includes('Task not found'))) {
      return createErrorResult(getStandardMessage(ValidationErrorCode.NOT_FOUND, 'Task not found'));
    }
    return operationResult.result;
  }

  const taskData = operationResult.data;

  // Check if user owns the task or is assigned to it
  const isOwner = taskData.owner_id === userId;
  const isAssignee = taskData.assignee_id === userId;

  if (!isOwner && !isAssignee) {
    return createErrorResult(getStandardMessage(ValidationErrorCode.INSUFFICIENT_PERMISSIONS, 'User does not have permission to access this task'));
  }
  
  const warnings: string[] = [];
  if (isAssignee && !isOwner) {
    warnings.push('User is assigned to task but not the owner');
  }

  return warnings.length > 0 ? createSuccessResult(warnings) : createSuccessResult();
};

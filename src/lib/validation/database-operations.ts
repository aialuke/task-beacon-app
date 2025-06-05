
/**
 * Centralized Database Validation Operations
 * 
 * Optimized database operations for validation with improved query performance
 * using database indexes and batch operations.
 */

import { DatabaseService } from '@/lib/api';
import { 
  BasicValidationResult,
  ValidationErrorCode,
  ValidationContext 
} from './types';
import { 
  createSuccessResult,
  createErrorResult,
  getStandardMessage,
  combineValidationResults 
} from './error-handling';

/**
 * Enhanced database query options for validation
 */
export interface ValidationQueryOptions {
  table: string;
  column: string;
  value: unknown;
  context?: ValidationContext;
}

/**
 * Batch existence check request
 */
export interface BatchExistenceRequest {
  table: string;
  column: string;
  value: unknown;
  identifier: string;
}

/**
 * Batch existence check result
 */
export interface BatchExistenceResult {
  identifier: string;
  exists: boolean;
  value: unknown;
}

/**
 * Task ownership data structure
 */
export interface TaskOwnershipData {
  owner_id: string;
  assignee_id: string;
}

/**
 * Optimized database validation operations leveraging database indexes
 */
export class DatabaseValidationOps {
  
  /**
   * Check if a single entity exists using optimized database queries
   */
  static async checkExistence(
    options: ValidationQueryOptions
  ): Promise<BasicValidationResult> {
    try {
      const response = await DatabaseService.exists(options.table, options.column, options.value);
      
      if (!response.success) {
        return createErrorResult(
          getStandardMessage(ValidationErrorCode.DATABASE_ERROR, `Failed to check existence in ${options.table}`)
        );
      }

      if (!response.data) {
        return createErrorResult(
          getStandardMessage(ValidationErrorCode.NOT_FOUND, `Resource not found in ${options.table}`)
        );
      }

      return createSuccessResult();
    } catch (error) {
      return createErrorResult(
        getStandardMessage(ValidationErrorCode.DATABASE_ERROR, `Database error for ${options.table}`)
      );
    }
  }

  /**
   * Optimized batch existence checking with reduced database round trips
   */
  static async batchCheckExistence(
    requests: BatchExistenceRequest[]
  ): Promise<{ 
    results: BatchExistenceResult[]; 
    validationResults: Record<string, BasicValidationResult>;
  }> {
    const results: BatchExistenceResult[] = [];
    const validationResults: Record<string, BasicValidationResult> = {};

    // Group by table and column for efficient batch queries
    const requestGroups = requests.reduce((acc, request) => {
      const key = `${request.table}.${request.column}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(request);
      return acc;
    }, {} as Record<string, BatchExistenceRequest[]>);

    // Process each group with optimized queries
    for (const [tableColumn, groupRequests] of Object.entries(requestGroups)) {
      const [table, column] = tableColumn.split('.');
      
      try {
        // Use batch query for better performance than individual requests
        const values = groupRequests.map(r => r.value);
        const response = await DatabaseService.batchExists(table, column, values);
        
        if (response.success && response.data) {
          // Map results back to original requests
          groupRequests.forEach((request, index) => {
            const batchResult = response.data[index];
            
            results.push({
              identifier: request.identifier,
              exists: batchResult.exists,
              value: request.value
            });
            
            validationResults[request.identifier] = batchResult.exists
              ? createSuccessResult()
              : createErrorResult(getStandardMessage(ValidationErrorCode.NOT_FOUND, `Resource not found in ${table}`));
          });
        } else {
          // Handle batch failure - fall back to individual checks
          for (const request of groupRequests) {
            const individualCheck = await this.checkExistence({
              table: request.table,
              column: request.column,
              value: request.value
            });
            
            results.push({
              identifier: request.identifier,
              exists: individualCheck.isValid,
              value: request.value
            });
            
            validationResults[request.identifier] = individualCheck;
          }
        }

      } catch (error) {
        // Handle group-level errors
        groupRequests.forEach(request => {
          results.push({
            identifier: request.identifier,
            exists: false,
            value: request.value
          });
          
          validationResults[request.identifier] = createErrorResult(
            getStandardMessage(ValidationErrorCode.DATABASE_ERROR, `Database error for ${table}`)
          );
        });
      }
    }

    return { results, validationResults };
  }

  /**
   * Get task ownership data using indexed query
   */
  static async getTaskOwnership(
    taskId: string,
    context?: ValidationContext
  ): Promise<{ success: true; data: TaskOwnershipData } | { success: false; error: string }> {
    try {
      const response = await DatabaseService.getTaskOwnership(taskId);
      
      if (!response.success) {
        return { success: false, error: response.error?.message || 'Failed to get task ownership' };
      }

      if (!response.data) {
        return { success: false, error: 'Task not found' };
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Optimized user existence check using email index
   */
  static async validateUserExists(
    email: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    return this.checkExistence({
      table: 'profiles',
      column: 'email', // Uses idx_profiles_email index
      value: email,
      context: { ...context, validator: 'validateUserExists', field: 'email' }
    });
  }

  /**
   * Optimized task existence check using primary key
   */
  static async validateTaskExists(
    taskId: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    return this.checkExistence({
      table: 'tasks',
      column: 'id', // Uses primary key index
      value: taskId,
      context: { ...context, validator: 'validateTaskExists', field: 'taskId' }
    });
  }

  /**
   * Batch validate users and tasks with optimized grouping
   */
  static async validateUsersAndTasks(
    userEmails: string[],
    taskIds: string[],
    context?: ValidationContext
  ): Promise<{
    usersResult: BasicValidationResult;
    tasksResult: BasicValidationResult;
    combinedResult: BasicValidationResult;
  }> {
    // Use batch operations for better performance
    const validations: Array<{
      identifier: string;
      table: string;
      column: string;
      value: string;
    }> = [
      ...userEmails.map((email, index) => ({
        identifier: `user_${index}`,
        table: 'profiles',
        column: 'email', // Uses idx_profiles_email index
        value: email
      })),
      ...taskIds.map((taskId, index) => ({
        identifier: `task_${index}`,
        table: 'tasks',
        column: 'id', // Uses primary key index
        value: taskId
      }))
    ];

    const { validationResults } = await this.batchCheckExistence(validations);

    // Separate results efficiently
    const userResults = userEmails.map((_, index) => validationResults[`user_${index}`]);
    const taskResults = taskIds.map((_, index) => validationResults[`task_${index}`]);
    
    const usersResult = combineValidationResults(userResults);
    const tasksResult = combineValidationResults(taskResults);
    const combinedResult = combineValidationResults([usersResult, tasksResult]);

    return {
      usersResult,
      tasksResult,
      combinedResult
    };
  }
}

/**
 * Convenience functions for common database validation patterns
 */

/**
 * Check if multiple entities exist and return detailed results
 */
export async function validateMultipleExistence(
  checks: ValidationQueryOptions[]
): Promise<BasicValidationResult> {
  const requests: BatchExistenceRequest[] = checks.map((check, index) => ({
    table: check.table,
    column: check.column,
    value: check.value,
    identifier: `check_${index}`
  }));

  const { validationResults } = await DatabaseValidationOps.batchCheckExistence(requests);
  const results = Object.values(validationResults);
  
  return combineValidationResults(results);
}

/**
 * Validate a collection of the same entity type with optimized batch processing
 */
export async function validateEntityCollection(
  table: string,
  column: string,
  values: unknown[],
  context?: ValidationContext
): Promise<BasicValidationResult> {
  const requests: BatchExistenceRequest[] = values.map((value, index) => ({
    table,
    column,
    value,
    identifier: `${table}_${index}`
  }));

  const { validationResults } = await DatabaseValidationOps.batchCheckExistence(requests);
  const results = Object.values(validationResults);
  
  return combineValidationResults(results);
}

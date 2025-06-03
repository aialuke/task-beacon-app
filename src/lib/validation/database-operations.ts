/**
 * Centralized Database Validation Operations
 * 
 * This module provides optimized database operations specifically for validation use cases.
 * It ensures consistent use of the database abstraction layer and implements batch operations
 * for improved performance.
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
  withErrorHandling,
  getStandardMessage,
  combineValidationResults 
} from './error-handling';

/**
 * Enhanced database query options for validation
 */
export interface ValidationQueryOptions {
  table: string;
  column: string;
  value: any;
  context?: ValidationContext;
}

/**
 * Batch existence check request
 */
export interface BatchExistenceRequest {
  table: string;
  column: string;
  value: any;
  identifier: string; // Unique identifier for this check
}

/**
 * Batch existence check result
 */
export interface BatchExistenceResult {
  identifier: string;
  exists: boolean;
  value: any;
}

/**
 * Task ownership data structure
 */
export interface TaskOwnershipData {
  owner_id: string;
  assignee_id: string;
}

/**
 * Database validation operations class providing optimized validation utilities
 */
export class DatabaseValidationOps {
  
  /**
   * Check if a single entity exists using the database service abstraction
   */
  static async checkExistence(
    options: ValidationQueryOptions
  ): Promise<BasicValidationResult> {
    const context = options.context || { validator: 'checkExistence' };
    
    const operationResult = await withErrorHandling(
      async () => {
        const response = await DatabaseService.exists(options.table, options.column, options.value);
        
        if (!response.success) {
          throw new Error(`Failed to check existence in ${options.table}`);
        }

        return response.data;
      },
      context,
      ValidationErrorCode.DATABASE_ERROR
    );

    if (operationResult.success === false) {
      return operationResult.result;
    }

    if (!operationResult.data) {
      return createErrorResult(
        getStandardMessage(ValidationErrorCode.NOT_FOUND, `Resource not found in ${options.table}`)
      );
    }

    return createSuccessResult();
  }

  /**
   * Batch check existence of multiple entities for improved performance
   */
  static async batchCheckExistence(
    requests: BatchExistenceRequest[]
  ): Promise<{ 
    results: BatchExistenceResult[]; 
    validationResults: Record<string, BasicValidationResult>;
  }> {
    const results: BatchExistenceResult[] = [];
    const validationResults: Record<string, BasicValidationResult> = {};

    // Group requests by table for efficient querying
    const requestsByTable = requests.reduce((acc, request) => {
      if (!acc[request.table]) {
        acc[request.table] = [];
      }
      acc[request.table].push(request);
      return acc;
    }, {} as Record<string, BatchExistenceRequest[]>);

    // Process each table group
    for (const [table, tableRequests] of Object.entries(requestsByTable)) {
      try {
        // For each table, check existence of all values
        const existenceChecks = await Promise.allSettled(
          tableRequests.map(async (request) => {
            const response = await DatabaseService.exists(request.table, request.column, request.value);
            return {
              request,
              exists: response.success ? response.data : false,
              error: response.success ? null : response.error
            };
          })
        );

        // Process results
        existenceChecks.forEach((check, index) => {
          const request = tableRequests[index];
          
          if (check.status === 'fulfilled') {
            results.push({
              identifier: request.identifier,
              exists: check.value.exists,
              value: request.value
            });
            
            validationResults[request.identifier] = check.value.exists
              ? createSuccessResult()
              : createErrorResult(getStandardMessage(ValidationErrorCode.NOT_FOUND, `Resource not found in ${table}`));
          } else {
            results.push({
              identifier: request.identifier,
              exists: false,
              value: request.value
            });
            
            validationResults[request.identifier] = createErrorResult(
              getStandardMessage(ValidationErrorCode.DATABASE_ERROR, `Failed to check existence in ${table}`)
            );
          }
        });

      } catch (error) {
        // Handle table-level errors
        tableRequests.forEach(request => {
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
   * Get task ownership data using the database service abstraction
   */
  static async getTaskOwnership(
    taskId: string,
    context?: ValidationContext
  ): Promise<{ success: true; data: TaskOwnershipData } | { success: false; result: BasicValidationResult }> {
    const ctx = context || { validator: 'getTaskOwnership' };

    // Use the DatabaseService.getTaskOwnership method
    return await withErrorHandling(
      async () => {
        const response = await DatabaseService.getTaskOwnership(taskId);
        
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to get task ownership');
        }

        if (!response.data) {
          throw new Error('Task not found');
        }

        return response.data;
      },
      ctx,
      ValidationErrorCode.DATABASE_ERROR
    );
  }

  /**
   * Validate multiple entity existence in a single batch operation
   */
  static async validateBatchExistence(
    validations: Array<{
      identifier: string;
      table: string;
      column: string;
      value: any;
      errorMessage?: string;
    }>
  ): Promise<BasicValidationResult> {
    const requests: BatchExistenceRequest[] = validations.map(v => ({
      table: v.table,
      column: v.column,
      value: v.value,
      identifier: v.identifier
    }));

    const { validationResults } = await this.batchCheckExistence(requests);
    
    // Combine all validation results
    const results = Object.values(validationResults);
    return combineValidationResults(results);
  }

  /**
   * Optimized user existence check with caching potential
   */
  static async validateUserExists(
    email: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    return this.checkExistence({
      table: 'profiles',
      column: 'email',
      value: email,
      context: { ...context, validator: 'validateUserExists', field: 'email' }
    });
  }

  /**
   * Optimized task existence check with caching potential
   */
  static async validateTaskExists(
    taskId: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    return this.checkExistence({
      table: 'tasks',
      column: 'id',
      value: taskId,
      context: { ...context, validator: 'validateTaskExists', field: 'taskId' }
    });
  }

  /**
   * Batch validate multiple users and tasks
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
    const validations: Array<{
      identifier: string;
      table: string;
      column: string;
      value: any;
    }> = [
      ...userEmails.map((email, index) => ({
        identifier: `user_${index}`,
        table: 'profiles',
        column: 'email',
        value: email
      })),
      ...taskIds.map((taskId, index) => ({
        identifier: `task_${index}`,
        table: 'tasks',
        column: 'id',
        value: taskId
      }))
    ];

    const { validationResults } = await this.batchCheckExistence(validations);

    // Separate user and task results
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

  return DatabaseValidationOps.validateBatchExistence(requests.map((req, index) => ({
    identifier: req.identifier,
    table: req.table,
    column: req.column,
    value: req.value,
    errorMessage: `Entity ${index + 1} not found`
  })));
}

/**
 * Validate a collection of the same entity type
 */
export async function validateEntityCollection(
  table: string,
  column: string,
  values: any[],
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
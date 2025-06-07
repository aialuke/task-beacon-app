/**
 * Database Operations for Validation
 * 
 * Centralized database operations used by validation functions.
 * This module handles database queries needed for validation checks.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  BasicValidationResult,
  ValidationContext,
  ValidationErrorCode 
} from './types';
import { 
  createSuccessResult,
  createErrorResult,
} from './result-creators';

export class DatabaseValidationOps {
  /**
   * Validates if a user exists by email
   */
  static async validateUserExists(
    email: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Database error checking user existence:', error);
        return createErrorResult('Failed to validate user existence');
      }

      if (!data) {
        return createErrorResult('User not found');
      }

      return createSuccessResult();
    } catch (error) {
      console.error('Unexpected error in validateUserExists:', error);
      return createErrorResult('Database validation failed');
    }
  }

  /**
   * Validates if a task exists
   */
  static async validateTaskExists(
    taskId: string,
    context?: ValidationContext
  ): Promise<BasicValidationResult> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', taskId)
        .maybeSingle();

      if (error) {
        console.error('Database error checking task existence:', error);
        return createErrorResult('Failed to validate task existence');
      }

      if (!data) {
        return createErrorResult('Task not found');
      }

      return createSuccessResult();
    } catch (error) {
      console.error('Unexpected error in validateTaskExists:', error);
      return createErrorResult('Database validation failed');
    }
  }

  /**
   * Batch validate both users and tasks for optimal performance
   */
  static async validateUsersAndTasks(
    emails: string[],
    taskIds: string[],
    context?: ValidationContext
  ): Promise<{
    usersResult: BasicValidationResult;
    tasksResult: BasicValidationResult;
    combinedResult: BasicValidationResult;
  }> {
    try {
      const promises = [];

      // Batch user validation
      if (emails.length > 0) {
        promises.push(
          supabase
            .from('profiles')
            .select('email')
            .in('email', emails)
        );
      }

      // Batch task validation
      if (taskIds.length > 0) {
        promises.push(
          supabase
            .from('tasks')
            .select('id')
            .in('id', taskIds)
        );
      }

      const results = await Promise.all(promises);
      
      let usersResult: BasicValidationResult = createSuccessResult();
      let tasksResult: BasicValidationResult = createSuccessResult();

      if (emails.length > 0) {
        const userQueryResult = results[0];
        if (userQueryResult.error) {
          usersResult = createErrorResult('Failed to validate users');
        } else {
          const foundEmails = userQueryResult.data?.map((u: unknown) => u.email) || [];
          const missingEmails = emails.filter(email => !foundEmails.includes(email));
          if (missingEmails.length > 0) {
            usersResult = createErrorResult(`Users not found: ${missingEmails.join(', ')}`);
          }
        }
      }

      if (taskIds.length > 0) {
        const taskQueryResult = results[emails.length > 0 ? 1 : 0];
        if (taskQueryResult.error) {
          tasksResult = createErrorResult('Failed to validate tasks');
        } else {
          const foundTaskIds = taskQueryResult.data?.map((t: unknown) => t.id) || [];
          const missingTaskIds = taskIds.filter(id => !foundTaskIds.includes(id));
          if (missingTaskIds.length > 0) {
            tasksResult = createErrorResult(`Tasks not found: ${missingTaskIds.join(', ')}`);
          }
        }
      }

      const combinedResult: BasicValidationResult = {
        isValid: usersResult.isValid && tasksResult.isValid,
        errors: [...usersResult.errors, ...tasksResult.errors],
        warnings: [...(usersResult.warnings || []), ...(tasksResult.warnings || [])],
      };

      return {
        usersResult,
        tasksResult,
        combinedResult,
      };

    } catch (error) {
      console.error('Unexpected error in batch validation:', error);
      const errorResult = createErrorResult('Batch validation failed');
      return {
        usersResult: errorResult,
        tasksResult: errorResult,
        combinedResult: errorResult,
      };
    }
  }
}

/**
 * Executes a Supabase query with proper error handling
 */
export async function executeQuery<T>(
  queryFn: () => PostgrestQueryBuilder<any, any, any, unknown>,
  context?: ValidationContext
): Promise<QueryResult<T>> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      if (context?.logger) {
        context.logger.error('Database query failed', error);
      }
      
      return {
        success: false,
        error: {
          code: error.code || 'DATABASE_ERROR',
          message: error.message || 'Database operation failed',
          details: error.details,
        },
        data: null,
      };
    }

    return {
      success: true,
      data: data as T,
      error: null,
    };
  } catch (error) {
    const errorObj = error as Error;
    if (context?.logger) {
      context.logger.error('Database query execution failed', errorObj);
    }
    
    return {
      success: false,
      error: {
        code: 'EXECUTION_ERROR',
        message: errorObj.message || 'Query execution failed',
        details: errorObj.stack,
      },
      data: null,
    };
  }
}

/**
 * Validates that a user exists in the database
 */
export async function checkUserExists(
  userId: string,
  context?: ValidationContext
): Promise<QueryResult<boolean>> {
  const query = () => 
    supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

  const result = await executeQuery<{ id: string }>(query, context);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      data: null,
    };
  }

  return {
    success: true,
    data: result.data !== null,
    error: null,
  };
}

/**
 * Validates that a task exists in the database
 */
export async function checkTaskExists(
  taskId: string,
  context?: ValidationContext
): Promise<QueryResult<boolean>> {
  const query = () =>
    supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .single();

  const result = await executeQuery<{ id: string }>(query, context);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      data: null,
    };
  }

  return {
    success: true,
    data: result.data !== null,
    error: null,
  };
}

/**
 * Validates multiple users exist in the database
 */
export async function checkMultipleUsersExist(
  userIds: string[],
  context?: ValidationContext
): Promise<QueryResult<UserCheckResult[]>> {
  if (userIds.length === 0) {
    return {
      success: true,
      data: [],
      error: null,
    };
  }

  const query = () =>
    supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

  const result = await executeQuery<Array<{ id: string; email: string }>>(query, context);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      data: null,
    };
  }

  const foundUsers = result.data || [];
  const results: UserCheckResult[] = userIds.map(userId => {
    const found = foundUsers.find(user => {
      if (typeof user === 'object' && user !== null && 'email' in user) {
        return (user as { id: string; email: string }).id === userId;
      }
      return false;
    });
    
    return {
      userId,
      exists: !!found,
      email: found ? (found as { id: string; email: string }).email : undefined,
    };
  });

  return {
    success: true,
    data: results,
    error: null,
  };
}

/**
 * Validates multiple tasks exist in the database
 */
export async function checkMultipleTasksExist(
  taskIds: string[],
  context?: ValidationContext
): Promise<QueryResult<TaskCheckResult[]>> {
  if (taskIds.length === 0) {
    return {
      success: true,
      data: [],
      error: null,
    };
  }

  const query = () =>
    supabase
      .from('tasks')
      .select('id')
      .in('id', taskIds);

  const result = await executeQuery<Array<{ id: string }>>(query, context);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      data: null,
    };
  }

  const foundTasks = result.data || [];
  const results: TaskCheckResult[] = taskIds.map(taskId => {
    const found = foundTasks.find(task => {
      if (typeof task === 'object' && task !== null && 'id' in task) {
        return (task as { id: string }).id === taskId;
      }
      return false;
    });
    
    return {
      taskId,
      exists: !!found,
    };
  });

  return {
    success: true,
    data: results,
    error: null,
  };
}

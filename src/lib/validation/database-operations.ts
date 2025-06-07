
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
  getStandardMessage 
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
        return createErrorResult(getStandardMessage(ValidationErrorCode.DATABASE_ERROR, 'Failed to validate user existence'));
      }

      if (!data) {
        return createErrorResult(getStandardMessage(ValidationErrorCode.NOT_FOUND, 'User not found'));
      }

      return createSuccessResult();
    } catch (error) {
      console.error('Unexpected error in validateUserExists:', error);
      return createErrorResult(getStandardMessage(ValidationErrorCode.DATABASE_ERROR, 'Database validation failed'));
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
        return createErrorResult(getStandardMessage(ValidationErrorCode.DATABASE_ERROR, 'Failed to validate task existence'));
      }

      if (!data) {
        return createErrorResult(getStandardMessage(ValidationErrorCode.NOT_FOUND, 'Task not found'));
      }

      return createSuccessResult();
    } catch (error) {
      console.error('Unexpected error in validateTaskExists:', error);
      return createErrorResult(getStandardMessage(ValidationErrorCode.DATABASE_ERROR, 'Database validation failed'));
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
          const foundEmails = userQueryResult.data?.map((u: any) => u.email) || [];
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
          const foundTaskIds = taskQueryResult.data?.map((t: any) => t.id) || [];
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

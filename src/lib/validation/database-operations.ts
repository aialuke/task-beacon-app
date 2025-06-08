
/**
 * Consolidated Database Validation Operations
 * 
 * Replaces duplicate validation logic from database.service.ts
 * Provides unified database validation with optimized queries.
 */

import { apiRequest } from '@/lib/api/error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types/shared';
import { BasicValidationResult, ValidationContext } from './types';
import { createSuccessResult, createErrorResult } from './result-creators';

/**
 * Consolidated user validation by email - replaces database.service.ts method
 */
export async function validateUsersByEmail(emails: string[]): Promise<ApiResponse<{
  validEmails: string[];
  invalidEmails: string[];
}>> {
  return apiRequest('database.validateUsersByEmail', async () => {
    if (emails.length === 0) {
      return { validEmails: [], invalidEmails: [] };
    }

    // Uses idx_profiles_email for efficient lookup
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .in('email', emails);

    if (error) throw error;

    const validEmails = data.map(profile => profile.email);
    const validEmailSet = new Set(validEmails);
    const invalidEmails = emails.filter(email => !validEmailSet.has(email));

    return { validEmails, invalidEmails };
  });
}

/**
 * Batch existence validation - replaces database.service.ts batchExists method
 */
export async function validateBatchUserExistence(
  emails: string[],
  context?: ValidationContext
): Promise<BasicValidationResult> {
  try {
    const result = await validateUsersByEmail(emails);
    
    if (!result.success) {
      return createErrorResult('Failed to validate user emails', [result.error?.message || 'Unknown error']);
    }

    const { invalidEmails } = result.data;
    
    if (invalidEmails.length > 0) {
      return createErrorResult(
        `Invalid users found: ${invalidEmails.join(', ')}`,
        invalidEmails.map(email => `User with email ${email} does not exist`)
      );
    }

    return createSuccessResult();
  } catch (error) {
    return createErrorResult(
      'Batch user validation failed',
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

/**
 * Generic entity existence validation - replaces database.service.ts exists method
 */
export async function validateEntityExistence(
  table: string,
  column: string,
  value: unknown,
  context?: ValidationContext
): Promise<BasicValidationResult> {
  try {
    const response = await apiRequest(`exists.${table}`, async () => {
      // Use optimized query that leverages our indexes
      const { data, error } = await (supabase as any)
        .from(table)
        .select('id')
        .eq(column, value)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    });

    if (!response.success) {
      return createErrorResult(
        `Failed to check ${table} existence`,
        [response.error?.message || 'Unknown error']
      );
    }

    if (!response.data) {
      return createErrorResult(
        `${table} not found`,
        [`No ${table} found with ${column} = ${value}`]
      );
    }

    return createSuccessResult();
  } catch (error) {
    return createErrorResult(
      `Entity existence validation failed`,
      [error instanceof Error ? error.message : 'Unknown error']
    );
  }
}

/**
 * Optimized task ownership validation using database query
 */
export async function validateTaskOwnershipData(taskId: string): Promise<ApiResponse<{
  owner_id: string;
  assignee_id: string;
}>> {
  return apiRequest(`task-ownership.${taskId}`, async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('owner_id, assignee_id')
      .eq('id', taskId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Task not found');
    
    return data;
  });
}

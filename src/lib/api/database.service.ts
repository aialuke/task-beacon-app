
/**
 * Database Service - Optimized with new indexes
 * 
 * Provides general database utilities for common operations.
 */

import { apiRequest } from './error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types/shared';

/**
 * Database utilities for common operations leveraging new indexes
 */
export class DatabaseService {
  /**
   * Execute a stored procedure/function
   */
  static async executeRpc<T>(
    functionName: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return apiRequest(`rpc.${functionName}`, async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).rpc(functionName, params);
      if (error) throw error;
      return data;
    });
  }

  /**
   * Check if a record exists using optimized indexes
   */
  static async exists(
    table: string,
    column: string,
    value: unknown
  ): Promise<ApiResponse<boolean>> {
    return apiRequest(`exists.${table}`, async () => {
      // Use optimized query that leverages our indexes
      // For profiles table, this uses idx_profiles_email when column is 'email'
      // For tasks table, this uses primary key or other relevant indexes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from(table)
        .select('id')
        .eq(column, value)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data

      if (error) throw error;
      return !!data;
    });
  }

  /**
   * Get count of records using optimized queries
   */
  static async count(
    table: string,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<number>> {
    return apiRequest(`count.${table}`, async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from(table).select('*', { count: 'exact', head: true });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    });
  }

  /**
   * Select specific fields from a table with filters using optimized indexes
   */
  static async selectFields<T>(
    table: string,
    fields: string,
    filters: Record<string, unknown>,
    options?: {
      single?: boolean;
      orderBy?: { column: string; ascending?: boolean };
    }
  ): Promise<ApiResponse<T>> {
    return apiRequest(`select.${table}`, async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from(table).select(fields);
      
      // Apply filters in optimal order for index usage
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // Apply ordering if specified
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }

      // Execute as single or multiple
      if (options?.single) {
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return data;
      }
    });
  }

  /**
   * Get task ownership data using optimized query
   */
  static async getTaskOwnership(taskId: string): Promise<ApiResponse<{
    owner_id: string;
    assignee_id: string;
  }>> {
    return this.selectFields(
      'tasks',
      'owner_id, assignee_id',
      { id: taskId },
      { single: true }
    );
  }

  /**
   * Batch check existence of multiple records with optimized queries
   */
  static async batchExists(
    table: string,
    column: string,
    values: unknown[]
  ): Promise<ApiResponse<Array<{ value: unknown; exists: boolean }>>> {
    return apiRequest(`batch-exists.${table}`, async () => {
      if (values.length === 0) return [];

      // Use optimized batch query instead of individual checks
      // For profiles.email, this leverages idx_profiles_email
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from(table)
        .select(column)
        .in(column, values);

      if (error) throw error;

      const existingValues = new Set(data.map((row: any) => row[column]));
      
      return values.map(value => ({
        value,
        exists: existingValues.has(value)
      }));
    });
  }

  /**
   * Optimized user validation using email index
   */
  static async validateUsersByEmail(emails: string[]): Promise<ApiResponse<{
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
}

/**
 * Database Service
 * 
 * Provides general database utilities for common operations.
 */

import { apiRequest } from './error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types/shared';

/**
 * Database utilities for common operations
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
   * Check if a record exists
   */
  static async exists(
    table: string,
    column: string,
    value: unknown
  ): Promise<ApiResponse<boolean>> {
    return apiRequest(`exists.${table}`, async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from(table)
        .select('id')
        .eq(column, value)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    });
  }

  /**
   * Get count of records
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
   * Select specific fields from a table with filters
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
      
      // Apply filters
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
        const { data, error } = await query.single();
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
   * Get task ownership data (owner_id, assignee_id)
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
   * Batch check existence of multiple records
   */
  static async batchExists(
    table: string,
    column: string,
    values: unknown[]
  ): Promise<ApiResponse<Array<{ value: unknown; exists: boolean }>>> {
    return apiRequest(`batch-exists.${table}`, async () => {
      const results = await Promise.allSettled(
        values.map(async (value) => {
          const response = await this.exists(table, column, value);
          return {
            value,
            exists: response.success ? response.data : false
          };
        })
      );

      return results.map((result, index) => ({
        value: values[index],
        exists: result.status === 'fulfilled' ? result.value.exists : false
      }));
    });
  }
}

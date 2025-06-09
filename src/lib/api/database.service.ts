/**
 * Database Service - Optimized with new indexes
 * 
 * Provides general database utilities for common operations.
 * Validation methods moved to consolidated validation module.
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
      const { data, error } = await supabase.rpc(functionName as never, params as never);
      if (error) throw error;
      return data as T;
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
      const query = supabase
        .from(table as never)
        .select('id')
        .eq(column, value)
        .maybeSingle();
      
      const { data, error } = await query;
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
      let query = supabase.from(table as never).select('*', { count: 'exact', head: true });
      
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
      let query = supabase.from(table as never).select(fields);
      
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
        return data as T;
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return data as T;
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
}

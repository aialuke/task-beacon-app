
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
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return apiRequest(`rpc.${functionName}`, async () => {
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
    value: any
  ): Promise<ApiResponse<boolean>> {
    return apiRequest(`exists.${table}`, async () => {
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
    filters?: Record<string, any>
  ): Promise<ApiResponse<number>> {
    return apiRequest(`count.${table}`, async () => {
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
}

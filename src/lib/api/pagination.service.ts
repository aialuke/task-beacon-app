
import type {
  PaginationParams,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
} from '@/types/pagination.types';
import { 
  calculatePaginationMeta,
  validatePaginationParams,
  DEFAULT_PAGINATION_CONFIG,
} from '@/types/pagination.types';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types/api.types';

interface PaginationServiceOptions {
  table: 'profiles' | 'tasks';
  select?: string;
  filters?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
}

/**
 * Pagination Service - Phase 2 Implementation
 * 
 * Standardized pagination service for consistent backend integration.
 * Provides common pagination patterns for Supabase queries.
 */
export class PaginationService {
  /**
   * Execute a paginated query with standardized response format
   */
  static async query<T>(
    options: PaginationServiceOptions,
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      // Validate pagination parameters
      const validation = validatePaginationParams(params, DEFAULT_PAGINATION_CONFIG);
      if (!validation.isValid) {
        return {
          data: null,
          error: {
            message: `Invalid pagination parameters: ${validation.errors.join(', ')}`,
            name: 'ValidationError',
          },
          success: false,
        };
      }

      const { page, pageSize } = validation.sanitized;
      const { table, select = '*', filters = {}, orderBy } = options;

      // Build the base query
      const baseQuery = supabase
        .from(table)
        .select(select, { count: 'exact' });

      // Apply filters
      let filteredQuery = baseQuery;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          filteredQuery = filteredQuery.eq(key, value);
        }
      });

      // Apply ordering
      let orderedQuery = filteredQuery;
      if (orderBy) {
        orderedQuery = orderedQuery.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const finalQuery = orderedQuery.range(from, to);

      // Execute query
      const { data, error, count } = await finalQuery;

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            name: 'DatabaseError',
            code: error.code,
            details: error.details,
          },
          success: false,
        };
      }

      // Calculate pagination metadata
      const totalCount = count ?? 0;
      const pagination = calculatePaginationMeta(page, pageSize, totalCount);

      return {
        data: {
          data: data as T[],
          pagination,
          filters,
          sortBy: orderBy?.column,
          sortDirection: orderBy?.ascending ? 'asc' : 'desc',
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          name: 'UnknownError',
          originalError: error,
        },
        success: false,
      };
    }
  }

  /**
   * Count total records for pagination metadata
   */
  static async count(
    table: 'profiles' | 'tasks',
    filters: Record<string, unknown> = {}
  ): Promise<ApiResponse<number>> {
    try {
      const baseQuery = supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      let filteredQuery = baseQuery;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          filteredQuery = filteredQuery.eq(key, value);
        }
      });

      const { count, error } = await filteredQuery;

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            name: 'DatabaseError',
            code: error.code,
          },
          success: false,
        };
      }

      return {
        data: count ?? 0,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          name: 'UnknownError',
        },
        success: false,
      };
    }
  }

  /**
   * Create pagination metadata from query results
   */
  static createPaginationMeta(
    page: number,
    pageSize: number,
    totalCount: number
  ): PaginationMeta {
    return calculatePaginationMeta(page, pageSize, totalCount);
  }

  /**
   * Transform query parameters to pagination params
   */
  static parseQueryParams(queryParams: URLSearchParams): PaginationParams {
    const page = parseInt(queryParams.get('page') || '1', 10);
    const pageSize = parseInt(queryParams.get('pageSize') || String(DEFAULT_PAGINATION_CONFIG.defaultPageSize), 10);
    
    const validation = validatePaginationParams({ page, pageSize }, DEFAULT_PAGINATION_CONFIG);
    return validation.sanitized;
  }

  /**
   * Convert pagination params to URL search params
   */
  static toQueryParams(params: PaginationParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(params.page));
    searchParams.set('pageSize', String(params.pageSize));
    return searchParams;
  }
}

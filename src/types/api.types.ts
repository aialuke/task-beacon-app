
/**
 * API Response Types - Single Source of Truth
 * 
 * Unified API response patterns with improved type safety and consistency.
 * This is the authoritative source for all API response types.
 */

// Standard API response interface - single source of truth
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

// Enhanced API error with comprehensive context
export interface ApiError {
  message: string;
  name: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  hint?: string;
  timestamp?: string;
  originalError?: unknown;
}

// Service operation result pattern
export interface ServiceResult<T = void> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Pagination interface
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Query parameters
export interface BaseQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

// Action result pattern for mutations
export interface ActionResult<T = void> {
  data: T | null;
  error: ApiError | null;
  isSuccess: boolean;
}

// Database operation result types
export interface DatabaseOperationResult<T = void> {
  data: T | null;
  error: {
    message: string;
    code: string;
    details?: unknown;
  } | null;
  success: boolean;
}

// Legacy compatibility types (will be phased out)
export interface TablesResponse<T> {
  data: T | null;
  error: ApiError | null;
}

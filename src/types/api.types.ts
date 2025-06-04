
/**
 * API Response Types - Unified System
 * 
 * Consolidated API response patterns with improved type safety and consistency.
 * Replaces scattered API response types throughout the codebase.
 */

// Standard API response interface
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

// Enhanced API error with more context
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

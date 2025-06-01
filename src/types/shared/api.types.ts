/**
 * Shared API Types
 * 
 * Consolidated API response patterns, error handling, and pagination types.
 * These types are used across all API services and features.
 */

// Core API response interface (single source of truth)
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

// Comprehensive API error interface
export interface ApiError {
  message: string;
  name: string;
  code?: string;
  details?: unknown;
  statusCode?: number;
  hint?: string;
  originalError?: unknown;
}

// Pagination interfaces
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Legacy API response types (for backward compatibility)
export interface TablesResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// Query parameter base types
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
/**
 * API Types
 * 
 * All API-related type definitions including responses, errors, and service results.
 */

// === API RESPONSE TYPES ===
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ServiceResult<T = unknown> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DatabaseOperationResult<T = unknown> {
  data: T | null;
  error: string | null;
  count?: number;
}

// === QUERY PARAMETERS ===
export interface BaseQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

// === GENERIC API STATE ===
export interface ApiState<T = unknown, E = string> {
  data: T | null;
  loading: boolean;
  error: E | null;
  success: boolean;
  lastFetch?: Date;
}


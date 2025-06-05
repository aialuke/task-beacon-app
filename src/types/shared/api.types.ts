
/**
 * Shared API Types - Import from Single Source
 * 
 * This file now imports from the unified API types to eliminate duplication.
 * @deprecated - Use imports from @/types/api.types directly
 */

// Re-export from the single source of truth
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  PaginationMeta,
  BaseQueryParams,
  ActionResult,
  DatabaseOperationResult,
  TablesResponse,
} from '../api.types';

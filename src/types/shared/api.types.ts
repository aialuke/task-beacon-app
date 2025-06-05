
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

// Legacy exports for backward compatibility (will be removed in future)
export type { 
  ApiResponse as TablesResponse,
  ServiceResult as DatabaseOperationResult,
} from '../api.types';

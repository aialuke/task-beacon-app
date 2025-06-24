/**
 * Pagination Types
 *
 * Type definitions for pagination interfaces.
 * Implementation functions moved to @/lib/utils/pagination.ts
 */

// === CORE PAGINATION INTERFACES ===

/**
 * Standard pagination metadata interface
 * Used consistently across all API responses and components
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination query parameters interface
 * Used for API requests and URL parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Base query parameters interface
 * Used for extending pagination with additional query options
 */
interface BaseQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}


/**
 * Pagination controls interface
 * Used for navigation functions and UI controls
 */
interface PaginationControls {
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Complete pagination interface combining state and controls
 * Used in contexts and comprehensive pagination components
 */
export interface PaginationAPI extends PaginationControls {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
}

// === PAGINATED RESPONSE INTERFACE ===

/**
 * Standard paginated API response structure
 * Used consistently across all paginated API endpoints
 */
interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// === PAGINATION CONFIGURATION ===

/**
 * Pagination configuration options
 * Used for customizing pagination behavior
 */
export interface PaginationConfig {
  defaultPageSize: number;
  maxPageSize: number;
  minPageSize: number;
  showPreviousNext: boolean;
  showPageNumbers: boolean;
  maxVisiblePages: number;
}

// === UTILITY TYPES ===

/**
 * Pagination validation result
 */
export interface PaginationValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized: PaginationParams;
}


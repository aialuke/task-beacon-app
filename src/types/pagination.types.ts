
/**
 * Pagination Types - Single Source of Truth
 * 
 * Centralized pagination type definitions to eliminate duplication
 * and provide consistent pagination interfaces across the application.
 */

// === CORE PAGINATION INTERFACE ===

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
 * Pagination state interface for components
 * Used in hooks and component state management
 */
export interface PaginationState extends PaginationParams {
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination controls interface
 * Used for navigation functions and UI controls
 */
export interface PaginationControls {
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Complete pagination interface combining state and controls
 * Used in contexts and comprehensive pagination components
 */
export interface PaginationAPI extends PaginationState, PaginationControls {
  isFetching?: boolean;
  isLoading?: boolean;
}

// === PAGINATED RESPONSE INTERFACE ===

/**
 * Standard paginated API response structure
 * Used consistently across all paginated API endpoints
 */
export interface PaginatedResponse<T> {
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

/**
 * Default pagination configuration
 */
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  minPageSize: 1,
  showPreviousNext: true,
  showPageNumbers: true,
  maxVisiblePages: 5,
} as const;

// === UTILITY TYPES ===

/**
 * Pagination validation result
 */
export interface PaginationValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized: PaginationParams;
}

/**
 * Pagination range information
 */
export interface PaginationRange {
  start: number;
  end: number;
  total: number;
}

// === TYPE GUARDS ===

/**
 * Type guard to check if an object is a valid PaginationMeta
 */
export function isPaginationMeta(obj: unknown): obj is PaginationMeta {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as PaginationMeta).currentPage === 'number' &&
    typeof (obj as PaginationMeta).totalPages === 'number' &&
    typeof (obj as PaginationMeta).totalCount === 'number' &&
    typeof (obj as PaginationMeta).pageSize === 'number' &&
    typeof (obj as PaginationMeta).hasNextPage === 'boolean' &&
    typeof (obj as PaginationMeta).hasPreviousPage === 'boolean'
  );
}

/**
 * Type guard to check if an object is valid PaginationParams
 */
export function isPaginationParams(obj: unknown): obj is PaginationParams {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as PaginationParams).page === 'number' &&
    typeof (obj as PaginationParams).pageSize === 'number' &&
    (obj as PaginationParams).page >= 1 &&
    (obj as PaginationParams).pageSize >= 1
  );
}

// === UTILITY FUNCTIONS ===

/**
 * Calculate pagination metadata from parameters
 */
export function calculatePaginationMeta(
  page: number,
  pageSize: number,
  totalCount: number
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    currentPage: page,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Validate and sanitize pagination parameters
 */
export function validatePaginationParams(
  params: Partial<PaginationParams>,
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG
): PaginationValidationResult {
  const errors: string[] = [];
  
  const page = Math.max(1, Math.floor(params.page || 1));
  const pageSize = Math.max(
    config.minPageSize,
    Math.min(config.maxPageSize, Math.floor(params.pageSize || config.defaultPageSize))
  );
  
  if (params.page && params.page < 1) {
    errors.push('Page must be at least 1');
  }
  
  if (params.pageSize && (params.pageSize < config.minPageSize || params.pageSize > config.maxPageSize)) {
    errors.push(`Page size must be between ${config.minPageSize} and ${config.maxPageSize}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: { page, pageSize },
  };
}

/**
 * Get pagination range information (e.g., "1-10 of 50")
 */
export function getPaginationRange(pagination: PaginationMeta): PaginationRange {
  const start = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const end = Math.min(start + pagination.pageSize - 1, pagination.totalCount);
  
  return {
    start,
    end,
    total: pagination.totalCount,
  };
}

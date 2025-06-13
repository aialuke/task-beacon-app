/**
 * Pagination Utilities
 *
 * Implementation functions for pagination operations.
 * Separated from type definitions for better organization.
 */

import type {
  PaginationMeta,
  PaginationParams,
  PaginationConfig,
  PaginationValidationResult,
  PaginationRange,
} from '@/types/pagination.types';

// === DEFAULT CONFIGURATION ===
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  minPageSize: 1,
  showPreviousNext: true,
  showPageNumbers: true,
  maxVisiblePages: 5,
} as const;

// === TYPE GUARDS ===

/**
 * Type guard to check if an object is a valid PaginationMeta
 */
function isPaginationMeta(obj: unknown): obj is PaginationMeta {
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
function isPaginationParams(obj: unknown): obj is PaginationParams {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as PaginationParams).page === 'number' &&
    typeof (obj as PaginationParams).pageSize === 'number' &&
    (obj as PaginationParams).page >= 1 &&
    (obj as PaginationParams).pageSize >= 1
  );
}

// === CALCULATION FUNCTIONS ===

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
  params: unknown,
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG
): PaginationValidationResult {
  const errors: string[] = [];
  let page = 1;
  let pageSize = config.defaultPageSize;

  if (typeof params === 'object' && params !== null) {
    const p = params as Record<string, unknown>;

    // Validate page
    if (p.page !== undefined) {
      if (
        typeof p.page !== 'number' ||
        p.page < 1 ||
        !Number.isInteger(p.page)
      ) {
        errors.push('Page must be a positive integer');
      } else {
        page = p.page;
      }
    }

    // Validate pageSize
    if (p.pageSize !== undefined) {
      if (
        typeof p.pageSize !== 'number' ||
        p.pageSize < config.minPageSize ||
        p.pageSize > config.maxPageSize ||
        !Number.isInteger(p.pageSize)
      ) {
        errors.push(
          `Page size must be between ${config.minPageSize} and ${config.maxPageSize}`
        );
      } else {
        pageSize = p.pageSize;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: { page, pageSize },
  };
}

/**
 * Get pagination range information
 */
function getPaginationRange(pagination: PaginationMeta): PaginationRange {
  const start = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const end = Math.min(start + pagination.pageSize - 1, pagination.totalCount);

  return {
    start,
    end,
    total: pagination.totalCount,
  };
}

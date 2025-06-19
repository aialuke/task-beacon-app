/**
 * Pagination Utilities
 *
 * Implementation functions for pagination operations.
 * Separated from type definitions for better organization.
 */

import type {
  PaginationMeta,
  PaginationConfig,
  PaginationValidationResult,
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


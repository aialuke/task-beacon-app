import { useState, useCallback, useMemo } from 'react';

import {
  DEFAULT_PAGINATION_CONFIG,
  validatePaginationParams,
  calculatePaginationMeta,
} from '@/lib/utils/pagination';
import type {
  PaginationAPI,
  PaginationParams,
  PaginationConfig,
} from '@/types/pagination.types';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalCount?: number;
  config?: Partial<PaginationConfig>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface UsePaginationReturn extends PaginationAPI {
  setTotalCount: (count: number) => void;
  reset: () => void;
  getParams: () => PaginationParams;
}

/**
 * Centralized pagination hook - Phase 2 Implementation
 *
 * Provides standardized pagination logic with validation and callbacks.
 * Replaces scattered pagination logic across components.
 */
export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = DEFAULT_PAGINATION_CONFIG.defaultPageSize,
    totalCount: externalTotalCount = 0,
    config = {},
    onPageChange,
    onPageSizeChange,
  } = options;

  // Memoize the final config to prevent dependency array issues
  const finalConfig = useMemo(() => {
    return { ...DEFAULT_PAGINATION_CONFIG, ...config };
  }, [config]);

  // Core pagination state
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(externalTotalCount);

  // Memoized pagination metadata
  const paginationMeta = useMemo(() => {
    return calculatePaginationMeta(page, pageSize, totalCount);
  }, [page, pageSize, totalCount]);

  // Navigation functions with validation
  const goToNextPage = useCallback(() => {
    if (paginationMeta.hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      onPageChange?.(nextPage);
    }
  }, [page, paginationMeta.hasNextPage, onPageChange]);

  const goToPreviousPage = useCallback(() => {
    if (paginationMeta.hasPreviousPage) {
      const prevPage = Math.max(1, page - 1);
      setPage(prevPage);
      onPageChange?.(prevPage);
    }
  }, [page, paginationMeta.hasPreviousPage, onPageChange]);

  const goToPage = useCallback(
    (targetPage: number) => {
      const validationResult = validatePaginationParams(
        { page: targetPage, pageSize },
        finalConfig,
      );

      if (validationResult.isValid && targetPage <= paginationMeta.totalPages) {
        setPage(targetPage);
        onPageChange?.(targetPage);
      }
    },
    [pageSize, finalConfig, paginationMeta.totalPages, onPageChange],
  );

  const setPageSizeHandler = useCallback(
    (newPageSize: number) => {
      const validationResult = validatePaginationParams(
        { page, pageSize: newPageSize },
        finalConfig,
      );

      if (validationResult.isValid) {
        setPageSize(newPageSize);
        // Reset to page 1 when changing page size to avoid out-of-bounds
        setPage(1);
        onPageSizeChange?.(newPageSize);
        onPageChange?.(1);
      }
    },
    [page, finalConfig, onPageSizeChange, onPageChange],
  );

  // Utility functions
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setTotalCount(0);
  }, [initialPage, initialPageSize]);

  const getParams = useCallback(
    (): PaginationParams => ({
      page,
      pageSize,
    }),
    [page, pageSize],
  );

  // Update total count when external value changes
  if (externalTotalCount !== totalCount && externalTotalCount > 0) {
    setTotalCount(externalTotalCount);
  }

  return {
    // State - using PaginationAPI interface property names
    currentPage: page,
    pageSize,
    totalCount,
    totalPages: paginationMeta.totalPages,
    hasNextPage: paginationMeta.hasNextPage,
    hasPreviousPage: paginationMeta.hasPreviousPage,

    // Controls
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setPageSize: setPageSizeHandler,

    // Utilities
    setTotalCount,
    reset,
    getParams,
  };
}

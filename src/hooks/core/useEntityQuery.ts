/**
 * Unified Entity Query Hook - Phase 2 Consolidation
 *
 * Generic hook for entity queries that eliminates duplicate React Query patterns.
 * Replaces scattered query configurations with standardized approach.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { ApiResponse } from '@/types';
import { createLoadingState } from '@/types/async-state.types';

// === CORE INTERFACES ===

interface EntityQueryConfig<T> {
  /** Query key for caching */
  queryKey: readonly unknown[];
  /** Function to fetch the entity */
  queryFn: () => Promise<ApiResponse<T>>;
  /** Whether to enable the query */
  enabled?: boolean;
  /** Custom stale time (defaults to 5 minutes) */
  staleTime?: number;
  /** Custom retry logic (defaults to smart retry) */
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
  /** Error message context for logging */
  errorContext?: string;
}

interface EntityQueryReturn<T> {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
}

// === ENTITY QUERY HOOK ===

/**
 * Generic entity query hook with standardized configuration
 */
function useEntityQuery<T>(config: EntityQueryConfig<T>): EntityQueryReturn<T> {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    retry,
    errorContext,
  } = config;

  // Default smart retry logic
  const defaultRetry =
    retry ??
    ((failureCount: number, error: Error) => {
      // Don't retry on 404 errors
      if (
        error.message.includes('not found') ||
        error.message.includes('404')
      ) {
        return false;
      }
      return failureCount < 3;
    });

  const {
    data: response,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      if (!result.success) {
        const errorMsg =
          result.error?.message || `Failed to fetch ${errorContext || 'data'}`;
        throw new Error(errorMsg);
      }
      return result.data;
    },
    enabled,
    staleTime,
    gcTime: staleTime * 2, // Garbage collect after 2x stale time
    retry: defaultRetry,
    refetchOnWindowFocus: false, // Standardized behavior
    networkMode: 'offlineFirst',
  } as UseQueryOptions);

  // Memoized return object for stable references
  return useMemo(() => {
    const loadingState = createLoadingState(isLoading, isFetching, queryError);

    return {
      data: (response as T) || null,
      isLoading: loadingState.isLoading,
      isFetching: loadingState.isFetching,
      error: loadingState.error,
      refetch: () => refetch(),
    };
  }, [response, isLoading, isFetching, queryError, refetch]);
}

// === SPECIALIZED ENTITY HOOKS ===

/**
 * Hook for single entity queries (by ID)
 */
export function useEntityByIdQuery<T>(
  entityName: string,
  id: string | undefined,
  queryFn: (id: string) => Promise<ApiResponse<T>>,
  options: Partial<EntityQueryConfig<T>> = {}
): EntityQueryReturn<T> {
  return useEntityQuery({
    queryKey: [entityName, id],
    queryFn: async () => {
      if (!id) {
        throw new Error(`${entityName} ID is required`);
      }
      return queryFn(id);
    },
    enabled: !!id && (options.enabled ?? true),
    errorContext: `${entityName} by ID`,
    ...options,
  });
}

/**
 * Hook for entity list queries with filtering
 */
export function useEntityListQuery<T, TFilters = unknown>(
  entityName: string,
  filters: TFilters,
  queryFn: (filters: TFilters) => Promise<ApiResponse<T[]>>,
  options: Partial<EntityQueryConfig<T[]>> = {}
): EntityQueryReturn<T[]> {
  return useEntityQuery({
    queryKey: [entityName, 'list', filters],
    queryFn: () => queryFn(filters),
    errorContext: `${entityName} list`,
    ...options,
  });
}

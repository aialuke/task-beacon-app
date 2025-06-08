
/**
 * Optimized Query Patterns - Phase 3.1 Implementation
 * 
 * Standardized query patterns with enhanced caching, prefetching, and error recovery.
 */

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

// Standardized query configuration
export interface OptimizedQueryConfig<T> {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number | ((failureCount: number, error: unknown) => boolean);
  retryDelay?: number | ((retryAttempt: number) => number);
  networkMode?: 'online' | 'always' | 'offlineFirst';
}

// Default configurations for different query types
export const QUERY_DEFAULTS = {
  // Fast-changing data (user interactions, real-time updates)
  realtime: {
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
    networkMode: 'online' as const,
  },
  
  // Stable data (user profiles, system settings)
  stable: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    networkMode: 'offlineFirst' as const,
  },
  
  // Content data (tasks, posts, etc.)
  content: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    networkMode: 'offlineFirst' as const,
  },
} as const;

/**
 * Smart retry logic that considers error types
 */
export function createSmartRetryFn(maxRetries = 3) {
  return (failureCount: number, error: unknown): boolean => {
    if (failureCount >= maxRetries) return false;
    
    // Don't retry on specific error types
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('not found') || 
          message.includes('unauthorized') || 
          message.includes('forbidden')) {
        return false;
      }
    }
    
    return true;
  };
}

/**
 * Exponential backoff retry delay
 */
export function createRetryDelay(baseDelay = 1000) {
  return (retryAttempt: number): number => {
    return Math.min(baseDelay * Math.pow(2, retryAttempt), 30000); // Max 30 seconds
  };
}

/**
 * Enhanced useQuery with optimized defaults
 */
export function useOptimizedQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  config: OptimizedQueryConfig<T> & {
    type?: keyof typeof QUERY_DEFAULTS;
    enabled?: boolean;
  } = {}
) {
  const { type = 'content', enabled = true, ...customConfig } = config;
  
  const defaultConfig = QUERY_DEFAULTS[type];
  
  const optimizedConfig: UseQueryOptions<T> = useMemo(() => ({
    queryKey,
    queryFn,
    enabled,
    ...defaultConfig,
    ...customConfig,
    retry: customConfig.retry ?? createSmartRetryFn(defaultConfig.retry as number),
    retryDelay: createRetryDelay(),
  }), [queryKey, queryFn, enabled, defaultConfig, customConfig]);

  return useQuery(optimizedConfig);
}

/**
 * Enhanced useInfiniteQuery with cursor-based pagination
 */
export function useOptimizedInfiniteQuery<T>(
  queryKey: unknown[],
  queryFn: ({ pageParam }: { pageParam: unknown }) => Promise<{
    data: T[];
    nextCursor?: unknown;
    hasNextPage: boolean;
  }>,
  config: OptimizedQueryConfig<T> & {
    type?: keyof typeof QUERY_DEFAULTS;
    enabled?: boolean;
    initialPageParam?: unknown;
  } = {}
) {
  const { type = 'content', enabled = true, initialPageParam, ...customConfig } = config;
  
  const defaultConfig = QUERY_DEFAULTS[type];
  
  const optimizedConfig: UseInfiniteQueryOptions<{
    data: T[];
    nextCursor?: unknown;
    hasNextPage: boolean;
  }> = useMemo(() => ({
    queryKey,
    queryFn,
    enabled,
    initialPageParam: initialPageParam ?? null,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    ...defaultConfig,
    ...customConfig,
    retry: customConfig.retry ?? createSmartRetryFn(defaultConfig.retry as number),
    retryDelay: createRetryDelay(),
  }), [queryKey, queryFn, enabled, initialPageParam, defaultConfig, customConfig]);

  return useInfiniteQuery(optimizedConfig);
}

/**
 * Hook for prefetching related queries
 */
export function usePrefetchQueries() {
  const prefetchQuery = useCallback((
    queryKey: unknown[],
    queryFn: () => Promise<unknown>,
    config: OptimizedQueryConfig<unknown> = {}
  ) => {
    // Implementation would go here - placeholder for now
    console.log('Prefetching query:', queryKey);
  }, []);

  return { prefetchQuery };
}
// CodeRabbit review
// CodeRabbit review

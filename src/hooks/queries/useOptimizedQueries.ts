
/**
 * Optimized Queries - Standardized Query Patterns
 * 
 * Provides consistent query patterns with optimized caching and performance.
 */

import { useQuery, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * Query type configurations for different data patterns
 */
export type QueryType = 'content' | 'metadata' | 'real-time' | 'static';

export interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  type?: QueryType;
}

/**
 * Optimized query hook with standardized caching strategies
 */
export function useOptimizedQuery<T = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) {
  const { type = 'content', ...queryOptions } = options;
  
  // Standardized query configurations based on data type
  const optimizedOptions = useMemo(() => {
    const baseOptions = {
      queryKey,
      queryFn,
      ...queryOptions,
    };
    
    switch (type) {
      case 'content':
        return {
          ...baseOptions,
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          refetchOnWindowFocus: false,
        };
        
      case 'metadata':
        return {
          ...baseOptions,
          staleTime: 15 * 60 * 1000, // 15 minutes
          gcTime: 30 * 60 * 1000, // 30 minutes
          refetchOnWindowFocus: false,
        };
        
      case 'real-time':
        return {
          ...baseOptions,
          staleTime: 30 * 1000, // 30 seconds
          gcTime: 2 * 60 * 1000, // 2 minutes
          refetchOnWindowFocus: true,
          refetchInterval: 60 * 1000, // 1 minute
        };
        
      case 'static':
        return {
          ...baseOptions,
          staleTime: Infinity,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        };
        
      default:
        return baseOptions;
    }
  }, [queryKey, queryFn, type, queryOptions]);
  
  return useQuery(optimizedOptions);
}

/**
 * Standardized query invalidation patterns
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();
  
  return useMemo(() => ({
    /**
     * Invalidate queries by pattern
     */
    invalidateByPattern: (pattern: string[]) => {
      return queryClient.invalidateQueries({ queryKey: pattern });
    },
    
    /**
     * Invalidate all queries of a specific type
     */
    invalidateByType: (type: string) => {
      return queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey.includes(type);
        }
      });
    },
    
    /**
     * Clear all cached data
     */
    clearAll: () => {
      return queryClient.clear();
    },
    
    /**
     * Prefetch query with optimized configuration
     */
    prefetch: <T>(
      queryKey: QueryKey,
      queryFn: () => Promise<T>,
      type: QueryType = 'content'
    ) => {
      const staleTime = type === 'static' ? Infinity : 
                      type === 'metadata' ? 15 * 60 * 1000 :
                      type === 'real-time' ? 30 * 1000 : 5 * 60 * 1000;
      
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      });
    },
  }), [queryClient]);
}

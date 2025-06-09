
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UserService } from '@/lib/api/users.service';
import { QueryKeys } from '@/lib/api/standardized-api';
import type { User, UserQueryOptions } from '@/types';

interface UseUsersQueryOptions extends UserQueryOptions {
  enabled?: boolean;
}

interface UseUsersQueryReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Consolidated user query hook - Phase 2.2 Refactored
 * 
 * Single source of truth for user data with optional filtering.
 * Eliminates duplicated query state across components.
 */
export function useUsersQuery(options: UseUsersQueryOptions = {}): UseUsersQueryReturn {
  const { enabled = true, ...queryOptions } = options;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...QueryKeys.users, queryOptions],
    queryFn: async () => {
      const result = await UserService.getAll(queryOptions);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch users');
      }
      return result.data || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Memoize return object for stable references
  return useMemo(
    () => ({
      users: response || [],
      isLoading,
      error: error ? (error as Error).message : null,
      refetch,
    }),
    [response, isLoading, error, refetch]
  );
}

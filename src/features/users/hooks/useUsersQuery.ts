import { useQuery } from '@tanstack/react-query';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import { UserService } from '@/lib/api/users.service';
import type { User } from '@/types';

interface UseUsersQueryReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Standardized user list query hook
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Users, Entity: -, Action: Query
 */
export function useUsersQuery(enabled = true): UseUsersQueryReturn {
  // Memoize query configuration
  const queryConfig = useOptimizedMemo(
    () => ({
      queryKey: ['users'],
      queryFn: async () => {
        const result = await UserService.getAll();
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch users');
        }
        return result.data || [];
      },
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
    }),
    [enabled],
    { name: 'users-query-config' }
  );

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery(queryConfig);

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      users: response || [],
      isLoading,
      error: error ? (error).message : null,
      refetch,
    }),
    [response, isLoading, error, refetch],
    { name: 'users-query-return' }
  );
}
// CodeRabbit review
// CodeRabbit review

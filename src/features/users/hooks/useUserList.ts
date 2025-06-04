
import { useQuery } from '@tanstack/react-query';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import { UserService } from '@/lib/api/users.service';
import type { User } from '@/types';

interface UseUserListReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Optimized user list hook with better error handling and memoization
 */
export function useUserList(enabled = true): UseUserListReturn {
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
    { name: 'user-list-query-config' }
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
      error: error ? (error as Error).message : null,
      refetch,
    }),
    [response, isLoading, error, refetch],
    { name: 'user-list-return' }
  );
}

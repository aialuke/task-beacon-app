import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from '@/lib/api/users';
import type { User, UserQueryOptions } from '@/types';

interface UseUsersQueryOptions extends UserQueryOptions {
  enabled?: boolean;
}

interface UseUsersQueryReturn {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch users with query options.
 */
export function useUsersQuery(
  options: UseUsersQueryOptions = {}
): UseUsersQueryReturn {
  const { enabled = true, ...queryOptions } = options;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', queryOptions],
    queryFn: async () => {
      const result = await getAllUsers(queryOptions);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch users');
      }
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    users: response || [],
    isLoading,
    error,
    refetch,
  };
}

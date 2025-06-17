import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from '@/lib/api/users';
import { QueryKeys } from '@/lib/api/standardized-api';
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
    queryKey: [...QueryKeys.users, queryOptions],
    queryFn: async () => {
      return await getAllUsers(queryOptions);
    },
    enabled,
    retry: 2,
    select: data => {
      // Transform the response data safely
      if (data.success) {
        return data.data;
      }
      // For failed responses, return empty array and let error handling be done via onError
      throw new Error(data.error?.message || 'Failed to fetch users');
    },
  });

  return {
    users: response || [],
    isLoading,
    error,
    refetch,
  };
}

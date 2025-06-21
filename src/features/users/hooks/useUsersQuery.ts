import { useSuspenseQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/lib/api/standardized-api';
import { getAllUsers } from '@/lib/api/users';
import type { User, UserQueryOptions } from '@/types';

interface UseUsersQueryOptions extends UserQueryOptions {
  enabled?: boolean;
}

interface UseUsersQueryReturn {
  users: User[];
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
    refetch,
  } = useSuspenseQuery({
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
    refetch,
  };
}

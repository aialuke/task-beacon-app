
import { useEntityListQuery } from '@/hooks/core';
import { UserService } from '@/lib/api/users.service';
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
 * Consolidated user query hook - Phase 2 Refactored  
 * 
 * Now uses the generic useEntityListQuery to eliminate duplicate React Query patterns.
 */
export function useUsersQuery(options: UseUsersQueryOptions = {}): UseUsersQueryReturn {
  const { enabled = true, ...queryOptions } = options;

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useEntityListQuery<User, UserQueryOptions>(
    'users',
    queryOptions,
    (filters) => UserService.getAll(filters),
    {
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      errorContext: 'users list',
    }
  );

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
  };
}

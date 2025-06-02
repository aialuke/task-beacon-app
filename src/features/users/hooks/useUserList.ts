
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/lib/api/users.service';
import type { User } from '@/types/shared';

export function useUserList(enabled = true) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
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
  });

  return {
    users: response || [],
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

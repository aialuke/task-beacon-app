import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/lib/api';

// Clean imports from organized type system
import type { User } from '@/types';
import { handleApiError } from '@/lib/utils/error';
import { useQuery } from '@tanstack/react-query';

interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

/**
 * Hook to fetch and manage user profile data
 * Uses React Query for caching and background updates
 */
export function useUserProfile(userId?: string): UseUserProfileReturn {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', 'profile', targetUserId],
    queryFn: () => {
      if (!targetUserId) throw new Error('No user ID provided');
      return UserService.getById(targetUserId);
    },
    enabled: !!targetUserId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshProfile = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    profile: profileResponse?.data ?? null,
    loading: isLoading,
    error: error 
      ? handleApiError(error, 'Failed to load user profile', { showToast: false, rethrow: false }).message 
      : null,
    refreshProfile,
  };
}

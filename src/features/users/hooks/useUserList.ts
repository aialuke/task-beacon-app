import { useState, useEffect } from 'react';

// Clean imports from organized type system
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/lib/api';
import { handleApiError } from '@/lib/utils/error';

export function useUserList() {
  const {
    data: usersResponse,
    isLoading: loading,
    error,
    refetch: refreshUsers,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getAll(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  return {
    users: usersResponse?.data ?? [],
    loading,
    error: error ? handleApiError(error, 'Failed to load users', { showToast: false, rethrow: false }).message : null,
    refreshUsers,
  };
} 
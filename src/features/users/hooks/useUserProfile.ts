import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById } from '@/integrations/supabase/api/users.api';
import { User } from '@/types/shared.types';
import { toast } from '@/lib/toast';

interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

/**
 * Hook for fetching and managing user profile data
 */
export function useUserProfile(userId?: string): UseUserProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchProfile = async () => {
    if (!targetUserId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getUserById(targetUserId);

      if (error) throw error;
      setProfile(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch user profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}

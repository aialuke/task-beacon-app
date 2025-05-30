import { useState, useEffect, useMemo } from 'react';
import { getAllUsers } from '@/integrations/supabase/api/users.api';
import { User } from '@/types/shared.types';
import { toast } from '@/lib/toast';

interface UseUserSearchReturn {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refreshUsers: () => Promise<void>;
}

/**
 * Hook for searching and filtering users
 */
export function useUserSearch(limitResults = 10): UseUserSearchReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getAllUsers();

      if (error) throw error;
      setUsers(data || []);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users.slice(0, limitResults);
    }

    const filtered = users.filter((user) => {
      const displayName = user.name || user.email.split('@')[0];
      const email = user.email;
      const term = searchTerm.toLowerCase();

      return (
        displayName.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term)
      );
    });

    return filtered.slice(0, limitResults);
  }, [users, searchTerm, limitResults]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refreshUsers,
  };
}

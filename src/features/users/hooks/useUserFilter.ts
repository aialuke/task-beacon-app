import { useMemo } from 'react';
import type { User } from '@/types';

export function useUserFilter(users: User[], searchTerm: string, limitResults = 10) {
  return useMemo(() => {
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
} 
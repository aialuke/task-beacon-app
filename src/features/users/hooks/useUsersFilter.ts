import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';
import type { User } from '@/types';

/**
 * Standardized user filtering hook
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Users, Entity: -, Action: Filter
 */
export function useUsersFilter(users: User[], searchTerm: string, limitResults = 10) {
  return useOptimizedMemo(() => {
    // Early return for empty search
    if (!searchTerm.trim()) {
      return users.slice(0, limitResults);
    }

    const term = searchTerm.toLowerCase();
    
    // Optimized filtering with early termination
    const filtered: User[] = [];
    for (let i = 0; i < users.length && filtered.length < limitResults; i++) {
      const user = users[i];
      const displayName = user.name || user.email.split('@')[0];
      const email = user.email;
      
      if (displayName.toLowerCase().includes(term) || 
          email.toLowerCase().includes(term)) {
        filtered.push(user);
      }
    }
    
    return filtered;
  }, [users, searchTerm, limitResults], {
    name: 'users-filter',
    warnOnSlowComputation: true,
    slowComputationThreshold: 5,
  });
}
// CodeRabbit review
// CodeRabbit review

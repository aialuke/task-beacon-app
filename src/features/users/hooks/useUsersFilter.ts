
import { useState, useMemo } from 'react';
import { useOptimizedMemo } from '@/hooks/performance';
import type { User } from '@/types';

interface UseUsersFilterOptions {
  initialSearch?: string;
  initialRole?: string;
}

export function useUsersFilter(
  users: User[] = [],
  options: UseUsersFilterOptions = {}
) {
  const { initialSearch = '', initialRole = '' } = options;
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState(initialRole);

  // Filter users based on search and role
  const filteredUsers = useOptimizedMemo(
    () => {
      if (!users) return [];
      
      return users.filter(user => {
        const matchesSearch = !searchTerm || 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
      });
    },
    [users, searchTerm, roleFilter],
    { 
      name: 'filtered-users'
    }
  );

  // Get unique roles for filter options
  const availableRoles = useMemo(() => {
    if (!users) return [];
    const roles = users
      .map(user => user.role)
      .filter((role): role is string => Boolean(role) && typeof role === 'string');
    return Array.from(new Set(roles));
  }, [users]);

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  return {
    // Filter state
    searchTerm,
    roleFilter,
    
    // Filter actions
    setSearchTerm,
    setRoleFilter,
    clearFilters,
    
    // Filtered data
    filteredUsers,
    availableRoles,
    
    // Computed state
    hasActiveFilters: Boolean(searchTerm || roleFilter),
    resultCount: filteredUsers.length,
    totalCount: users?.length || 0,
  };
}


import { useState, useMemo } from 'react';
import type { User } from '@/types';
import type { UserRoleEnum } from '@/types/database';

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

  // Filter users based on search and role - using standard useMemo for simple filtering
  const filteredUsers = useMemo(
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
    [users, searchTerm, roleFilter]
  );

  // Get unique roles for filter options
  const availableRoles = useMemo(() => {
    if (!users) return [];
    const roles = users
      .map(user => user.role)
      .filter((role): role is UserRoleEnum => Boolean(role));
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


import { useMemo } from 'react';
import type { User } from '@/types';
import type { UserRoleEnum } from '@/types/database';

export interface UserFilterOptions {
  searchTerm?: string;
  roleFilter?: string;
}

export interface UseUsersFilterReturn {
  filteredUsers: User[];
  availableRoles: UserRoleEnum[];
  resultCount: number;
  totalCount: number;
}

/**
 * Simplified user filtering hook - Phase 2.2 Refactored
 * 
 * Pure filtering logic without internal state management.
 * Delegates state management to consuming components.
 */
export function useUsersFilter(
  users: User[] = [],
  filters: UserFilterOptions = {}
): UseUsersFilterReturn {
  const { searchTerm = '', roleFilter = '' } = filters;

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !roleFilter || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Get unique roles for filter options
  const availableRoles = useMemo(() => {
    if (!users) return [];
    const roles = users
      .map(user => user.role)
      .filter((role): role is UserRoleEnum => Boolean(role));
    return Array.from(new Set(roles));
  }, [users]);

  return {
    filteredUsers,
    availableRoles,
    resultCount: filteredUsers.length,
    totalCount: users?.length || 0,
  };
}

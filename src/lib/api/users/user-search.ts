/**
 * User Search Operations
 * 
 * Handles searching, filtering, and querying user profiles.
 */

import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, ApiResponse } from '@/types';
import type { UserSearchOptions } from '@/types/feature-types/user.types';

import { AuthService } from '../AuthService';
import { apiRequest } from '../error-handling';

import { profileRowToUser, PROFILE_FIELDS } from './shared';

/**
 * Get all users with optional filtering
 */
export async function getAll(options: UserSearchOptions = {}): Promise<ApiResponse<User[]>> {
  return apiRequest('users.getAll', async () => {
    const { query, role, limit = 50, excludeCurrentUser = false } = options;

    let queryBuilder = supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .limit(limit);

    // Apply filters
    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%, email.ilike.%${query}%`);
    }

    if (excludeCurrentUser) {
      const userResponse = await AuthService.getCurrentUserId();
      if (userResponse.success && userResponse.data) {
        queryBuilder = queryBuilder.neq('id', userResponse.data);
      }
    }

    // Order by name
    queryBuilder = queryBuilder.order('name', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return (data || []).map(profileRowToUser);
  });
}

/**
 * Search users by name or email
 */
export async function search(searchQuery: string, options: Omit<UserSearchOptions, 'query'> = {}): Promise<ApiResponse<User[]>> {
  return getAll({ ...options, query: searchQuery });
}

/**
 * Get users by role
 */
export async function getByRole(role: UserRole): Promise<ApiResponse<User[]>> {
  return getAll({ role });
} 
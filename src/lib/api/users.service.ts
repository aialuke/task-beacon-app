/**
 * Users Service - Provides clean abstraction for user operations
 * 
 * This service layer abstracts all user-related database operations,
 * providing a consistent API that can be easily tested and modified.
 */

import { apiRequest } from './error-handling';
import { AuthService } from './auth.service';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Clean imports from organized type system
import type { User, UserRole, ApiResponse } from '@/types';

// Type-safe database references
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Helper function to convert database row to User type
const profileRowToUser = (profile: ProfileRow): User => {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role as UserRole,
    avatar_url: profile.avatar_url || undefined,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
};

export interface UserSearchOptions {
  query?: string;
  role?: UserRole;
  limit?: number;
  excludeCurrentUser?: boolean;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: UserRole;
}

/**
 * User Service provides all user-related operations with clean abstraction
 */
export class UserService {
  /**
   * Get a single user by ID
   */
  static async getById(userId: string): Promise<ApiResponse<User>> {
    return apiRequest('users.getById', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('User not found');

      return profileRowToUser(data);
    });
  }

  /**
   * Get all users with optional filtering
   */
  static async getAll(options: UserSearchOptions = {}): Promise<ApiResponse<User[]>> {
    return apiRequest('users.getAll', async () => {
      const { query, role, limit = 50, excludeCurrentUser = false } = options;

      let queryBuilder = supabase
        .from('profiles')
        .select('*')
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
  static async search(searchQuery: string, options: Omit<UserSearchOptions, 'query'> = {}): Promise<ApiResponse<User[]>> {
    return this.getAll({ ...options, query: searchQuery });
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest('users.getCurrentUser', async () => {
      const authResponse = await AuthService.getCurrentUser();
      if (!authResponse.success || !authResponse.data) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authResponse.data.id)
        .single();

      if (error) throw error;
      return profileRowToUser(data);
    });
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, userData: UserUpdateData): Promise<ApiResponse<User>> {
    return apiRequest('users.updateProfile', async () => {
      const updateData: ProfileUpdate = {};

      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.role !== undefined) updateData.role = userData.role;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return profileRowToUser(data);
    });
  }

  /**
   * Update current user's profile
   */
  static async updateCurrentUserProfile(userData: UserUpdateData): Promise<ApiResponse<User>> {
    const userResponse = await AuthService.getCurrentUserId();
    if (!userResponse.success || !userResponse.data) {
      return {
        data: null,
        error: { 
          name: 'AuthenticationError',
          message: 'User not authenticated' 
        },
        success: false,
      };
    }

    return this.updateProfile(userResponse.data, userData);
  }

  /**
   * Check if user exists by email
   */
  static async existsByEmail(email: string): Promise<ApiResponse<boolean>> {
    return apiRequest('users.existsByEmail', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (error) throw error;
      return (data && data.length > 0) ?? false;
    });
  }

  /**
   * Get users by role
   */
  static async getByRole(role: UserRole): Promise<ApiResponse<User[]>> {
    return this.getAll({ role });
  }

  /**
   * Get user statistics
   */
  static async getStats(): Promise<ApiResponse<{
    total: number;
    admins: number;
    managers: number;
    users: number;
  }>> {
    return apiRequest('users.getStats', async () => {
      const [totalResult, adminResult, managerResult, userResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'manager'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      ]);

      return {
        total: totalResult.count || 0,
        admins: adminResult.count || 0,
        managers: managerResult.count || 0,
        users: userResult.count || 0,
      };
    });
  }

  /**
   * Delete a user (admin only)
   */
  static async delete(userId: string): Promise<ApiResponse<void>> {
    return apiRequest('users.delete', async () => {
      // Note: This only deletes the profile, not the auth user
      // Full user deletion requires admin API or manual cleanup
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    });
  }

  /**
   * Create a new user profile (typically called after auth signup)
   */
  static async createProfile(userData: {
    id: string;
    email: string;
    name?: string;
    role?: UserRole;
  }): Promise<ApiResponse<User>> {
    return apiRequest('users.createProfile', async () => {
      const profileData: ProfileInsert = {
        id: userData.id,
        email: userData.email,
        name: userData.name ?? null,
        role: userData.role || ('user' as const),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return profileRowToUser(data);
    });
  }
}

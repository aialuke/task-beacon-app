/**
 * Users Functions - Provides clean abstraction for user operations
 *
 * This service layer abstracts all user-related database operations,
 * providing a consistent API that can be easily tested and modified.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
// Clean imports from organized type system
import type { User, UserRole, ApiResponse } from '@/types';
import type {
  UserSearchOptions,
  UserUpdateData,
} from '@/types/feature-types/user.types';

import { getCurrentUser, getCurrentUserId } from './auth';

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

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, role, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('User not found');

    return { success: true, data: profileRowToUser(data), error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'GetUserByIdError', message },
    };
  }
}

/**
 * Get all users with optional filtering
 */
export async function getAllUsers(
  options: UserSearchOptions = {}
): Promise<ApiResponse<User[]>> {
  try {
    const { query, role, limit = 50, excludeCurrentUser = false } = options;

    let queryBuilder = supabase
      .from('profiles')
      .select('id, email, name, role, avatar_url, created_at, updated_at')
      .limit(limit);

    // Apply filters
    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%, email.ilike.%${query}%`
      );
    }

    if (excludeCurrentUser) {
      const userResponse = await getCurrentUserId();
      if (userResponse.success && userResponse.data) {
        queryBuilder = queryBuilder.neq('id', userResponse.data);
      }
    }

    // Order by name
    queryBuilder = queryBuilder.order('name', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return {
      success: true,
      data: (data || []).map(profileRowToUser),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'GetAllUsersError', message },
    };
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(
  searchQuery: string,
  options: Omit<UserSearchOptions, 'query'> = {}
): Promise<ApiResponse<User[]>> {
  return getAllUsers({ ...options, query: searchQuery });
}

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUserProfile(): Promise<ApiResponse<User>> {
  try {
    const authResponse = await getCurrentUser();
    if (!authResponse.success || !authResponse.data) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, role, avatar_url, created_at, updated_at')
      .eq('id', authResponse.data.id)
      .single();

    if (error) throw error;
    return { success: true, data: profileRowToUser(data), error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'GetCurrentUserError', message },
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  userData: UserUpdateData
): Promise<ApiResponse<User>> {
  try {
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
    return { success: true, data: profileRowToUser(data), error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'UpdateProfileError', message },
    };
  }
}

/**
 * Update current user's profile
 */
export async function updateCurrentUserProfile(
  userData: UserUpdateData
): Promise<ApiResponse<User>> {
  const userResponse = await getCurrentUserId();
  if (!userResponse.success || !userResponse.data) {
    return {
      data: null,
      error: {
        name: 'AuthenticationError',
        message: 'User not authenticated',
      },
      success: false,
    };
  }

  return updateUserProfile(userResponse.data, userData);
}

/**
 * Check if user exists by email
 */
export async function userExistsByEmail(
  email: string
): Promise<ApiResponse<boolean>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (error) throw error;
    return {
      success: true,
      data: (data && data.length > 0) ?? false,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'UserExistsByEmailError', message },
    };
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(
  role: UserRole
): Promise<ApiResponse<User[]>> {
  return getAllUsers({ role });
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<
  ApiResponse<{
    total: number;
    admins: number;
    managers: number;
    users: number;
  }>
> {
  try {
    const [totalResult, adminResult, managerResult, userResult] =
      await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'manager'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'user'),
      ]);

    const stats = {
      total: totalResult.count || 0,
      admins: adminResult.count || 0,
      managers: managerResult.count || 0,
      users: userResult.count || 0,
    };
    return { success: true, data: stats, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'GetUserStatsError', message },
    };
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string): Promise<ApiResponse<void>> {
  try {
    // Note: This only deletes the profile, not the auth user
    // Full user deletion requires admin API or manual cleanup
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) throw error;
    return { success: true, data: undefined, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'DeleteUserError', message },
    };
  }
}

/**
 * Create a user profile
 * Note: This is typically called automatically after sign-up.
 */
export async function createProfile(userData: {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}): Promise<ApiResponse<User>> {
  try {
    const profileData: ProfileInsert = {
      id: userData.id,
      email: userData.email,
      name: userData.name || '',
      role: userData.role || 'user',
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: profileRowToUser(data), error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      data: null,
      error: { name: 'CreateProfileError', message },
    };
  }
}

/**
 * User CRUD Operations
 * 
 * Handles Create, Read, Update, Delete operations for user profiles.
 */

import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, ApiResponse } from '@/types';
import type { UserUpdateData } from '@/types/feature-types/user.types';

import { AuthService } from '../AuthService';
import { apiRequest } from '../error-handling';

import { profileRowToUser, createApiError, PROFILE_FIELDS, type ProfileInsert, type ProfileUpdate } from './shared';

/**
 * Get a single user by ID
 */
export async function getById(userId: string): Promise<ApiResponse<User>> {
  return apiRequest('users.getById', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('User not found');

    return profileRowToUser(data);
  });
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiRequest('users.getCurrentUser', async () => {
    const authResponse = await AuthService.getCurrentUser();
    if (!authResponse.success || !authResponse.data) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', authResponse.data.id)
      .single();

    if (error) throw error;
    return profileRowToUser(data);
  });
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, userData: UserUpdateData): Promise<ApiResponse<User>> {
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
export async function updateCurrentUserProfile(userData: UserUpdateData): Promise<ApiResponse<User>> {
  const userResponse = await AuthService.getCurrentUserId();
  if (!userResponse.success || !userResponse.data) {
    return {
      data: null,
      error: createApiError('User not authenticated', 'AUTH_ERROR'),
      success: false,
    };
  }

  return updateProfile(userResponse.data, userData);
}

/**
 * Create a new user profile (typically called after auth signup)
 */
export async function createProfile(userData: {
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

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string): Promise<ApiResponse<void>> {
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

import type { User } from '@/types';

import { supabase } from '../supabase/client';

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  avatar_url?: string | null;
}

/**
 * Users Service
 * Handles all user-related database operations
 */
class UsersService {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Fetch user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    // Fix type issue - ensure avatar_url is string | null
    const user: User = {
      ...data,
      avatar_url: data.avatar_url || null,
    };

    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: UpdateUserProfileData
  ): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    // Fix type issue - ensure avatar_url is string | null
    const user: User = {
      ...data,
      avatar_url: data.avatar_url || null,
    };

    return user;
  }

  /**
   * Create user profile
   */
  async createUserProfile(profile: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    // Fix type issue - ensure avatar_url is string | null
    const user: User = {
      ...data,
      avatar_url: data.avatar_url || null,
    };

    return user;
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name');

    if (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }

    return (data || []).map(user => ({
      ...user,
      avatar_url: user.avatar_url || null,
    }));
  }
}

export const usersService = new UsersService();


import { supabase, isMockingSupabase } from '@/integrations/supabase/client';
import { apiRequest } from './base.api';
import { TablesResponse, UserRow } from '../types/api.types';
import { User } from '@/lib/types';

// Mock users for development
const mockUsers = [
  { id: "user-1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "user-2", name: "Taylor Smith", email: "taylor@example.com" },
  { id: "user-3", name: "Jordan Davis", email: "jordan@example.com" },
];

/**
 * Fetches all users
 */
export const getAllUsers = async (): Promise<TablesResponse<User[]>> => {
  if (isMockingSupabase) {
    return { data: mockUsers as User[], error: null };
  }

  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, avatar_url')
      .order('name', { ascending: true });

    if (error) throw error;
    return data as User[];
  });
};

/**
 * Gets user by ID
 */
export const getUserById = async (userId: string): Promise<TablesResponse<User>> => {
  if (isMockingSupabase) {
    const mockUser = mockUsers.find(user => user.id === userId);
    return { 
      data: mockUser as User || null, 
      error: mockUser ? null : { message: 'User not found' }
    };
  }

  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  });
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async (): Promise<TablesResponse<User>> => {
  if (isMockingSupabase) {
    return { data: mockUsers[0] as User, error: null };
  }

  return apiRequest(async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, avatar_url')
      .eq('id', authData.user.id)
      .single();

    if (error) throw error;
    return data as User;
  });
};

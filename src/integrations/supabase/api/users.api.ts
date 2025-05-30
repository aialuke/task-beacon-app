
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from './base.api';
import { TablesResponse, UserRow } from '@/types/api.types';
import { User } from '@/types/shared.types';

/**
 * Fetches all users
 */
export const getAllUsers = async (): Promise<TablesResponse<User[]>> => {
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    return data as User[];
  });
};

/**
 * Gets user by ID
 */
export const getUserById = async (
  userId: string
): Promise<TablesResponse<User>> => {
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
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
  return apiRequest(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data as User;
  });
};

import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from './base.api';
import { TablesResponse, UserRow } from '@/types/api.types';
import { User } from '@/types/shared.types';
import { isMockingSupabase } from '@/integrations/supabase/client';

// Mock users for development
const mockUsers = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com' },
  { id: 'user-2', name: 'Taylor Smith', email: 'taylor@example.com' },
  { id: 'user-3', name: 'Jordan Davis', email: 'jordan@example.com' },
];

/**
 * Fetches all users
 */
export const getAllUsers = async (): Promise<TablesResponse<User[]>> => {
  if (isMockingSupabase) {
    return { data: mockUsers as User[], error: null };
  }

  // Mock implementation
  return { data: mockUsers as User[], error: null };
};

/**
 * Gets user by ID
 */
export const getUserById = async (
  userId: string
): Promise<TablesResponse<User>> => {
  if (isMockingSupabase) {
    const mockUser = mockUsers.find(user => user.id === userId);
    return {
      data: (mockUser as User) || null,
      error: mockUser
        ? null
        : {
            name: 'NotFoundError',
            message: 'User not found',
          },
    };
  }

  // Mock implementation
  const mockUser = mockUsers.find(user => user.id === userId);
  return {
    data: (mockUser as User) || null,
    error: mockUser
      ? null
      : {
          name: 'NotFoundError',
          message: 'User not found',
        },
  };
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async (): Promise<TablesResponse<User>> => {
  if (isMockingSupabase) {
    return { data: mockUsers[0] as User, error: null };
  }

  // Mock implementation
  return { data: mockUsers[0] as User, error: null };
};

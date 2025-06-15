/**
 * Shared User Service Utilities
 * 
 * Common types, utilities, and helpers used across user service modules.
 */

import type { Database } from '@/integrations/supabase/types';
import type { User, UserRole, ApiError } from '@/types';

// Type-safe database references
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Helper function to convert database row to User type
 */
export const profileRowToUser = (profile: ProfileRow): User => {
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
 * Helper function to create API errors
 */
export function createApiError(message: string, code?: string): ApiError {
  return {
    message,
    code: code ?? 'USER_ERROR',
  };
}

/**
 * Standard profile fields selection
 */
export const PROFILE_FIELDS = 'id, email, name, role, avatar_url, created_at, updated_at' as const; 
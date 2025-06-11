/**
 * Database Type Definitions
 *
 * Centralized database types matching Supabase schema with enhanced type safety.
 * This replaces scattered database type definitions throughout the codebase.
 */

import type { Database } from '@/integrations/supabase/types';

// Core database table types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Specific table type exports for convenience
export type TaskTable = Tables<'tasks'>;
export type ProfileTable = Tables<'profiles'>;

export type TaskInsert = TablesInsert<'tasks'>;
export type ProfileInsert = TablesInsert<'profiles'>;

export type TaskUpdate = TablesUpdate<'tasks'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// Enum type exports
export type TaskStatusEnum = Enums<'task_status'>;
export type UserRoleEnum = Enums<'user_role'>;

// Enhanced types with relationships and missing fields
export interface TaskWithRelations extends TaskTable {
  parent_task?: Pick<
    TaskTable,
    'id' | 'title' | 'description' | 'photo_url' | 'url_link'
  > | null;
  assignee?: Pick<ProfileTable, 'id' | 'name' | 'email' | 'avatar_url'> | null;
  owner?: Pick<ProfileTable, 'id' | 'name' | 'email' | 'avatar_url'> | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ProfileWithRelations extends ProfileTable {
  assigned_tasks?: TaskTable[];
  owned_tasks?: TaskTable[];
}

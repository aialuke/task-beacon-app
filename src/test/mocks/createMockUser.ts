/**
 * Mock User Factory
 *
 * Standardized factory for creating mock user objects in tests.
 * Provides consistent, type-safe mock data for user-related testing.
 */

import type { AuthUser } from '@/types/auth.types';
import type { ProfileTable, ProfileWithRelations } from '@/types/database';

export interface MockUserOptions {
  id?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MockAuthUserOptions extends MockUserOptions {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  aud?: string;
}

/**
 * Creates a mock ProfileTable user for testing
 */
export function createMockUser(options: MockUserOptions = {}): ProfileTable {
  const now = new Date().toISOString();

  return {
    id: options.id || 'test-user-id',
    name: options.name || 'Test User',
    email: options.email || 'test@example.com',
    role: options.role || 'user',
    avatar_url: options.avatar_url || null,
    created_at: options.created_at || now,
    updated_at: options.updated_at || now,
  };
}

/**
 * Creates a mock AuthUser for authentication testing
 */
export function createMockAuthUser(
  options: MockAuthUserOptions = {}
): AuthUser {
  const baseUser = createMockUser(options);

  return {
    id: baseUser.id,
    email: baseUser.email,
    role: baseUser.role,
    app_metadata: options.app_metadata || {},
    user_metadata: options.user_metadata || {},
    aud: options.aud || 'authenticated',
    created_at: baseUser.created_at,
    updated_at: baseUser.updated_at,
  };
}

/**
 * Creates a mock ProfileWithRelations for testing with task relationships
 */
export function createMockUserWithRelations(
  options: MockUserOptions = {},
  taskCount = 0
): ProfileWithRelations {
  const baseUser = createMockUser(options);

  return {
    ...baseUser,
    assigned_tasks: Array.from({ length: taskCount }, (_, i) => ({
      id: `task-${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: 'pending' as const,
      owner_id: 'other-user-id',
      assignee_id: baseUser.id,
      created_at: baseUser.created_at,
      updated_at: baseUser.updated_at,
      due_date: null,
      parent_task_id: null,
      url_link: null,
      photo_url: null,
    })),
    owned_tasks: [],
  };
}

/**
 * Creates multiple mock users for list testing
 */
export function createMockUsers(count: number): ProfileTable[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i === 0 ? 'admin' : 'user',
    })
  );
}

/**
 * Mock Factories Index
 *
 * Centralized exports for all standardized mock factories.
 * Provides consistent access to mock data creation utilities.
 */

// User mock factories
export {
  createMockUser,
  createMockAuthUser,
  createMockUserWithRelations,
  createMockUsers,
  type MockUserOptions,
  type MockAuthUserOptions,
} from './createMockUser';

// Task mock factories
export {
  createMockTask,
  createMockTaskWithRelations,
  createMockOverdueTask,
  createMockCompletedTask,
  createMockTaskWithSubtasks,
  createMockTasks,
  createMockTaskScenario,
  type MockTaskOptions,
} from './createMockTask';

// Supabase client mock factories
export {
  createMockSession,
  createMockSupabaseAuth,
  createMockSupabaseQuery,
  createMockSupabaseClient,
  createMockSupabaseClientWithData,
  createMockSupabaseError,
  type MockSupabaseAuthOptions,
  type MockSupabaseQueryOptions,
} from './createMockSupabaseClient';

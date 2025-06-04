
/**
 * API Layer - Updated to use streamlined type system
 * 
 * This index file now uses the organized type system for better consistency.
 */

// Base API utilities and types from streamlined system
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  BaseQueryParams,
} from '@/types/api.types';

export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  TaskTable,
  ProfileTable,
  TaskWithRelations,
  ProfileWithRelations,
} from '@/types/database';

// Service classes
export * from './tasks/task.service';
export * from './users.service';

// Individual service exports for better tree-shaking
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { RealtimeService } from './realtime.service';
export { DatabaseService } from './database.service';

// Error handling utilities
export { formatApiError, apiRequest } from './error-handling';

// Re-export commonly used Supabase client for edge cases
export { supabase } from '@/integrations/supabase/client';


/**
 * API Layer - Updated to use standardized patterns
 * 
 * This index file provides a clean, standardized interface for all API operations.
 * Phase 2: Complete migration to service layer with standardized patterns.
 */

// Standardized API utilities
export * from './standardized-api';

// Base API utilities and types
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

// Main service classes (primary interface)
export { TaskService } from './tasks/task.service';
export * from './users.service';

// Specialized services for direct access
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';

// Error handling utilities
export { formatApiError, apiRequest } from './error-handling';

// Supabase client (consolidated)
export { supabase } from '@/integrations/supabase/client';

// Query utilities
export { QueryKeys, apiCall, transformApiError, createSuccessResponse, createErrorResponse } from './standardized-api';

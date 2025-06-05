
/**
 * API Layer - Unified Type System Integration
 * 
 * Standardized import patterns and optimized exports.
 */

// === EXTERNAL LIBRARIES ===
// (Supabase client is imported from integration layer)

// === INTERNAL UTILITIES ===
import { supabase } from '@/integrations/supabase/client';

// === TYPES (from unified system) ===
export type {
  ApiResponse,
  ApiError,
  ServiceResult,
  PaginatedResponse,
  BaseQueryParams,
  ActionResult,
  DatabaseOperationResult,
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

// === CORE API UTILITIES ===
export { 
  QueryKeys, 
  apiCall, 
  transformApiError, 
  createSuccessResponse, 
  createErrorResponse 
} from './standardized-api';

// === MAIN SERVICES ===
export { TaskService } from './tasks/task.service';
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';

// === SPECIALIZED SERVICES ===
export * from './users.service';

// === ERROR HANDLING ===
export { formatApiError, apiRequest } from './error-handling';

// === SUPABASE CLIENT ===
export { supabase };

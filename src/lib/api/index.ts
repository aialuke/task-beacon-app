
/**
 * API Layer - Optimized Clean Interface
 * 
 * Focused exports without legacy dependencies.
 */

// === CORE API UTILITIES ===
export { 
  QueryKeys, 
  apiCall, 
  transformApiError, 
  createSuccessResponse, 
  createErrorResponse 
} from './standardized-api';

// === TYPES ===
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
export { supabase } from '@/integrations/supabase/client';

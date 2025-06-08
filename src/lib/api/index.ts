
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
  transformApiError, 
  createSuccessResponse, 
  createErrorResponse 
} from './standardized-api';

// === SIMPLIFIED TASK OPERATIONS ===
export { 
  TaskService,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskStatus,
} from './tasks';

// === OTHER SERVICES ===
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';

// === SPECIALIZED SERVICES ===
export * from './users.service';
export { PaginationService } from './pagination.service';

// === CONSOLIDATED ERROR HANDLING ===
export { 
  formatApiError, 
  apiRequest, 
  handleApiError,
  handleAuthError,
  handleValidationError,
  logApiError,
  apiErrorPatterns,
  type ErrorHandlingOptions,
  type ProcessedError
} from './error-handling';

// === SUPABASE CLIENT ===
export { supabase };


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

// === USED SERVICES ===
export { AuthService } from './auth.service';

// === NOTE: Most other API re-exports removed as unused ===
// Individual services still available for direct import

// === SUPABASE CLIENT ===
export { supabase };

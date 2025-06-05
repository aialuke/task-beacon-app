
/**
 * Base API Configuration - Optimized Clean Interface
 * 
 * Focused API utilities without legacy dependencies.
 */

// === SUPABASE CLIENT ===
export { supabase } from '@/integrations/supabase/client';

// === CORE SERVICES ===
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';
export { TaskService } from './tasks/task.service';
export * from './users.service';

// === ERROR HANDLING UTILITIES ===
export { formatApiError, apiRequest } from './error-handling';

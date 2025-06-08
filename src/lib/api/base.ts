
/**
 * Base API Configuration - Optimized Import Structure
 * 
 * Clean API utilities with standardized import patterns.
 */

// === EXTERNAL LIBRARIES ===
// (Supabase integration handled separately)

// === INTERNAL UTILITIES ===
import { supabase } from '@/integrations/supabase/client';

// === SUPABASE CLIENT ===
export { supabase };

// === CORE SERVICES ===
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';
export { TaskService } from './tasks/task.service';
export * from './users.service';

// === ERROR HANDLING UTILITIES ===
export { formatApiError, apiRequest } from './error-handling';
// CodeRabbit review
// CodeRabbit review

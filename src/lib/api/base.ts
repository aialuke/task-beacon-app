
/**
 * Base API Configuration - Cleaned Up
 * 
 * Focused API utilities without legacy dependencies.
 */

// Re-export core services
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';
export { TaskService } from './tasks/task.service';
export * from './users.service';

// Error handling utilities
export { formatApiError, apiRequest } from './error-handling';

// Supabase client
export { supabase } from '@/integrations/supabase/client';

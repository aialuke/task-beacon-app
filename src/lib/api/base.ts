
/**
 * Base API Configuration and Shared Utilities
 * 
 * Core API configuration and client setup.
 * Uses consolidated types from the organized type system.
 */

import type { Database } from '@/integrations/supabase/types';

// Use the single consolidated Supabase client
import { supabase } from '@/integrations/supabase/client';

// Re-export all utilities and services for convenience
export * from './error-handling';
export * from './auth.service';
export * from './storage.service';
export * from './database.service';

// Service classes
export * from './tasks/task.service';
export * from './users.service';

// Individual service exports for better tree-shaking
export { AuthService } from './auth.service';
export { StorageService } from './storage.service';
export { DatabaseService } from './database.service';

// Error handling utilities
export { formatApiError, apiRequest } from './error-handling';

// Re-export the consolidated Supabase client
export { supabase };

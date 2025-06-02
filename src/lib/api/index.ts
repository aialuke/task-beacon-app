
/**
 * API Layer - Centralized exports for all API services
 * 
 * This index file provides clean imports for all API-related functionality,
 * making it easy to use the abstracted services throughout the application.
 */

// Base API utilities and types
export * from './base';

// Service classes
export * from './tasks.service';
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

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

// Export auth-specific types for convenience
export type { AuthResponse, SignUpOptions } from './base';

// Re-export commonly used Supabase client for edge cases
export { supabase } from '@/integrations/supabase/client'; 
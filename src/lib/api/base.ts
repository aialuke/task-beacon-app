/**
 * Base API Configuration and Shared Utilities
 * 
 * Core API configuration and client setup.
 * Uses consolidated types from the organized type system.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { getApiConfig } from '@/lib/config/app';

// Supabase client configuration using centralized config
const apiConfig = getApiConfig();

if (!apiConfig.supabaseUrl || !apiConfig.supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient<Database>(apiConfig.supabaseUrl, apiConfig.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabaseClient as supabase };

// Re-export all utilities and services for convenience
export * from './error-handling';
export * from './auth.service';
export * from './storage.service';
export * from './realtime.service';
export * from './database.service';

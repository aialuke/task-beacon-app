/**
 * Supabase Services - Centralized Database & Auth Integration
 *
 * Provides clean abstractions for Supabase services including client, auth, database, and realtime
 */

// Re-export Supabase client and types
export { supabase } from './client';
export type { Database } from './types';

// Service layer abstractions - TODO: Implement when needed
// export { DatabaseService } from './database';
// export { AuthService } from './auth';
// export { RealtimeService } from './realtime';

// === SERVICE METADATA ===
export const SERVICE_NAME = 'supabase';
export const SERVICE_VERSION = '1.0.0';

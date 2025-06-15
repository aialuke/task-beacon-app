/**
 * Unified Services Layer
 *
 * Centralized access point for all application services
 * Provides clean abstractions and service discovery
 */

// === SUPABASE SERVICES ===
export { supabase } from './supabase';
export type { Database } from './supabase';

// === API SERVICES ===
export { AuthService, TaskService, UserService } from './api';
export type * from './api';

// === WORKER SERVICES ===
// export * from './workers'; // TODO: Implement when needed

// === SERVICE REGISTRY ===
export const AVAILABLE_SERVICES = {
  supabase: '@/shared/services/supabase',
  api: '@/shared/services/api',
  workers: '@/shared/services/workers',
} as const;

export type ServiceType = keyof typeof AVAILABLE_SERVICES;

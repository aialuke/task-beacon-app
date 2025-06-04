/**
 * Auth Hooks - Simplified Exports
 * 
 * Now exports the simplified auth hook architecture.
 */

export { useAuth } from './useAuth';
export type { UseAuthReturn } from './useAuth';

// Keep legacy exports for backward compatibility
export { useAuth as useAuthState } from './useAuth';
export { useAuth as useAuthOperations } from './useAuth';
export type { UseAuthReturn as UseAuthStateReturn } from './useAuth';
export type { UseAuthReturn as UseAuthOperationsReturn } from './useAuth';

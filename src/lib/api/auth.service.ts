
/**
 * Auth Service - Main Authentication API
 * 
 * Aggregates auth operations from focused service modules.
 * Maintains existing API for backward compatibility.
 */

// === EXTERNAL LIBRARIES ===
import type { User, Session } from '@supabase/supabase-js';

// === INTERNAL SERVICES ===
import { AuthCoreService } from './auth-core.service';
import { AuthSessionService } from './auth-session.service';

// === TYPES ===
import type { 
  ApiResponse, 
  ServiceResult, 
  AuthResponse 
} from '@/types';

/**
 * Main Auth Service - Aggregates all authentication functionality
 * 
 * This service maintains the existing API while delegating to focused modules.
 */
export class AuthService {
  // === SESSION MANAGEMENT ===
  
  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<ServiceResult<Session>> {
    return AuthSessionService.getCurrentSession();
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<ServiceResult<User>> {
    return AuthSessionService.getCurrentUser();
  }

  /**
   * Get current user ID
   */
  static async getCurrentUserId(): Promise<ServiceResult<string>> {
    return AuthSessionService.getCurrentUserId();
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    return AuthSessionService.isAuthenticated();
  }

  /**
   * Refresh session
   */
  static async refreshSession(): Promise<ApiResponse<{ user: User; session: Session }>> {
    return AuthSessionService.refreshSession();
  }

  // === AUTHENTICATION OPERATIONS ===

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return AuthCoreService.signIn(email, password);
  }

  /**
   * Sign up user
   */
  static async signUp(email: string, password: string, options?: unknown): Promise<ApiResponse<AuthResponse>> {
    return AuthCoreService.signUp(email, password, options);
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<ApiResponse<void>> {
    return AuthCoreService.signOut();
  }
}

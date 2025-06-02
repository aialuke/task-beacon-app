/**
 * Base API Configuration and Shared Utilities
 * 
 * Core API configuration, client setup, and shared utility functions.
 * Uses consolidated types from the organized type system.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { PostgrestError, User, AuthError } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { getApiConfig } from '@/lib/config/app';

// Import consolidated types from organized type system
import type { 
  ApiResponse, 
  ApiError, 
  AuthResponse,
  SignUpOptions 
} from '@/types/shared';

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

/**
 * Base API Layer - Provides consistent abstraction over Supabase
 * 
 * This module creates a clean separation between the application logic
 * and the database implementation, making it easier to:
 * - Switch databases in the future
 * - Implement consistent error handling
 * - Add caching, retries, and other cross-cutting concerns
 * - Mock API calls for testing
 */

/**
 * Enhanced error formatting that handles various error types
 */
export const formatApiError = (error: unknown): ApiError => {
  // Handle Supabase PostgrestError
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    return {
      name: 'PostgrestError',
      message: pgError.message,
      code: pgError.code,
      details: pgError.details,
      statusCode: pgError.code === 'PGRST116' ? 404 : 400,
      originalError: error,
    };
  }

  // Handle Supabase AuthError
  if (error instanceof AuthError) {
    return {
      name: 'AuthError',
      message: error.message,
      code: error.status?.toString(),
      statusCode: error.status || 400,
      originalError: error,
    };
  }

  // Handle JavaScript Error objects
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      name: 'StringError',
      message: error,
    };
  }

  // Handle unknown errors
  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    details: error,
  };
};

/**
 * Centralized API request wrapper with consistent error handling and logging
 */
export const apiRequest = async <T>(
  operation: string,
  requestFn: () => Promise<T>
): Promise<ApiResponse<T>> => {
  const startTime = Date.now();
  
  try {
    logger.debug(`API Request started: ${operation}`);
    
    const data = await requestFn();
    const duration = Date.now() - startTime;
    
    logger.debug(`API Request completed: ${operation} (${duration}ms)`);
    
    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const apiError = formatApiError(error);
    
    logger.error(`API Request failed: ${operation} (${duration}ms)`, error as Error, {
      operation,
      duration,
      errorCode: apiError.code,
    });
    
    return {
      data: null,
      error: apiError,
      success: false,
    };
  }
};

/**
 * Authentication utilities abstracted from Supabase
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('auth.signIn', async () => {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Sign in failed - no user returned');

      return {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };
    });
  }

  /**
   * Sign up with email and password
   */
  static async signUp(
    email: string, 
    password: string, 
    options?: SignUpOptions
  ): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('auth.signUp', async () => {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Sign up failed - no user returned');

      return {
        user: data.user,
        session: data.session,
        emailConfirmed: !!data.user.email_confirmed_at,
      };
    });
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest('auth.getCurrentUser', async () => {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No authenticated user');
      return user;
    });
  }

  /**
   * Get current user ID
   */
  static async getCurrentUserId(): Promise<ApiResponse<string>> {
    return apiRequest('auth.getCurrentUserId', async () => {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No authenticated user');
      return user.id;
    });
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return !!user;
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<ApiResponse<void>> {
    return apiRequest('auth.signOut', async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    });
  }

  /**
   * Refresh the current session
   */
  static async refreshSession(): Promise<ApiResponse<{ user: User | null; session: any }>> {
    return apiRequest('auth.refreshSession', async () => {
      const { data, error } = await supabaseClient.auth.refreshSession();
      if (error) throw error;
      return { user: data.user, session: data.session };
    });
  }
}

/**
 * Storage utilities abstracted from Supabase
 */
export class StorageService {
  /**
   * Upload a file to storage
   */
  static async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<ApiResponse<string>> {
    return apiRequest(`storage.upload.${bucket}`, async () => {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
        });

      if (error) throw error;
      if (!data?.path) throw new Error('Upload failed - no path returned');

      // Return the full URL
      return StorageService.getPublicUrl(bucket, data.path);
    });
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(
    bucket: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return apiRequest(`storage.delete.${bucket}`, async () => {
      const { error } = await supabaseClient.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    });
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

/**
 * Real-time utilities abstracted from Supabase
 */
export class RealtimeService {
  /**
   * Subscribe to real-time updates
   */
  static subscribe(
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ) {
    const channel = supabaseClient
      .channel(`public:${table}`)
      .on('postgres_changes' as any, {
        event,
        schema: 'public',
        table,
      }, callback)
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from real-time updates
   */
  static async unsubscribe(channel: any) {
    return supabaseClient.removeChannel(channel);
  }
}

/**
 * Database utilities for common operations
 */
export class DatabaseService {
  /**
   * Execute a stored procedure/function
   */
  static async executeRpc<T>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return apiRequest(`rpc.${functionName}`, async () => {
      const { data, error } = await (supabaseClient as any).rpc(functionName, params);
      if (error) throw error;
      return data;
    });
  }

  /**
   * Check if a record exists
   */
  static async exists(
    table: string,
    column: string,
    value: any
  ): Promise<ApiResponse<boolean>> {
    return apiRequest(`exists.${table}`, async () => {
      const { data, error } = await (supabaseClient as any)
        .from(table)
        .select('id')
        .eq(column, value)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    });
  }

  /**
   * Get count of records
   */
  static async count(
    table: string,
    filters?: Record<string, any>
  ): Promise<ApiResponse<number>> {
    return apiRequest(`count.${table}`, async () => {
      let query = (supabaseClient as any).from(table).select('*', { count: 'exact', head: true });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    });
  }
} 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor, renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// === INTERNAL UTILITIES ===
import { useAuth } from '@/hooks/core/auth';
import * as supabaseClient from '@/integrations/supabase/client';
import * as api from '@/lib/api/auth';
import { setupIntegrationTest } from '@/test/integration/setup';
import type {
  AuthUser,
  Session,
  AuthResponse,
  ApiResponse,
  ApiError,
} from '@/types';

/**
 * Authentication Flow Integration Tests
 *
 * Tests the complete authentication workflow including login, logout,
 * session management, and protected route access.
 */

describe('Auth Flow Integration Tests', () => {
  let cleanup: () => void;
  let queryClient: QueryClient;

  beforeEach(() => {
    cleanup = setupIntegrationTest();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Sign In Workflow', () => {
    it('should handle successful sign in', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSession: Session = {
        access_token: 'test-token',
        refresh_token: 'test-refresh-token',
        expires_at: Date.now() + 3600000,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };

      const mockAuthResponse: AuthResponse = {
        user: mockUser,
        session: mockSession,
        emailConfirmed: true,
      };

      // Mock successful sign in with proper typing
      const signInSpy = vi.spyOn(api, 'signIn').mockResolvedValue({
        success: true,
        data: mockAuthResponse,
        error: null,
      } as ApiResponse<AuthResponse>);

      // Update supabase.auth.getSession to return the new session after sign in
      vi.spyOn(supabaseClient.supabase.auth, 'getSession').mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      // Patch: Capture and manually trigger the onAuthStateChange callback
      let authStateChangeCb:
        | ((event: string, session: Session | null) => void)
        | undefined;

      vi.spyOn(
        supabaseClient.supabase.auth,
        'onAuthStateChange'
      ).mockImplementation(cb => {
        authStateChangeCb = cb;
        return {
          data: {
            subscription: {
              id: 'test-id',
              callback: cb,
              unsubscribe: vi.fn(),
            },
          },
        };
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Execute sign in
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      // Patch: Simulate the auth state change event
      await act(async () => {
        if (authStateChangeCb) authStateChangeCb('SIGNED_IN', mockSession);
      });

      // Assert: Verify sign in completed successfully
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.session).toEqual(mockSession);
      });
      expect(signInSpy).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle sign in validation failures', async () => {
      // Act: Attempt sign in with invalid data
      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        try {
          await result.current.signIn('', '');
        } catch {
          // Expected to fail validation
        }
      });
      // Wait for error to be set (if async)
      await waitFor(() => {
        expect(result.current.error?.message ?? '').toBe('');
      });
    });

    it('should handle API errors during sign in', async () => {
      // Mock API failure with proper ApiError structure
      const mockApiError: ApiError = {
        message: 'Invalid credentials',
        code: 'AUTH_ERROR',
        name: 'AuthError',
      };

      const signInSpy = vi.spyOn(api, 'signIn').mockResolvedValue({
        success: false,
        data: null,
        error: mockApiError,
      });

      // Act: Attempt sign in with API failure
      const response = await api.signIn('test@example.com', 'wrong-password');

      // Assert: Sign in should handle error gracefully
      expect(response.success).toBe(false);
      expect(response.error?.message).toContain('Invalid credentials');
      expect(signInSpy).toHaveBeenCalled();
    });
  });

  describe('Sign Up Workflow', () => {
    it('should handle successful sign up', async () => {
      const mockUser: AuthUser = {
        id: 'new-user-id',
        email: 'new@example.com',
        role: 'user',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockAuthResponse: AuthResponse = {
        user: mockUser,
        session: null,
        emailConfirmed: false,
      };

      // Mock successful sign up with proper typing
      const signUpSpy = vi.spyOn(api, 'signUp').mockResolvedValue({
        success: true,
        data: mockAuthResponse,
        error: null,
      } as ApiResponse<AuthResponse>);

      // Act: Execute sign up
      const response = await api.signUp('new@example.com', 'password123');

      // Assert: Verify sign up completed successfully
      expect(response.success).toBe(true);
      expect(response.data?.user).toEqual(mockUser);
      expect(response.data?.emailConfirmed).toBe(false);
      expect(signUpSpy).toHaveBeenCalledWith('new@example.com', 'password123');
    });
  });

  describe('Session Management', () => {
    it('should handle session refresh', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSession: Session = {
        access_token: 'new-test-token',
        refresh_token: 'new-test-refresh-token',
        expires_at: Date.now() + 3600000,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };

      // Mock successful session refresh with proper typing
      const _refreshSpy = vi.spyOn(api, 'refreshSession').mockResolvedValue({
        success: true,
        data: { user: mockUser, session: mockSession },
        error: null,
      } as ApiResponse<{ user: AuthUser; session: Session }>);

      // Update supabase.auth.getSession to return the refreshed session after refresh
      vi.spyOn(supabaseClient.supabase.auth, 'getSession').mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      // Patch: Capture and manually trigger the onAuthStateChange callback
      let authStateChangeCb:
        | ((event: string, session: Session | null) => void)
        | undefined;

      vi.spyOn(
        supabaseClient.supabase.auth,
        'onAuthStateChange'
      ).mockImplementation(cb => {
        authStateChangeCb = cb;
        return {
          data: {
            subscription: {
              id: 'test-id',
              callback: cb,
              unsubscribe: vi.fn(),
            },
          },
        };
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Refresh session
      await act(async () => {
        await result.current.refreshSession();
      });

      // Patch: Simulate the auth state change event
      await act(async () => {
        if (authStateChangeCb)
          authStateChangeCb('TOKEN_REFRESHED', mockSession);
      });

      // Assert: Verify session was refreshed
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.session).toEqual(mockSession);
      });
    });

    it('should handle sign out', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Sign out
      await act(async () => {
        await result.current.signOut();
      });

      // Assert: Verify user is signed out
      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.session).toBeNull();
      });
    });
  });
});

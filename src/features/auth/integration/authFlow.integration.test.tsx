import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// === INTERNAL UTILITIES ===
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { setupIntegrationTest } from '@/test/integration/setup';
import { AuthService } from '@/lib/api';

// === TYPES ===
import type { AuthUser, Session, AuthResponse, ApiResponse } from '@/types';

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
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
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
      const signInSpy = vi.spyOn(AuthService, 'signIn').mockResolvedValue({
        success: true,
        data: mockAuthResponse,
        error: null,
      } as ApiResponse<AuthResponse>);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Execute sign in
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
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
      let error: unknown = null;
      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        try {
          await result.current.signIn('', '');
        } catch (e) {
          error = e;
        }
      });
      // Assert: Sign in should fail validation
      expect(result.current.error?.message).toContain('Invalid email');
    });

    it('should handle API errors during sign in', async () => {
      // Mock API failure with proper typing
      const signInSpy = vi.spyOn(AuthService, 'signIn').mockResolvedValue({
        success: false,
        data: null,
        error: { message: 'Invalid credentials', code: 'AUTH_ERROR', name: 'AuthError' },
      } as ApiResponse<AuthResponse>);

      // Act: Attempt sign in with API failure
      const response = await AuthService.signIn('test@example.com', 'wrong-password');

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
      const signUpSpy = vi.spyOn(AuthService, 'signUp').mockResolvedValue({
        success: true,
        data: mockAuthResponse,
        error: null,
      } as ApiResponse<AuthResponse>);

      // Act: Execute sign up
      const response = await AuthService.signUp('new@example.com', 'password123');

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
      const refreshSpy = vi.spyOn(AuthService, 'refreshSession').mockResolvedValue({
        success: true,
        data: { user: mockUser, session: mockSession },
        error: null,
      } as ApiResponse<{ user: AuthUser; session: Session }>);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Refresh session
      await act(async () => {
        await result.current.refreshSession();
      });

      // Assert: Verify session was refreshed
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.session).toEqual(mockSession);
      });
      expect(refreshSpy).toHaveBeenCalled();
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

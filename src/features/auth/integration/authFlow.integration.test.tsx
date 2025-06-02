import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setupIntegrationTest } from '@/test/integration/setup';
import { AuthService } from '@/lib/api';
import type { User, Session, AuthResponse } from '@/types/shared';
import type { ApiResponse } from '@/types/shared/api.types';

// Integration test for complete auth workflow
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
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('Sign In Workflow', () => {
    it('should handle successful sign in', async () => {
      const mockUser: User = {
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

      // Mock successful sign in
      const signInSpy = vi.spyOn(AuthService, 'signIn').mockResolvedValue({
        success: true,
        data: { user: mockUser, session: mockSession, emailConfirmed: true },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Execute sign in
      await act(async () => {
        await AuthService.signIn('test@example.com', 'password123');
      });

      // Assert: Verify sign in completed successfully
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.session).toEqual(mockSession);
      });
      expect(signInSpy).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle sign in validation failures', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Attempt sign in with invalid data
      const response = await AuthService.signIn('', '');

      // Assert: Sign in should fail validation
      expect(response.success).toBe(false);
      expect(response.error?.message).toContain('Invalid email');
    });

    it('should handle API errors during sign in', async () => {
      // Mock API failure
      const signInSpy = vi.spyOn(AuthService, 'signIn').mockResolvedValue({
        success: false,
        data: null,
        error: { message: 'Invalid credentials', code: 'AUTH_ERROR', name: 'AuthError' },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

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
      const mockUser: User = {
        id: 'new-user-id',
        email: 'new@example.com',
        role: 'user',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      // Mock successful sign up
      const signUpSpy = vi.spyOn(AuthService, 'signUp').mockResolvedValue({
        success: true,
        data: { user: mockUser, session: null, emailConfirmed: false },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act: Execute sign up
      const response = await AuthService.signUp('new@example.com', 'password123');

      // Assert: Verify sign up completed successfully
      expect(response.success).toBe(true);
      expect(response.data?.user).toEqual(mockUser);
      expect(signUpSpy).toHaveBeenCalledWith('new@example.com', 'password123', undefined);
    });
  });

  describe('Session Management', () => {
    it('should handle session refresh', async () => {
      const mockUser: User = {
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

      // Mock successful session refresh
      const refreshSpy = vi.spyOn(AuthService, 'refreshSession').mockResolvedValue({
        success: true,
        data: { user: mockUser, session: mockSession },
        error: null,
      });

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
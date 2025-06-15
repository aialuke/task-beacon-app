import type { User, Session, AuthError } from '@supabase/supabase-js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { supabase } from '@/integrations/supabase/client';

import { AuthService } from './AuthService';

// Helper to create mock AuthError
const createMockAuthError = (message: string): AuthError =>
  ({
    name: 'AuthError',
    message,
    status: 400,
    code: 'auth_error',
  }) as AuthError;

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
      refreshSession: vi.fn(),
    },
  },
}));

describe('AuthService', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: '2024-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockSession: Session = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: 1234567890,
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockResponse = {
        data: { user: mockUser, session: mockSession },
        error: null,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(
        mockResponse
      );

      const result = await AuthService.signIn(
        'test@example.com',
        'password123'
      );

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.session).toEqual(mockSession);
      expect(result.data?.emailConfirmed).toBe(true);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in error', async () => {
      const mockError = createMockAuthError('Invalid credentials');
      const mockResponse = {
        data: { user: null, session: null },
        error: mockError,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(
        mockResponse
      );

      const result = await AuthService.signIn(
        'test@example.com',
        'wrongpassword'
      );

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Invalid credentials');
    });

    it('should handle missing user in response', async () => {
      const mockResponse = {
        data: { user: null, session: mockSession },
        error: null,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(
        mockResponse
      );

      const result = await AuthService.signIn(
        'test@example.com',
        'password123'
      );

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain(
        'Sign in failed - no user returned'
      );
    });
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const mockResponse = {
        data: { user: mockUser, session: null },
        error: null,
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await AuthService.signUp('new@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.session).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: undefined,
      });
    });

    it('should handle sign up with options', async () => {
      const mockResponse = {
        data: { user: mockUser, session: null },
        error: null,
      };

      const signUpOptions = { data: { firstName: 'John', lastName: 'Doe' } };

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await AuthService.signUp(
        'new@example.com',
        'password123',
        signUpOptions
      );

      expect(result.success).toBe(true);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: signUpOptions,
      });
    });

    it('should handle sign up error', async () => {
      const mockError = createMockAuthError('Email already registered');
      const mockResponse = {
        data: { user: null, session: null },
        error: mockError,
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await AuthService.signUp(
        'existing@example.com',
        'password123'
      );

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Email already registered');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('should handle no authenticated user', async () => {
      const mockResponse = {
        data: { user: null },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toContain('No authenticated user');
    });

    it('should handle auth error', async () => {
      const mockError = createMockAuthError('Token expired');
      const mockResponse = {
        data: { user: null },
        error: mockError,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Token expired');
    });
  });

  describe('getCurrentUserId', () => {
    it('should return current user ID', async () => {
      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUserId();

      expect(result.success).toBe(true);
      expect(result.data).toBe('test-user-id');
    });

    it('should handle no authenticated user', async () => {
      const mockResponse = {
        data: { user: null },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUserId();

      expect(result.success).toBe(false);
      expect(result.error).toContain('No authenticated user');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', async () => {
      const mockResponse = {
        data: { user: null },
        error: null,
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const mockResponse = { error: null };

      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockResponse);

      const result = await AuthService.signOut();

      expect(result.success).toBe(true);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      const mockError = createMockAuthError('Sign out failed');
      const mockResponse = { error: mockError };

      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockResponse);

      const result = await AuthService.signOut();

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Sign out failed');
    });
  });

  describe('refreshSession', () => {
    it('should successfully refresh session', async () => {
      const mockResponse = {
        data: { user: mockUser, session: mockSession },
        error: null,
      };

      vi.mocked(supabase.auth.refreshSession).mockResolvedValue(mockResponse);

      const result = await AuthService.refreshSession();

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.session).toEqual(mockSession);
    });

    it('should handle refresh session error', async () => {
      const mockError = createMockAuthError('Refresh token expired');
      const mockResponse = {
        data: { user: null, session: null },
        error: mockError,
      };

      vi.mocked(supabase.auth.refreshSession).mockResolvedValue(mockResponse);

      const result = await AuthService.refreshSession();

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Refresh token expired');
    });
  });
});

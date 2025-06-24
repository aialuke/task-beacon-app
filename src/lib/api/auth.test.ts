import type { AuthError } from '@supabase/supabase-js';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { supabase } from '@/integrations/supabase/client';

import { signIn, signUp, signOut } from './auth';

// Import the mocked supabase after mocking

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should handle successful sign in', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
      } as any;
      const mockSession = { access_token: 'token' } as any;
      const mockResponse = {
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any;

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(
        mockResponse,
      );

      const result = await signIn('test@example.com', 'password');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: mockUser,
        session: mockSession,
        emailConfirmed: true,
      });
      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should handle sign in errors', async () => {
      const mockError = { message: 'Invalid credentials' } as any;

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      } as any);

      const result = await signIn('test@example.com', 'wrong');

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Invalid credentials',
        name: 'AuthError',
        code: 'AUTH_ERROR',
      });
      expect(result.data).toBeNull();
    });

    it('should handle missing user in response', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      const result = await signIn('test@example.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Sign in failed - no user returned');
      expect(result.data).toBeNull();
    });

    it('should handle unexpected errors', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(
        new Error('Network error'),
      );

      const result = await signIn('test@example.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Network error');
      expect(result.data).toBeNull();
    });
  });

  describe('signUp', () => {
    it('should handle successful sign up', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: null,
      } as any;
      const mockSession = { access_token: 'token' } as any;
      const mockResponse = {
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any;

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await signUp('test@example.com', 'password');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: mockUser,
        session: mockSession,
        emailConfirmed: false,
      });
      expect(result.error).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: undefined,
      });
    });

    it('should handle sign up with options', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: null,
      } as any;
      const mockSession = { access_token: 'token' } as any;
      const mockResponse = {
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any;
      const options = { data: { firstName: 'John' } };

      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await signUp('test@example.com', 'password', options);

      expect(result.success).toBe(true);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options,
      });
    });

    it('should handle sign up errors', async () => {
      const mockError = { message: 'Email already exists' } as any;

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      } as any);

      const result = await signUp('test@example.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Email already exists',
        name: 'AuthError',
        code: 'AUTH_ERROR',
      });
      expect(result.data).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should handle successful sign out', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const mockError = { message: 'Sign out failed' } as any;

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: mockError,
      } as any);

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Sign out failed',
        name: 'AuthError',
        code: 'AUTH_ERROR',
      });
      expect(result.data).toBeNull();
    });

    it('should handle unexpected errors during sign out', async () => {
      vi.mocked(supabase.auth.signOut).mockRejectedValue(
        new Error('Network error'),
      );

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Network error');
      expect(result.data).toBeNull();
    });
  });
});

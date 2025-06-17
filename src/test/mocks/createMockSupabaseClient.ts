/**
 * Mock Supabase Client Factory
 *
 * Standardized factory for creating mock Supabase client objects in tests.
 * Provides consistent, type-safe mock implementations for Supabase operations.
 */

import { vi } from 'vitest';

import type { AuthUser, Session } from '@/types/auth.types';

import { createMockUser, createMockAuthUser } from './createMockUser';

export interface MockSupabaseAuthOptions {
  user?: AuthUser | null;
  session?: Session | null;
  isSignedIn?: boolean;
}

export interface MockSupabaseQueryOptions {
  data?: unknown;
  error?: Error | null;
  count?: number;
}

/**
 * Creates a mock session object
 */
export function createMockSession(user?: AuthUser): Session {
  const mockUser = user || createMockAuthUser();

  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000, // 1 hour from now
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
  };
}

/**
 * Creates a mock Supabase auth client
 */
export function createMockSupabaseAuth(options: MockSupabaseAuthOptions = {}) {
  const mockUser =
    options.user || (options.isSignedIn ? createMockAuthUser() : null);
  const mockSession =
    options.session || (mockUser ? createMockSession(mockUser) : null);

  return {
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),

    getSession: vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null,
    }),

    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }),

    signUp: vi.fn().mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }),

    signOut: vi.fn().mockResolvedValue({
      error: null,
    }),

    refreshSession: vi.fn().mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }),

    onAuthStateChange: vi.fn().mockImplementation(callback => {
      // Simulate initial auth state
      if (mockSession) {
        callback('SIGNED_IN', mockSession);
      } else {
        callback('SIGNED_OUT', null);
      }

      return {
        data: {
          subscription: {
            id: 'mock-subscription-id',
            callback,
            unsubscribe: vi.fn(),
          },
        },
      };
    }),
  };
}

/**
 * Creates a mock Supabase query builder
 */
export function createMockSupabaseQuery(
  options: MockSupabaseQueryOptions = {}
) {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    abortSignal: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),
    geojson: vi.fn().mockReturnThis(),
    explain: vi.fn().mockReturnThis(),
    rollback: vi.fn().mockReturnThis(),
    returns: vi.fn().mockReturnThis(),
  };

  // Add promise-like behavior to the query
  const executeQuery = () =>
    Promise.resolve({
      data: options.data || [],
      error: options.error || null,
      count: options.count || null,
      status: 200,
      statusText: 'OK',
    });

  // Make the query thenable
  Object.assign(mockQuery, {
    then: (
      onFulfilled?: (value: unknown) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => executeQuery().then(onFulfilled, onRejected),
    catch: (onRejected?: (reason: unknown) => unknown) =>
      executeQuery().catch(onRejected),
    finally: (onFinally?: () => void) => executeQuery().finally(onFinally),
  });

  return mockQuery;
}

/**
 * Creates a complete mock Supabase client
 */
export function createMockSupabaseClient(
  authOptions: MockSupabaseAuthOptions = {}
) {
  const mockAuth = createMockSupabaseAuth(authOptions);

  return {
    auth: mockAuth,

    from: vi.fn().mockImplementation(() => createMockSupabaseQuery()),

    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'mock-file-path' },
          error: null,
        }),
        download: vi.fn().mockResolvedValue({
          data: new Blob(['mock file content']),
          error: null,
        }),
        remove: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://mock-storage-url.com/file' },
        }),
      }),
    },

    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { result: 'mock-function-result' },
        error: null,
      }),
    },

    realtime: {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        unsubscribe: vi.fn().mockReturnThis(),
      }),
    },
  };
}

/**
 * Creates a mock Supabase client with specific query responses
 */
export function createMockSupabaseClientWithData(
  tableResponses: Record<string, MockSupabaseQueryOptions> = {}
) {
  const client = createMockSupabaseClient();

  // Override the from method to return table-specific responses
  client.from = vi.fn().mockImplementation((tableName: string) => {
    const tableOptions = tableResponses[tableName] || {};
    return createMockSupabaseQuery(tableOptions);
  });

  return client;
}

/**
 * Helper to create mock error responses
 */
export function createMockSupabaseError(message: string, code = 'MOCK_ERROR') {
  return {
    message,
    code,
    details: null,
    hint: null,
  };
}

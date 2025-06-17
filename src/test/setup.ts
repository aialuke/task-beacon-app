import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => {
  const mockSupabase = {
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    insert: vi.fn(() => mockSupabase),
    update: vi.fn(() => mockSupabase),
    delete: vi.fn(() => mockSupabase),
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({ data: { user: {}, session: {} }, error: null })
      ),
      signUp: vi.fn(() =>
        Promise.resolve({ data: { user: {}, session: {} }, error: null })
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getSession: vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      ),
      refreshSession: vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    // Add other methods as needed, chaining them to return the mock
    eq: vi.fn(() => mockSupabase),
    order: vi.fn(() => mockSupabase),
    range: vi.fn(() => mockSupabase),
    single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    rpc: vi.fn(() => Promise.resolve({ data: {}, error: null })),
  };

  // Ensure all chained methods return a promise for data fetching
  (mockSupabase.from as any).mockImplementation(() => ({
    ...mockSupabase,
    select: vi.fn().mockReturnThis(),
    insert: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
    update: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
    delete: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
  }));

  return { supabase: mockSupabase };
});

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: (_event: Event) => false,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: readonly number[] = [];
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}
global.ResizeObserver = MockResizeObserver;

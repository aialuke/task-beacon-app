
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import type { Task } from '@/types';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useTaskOptimisticUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    photo_url: null,
    url_link: null,
    due_date: null,
    owner_id: 'user-1',
    assignee_id: null,
    parent_task_id: null,
    parent_task: null,
    pinned: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('should provide optimistic update functions', () => {
    const { result } = renderHook(() => useTaskOptimisticUpdates(), {
      wrapper: createWrapper(),
    });

    expect(result.current.updateTaskOptimistically).toBeDefined();
    expect(result.current.removeTaskOptimistically).toBeDefined();
    expect(result.current.getPreviousData).toBeDefined();
    expect(result.current.rollbackToData).toBeDefined();
    expect(typeof result.current.updateTaskOptimistically).toBe('function');
    expect(typeof result.current.removeTaskOptimistically).toBe('function');
    expect(typeof result.current.getPreviousData).toBe('function');
    expect(typeof result.current.rollbackToData).toBe('function');
  });

  it('should handle optimistic updates correctly', () => {
    const { result } = renderHook(() => useTaskOptimisticUpdates(), {
      wrapper: createWrapper(),
    });

    // Test that functions can be called without throwing
    expect(() => {
      result.current.updateTaskOptimistically(mockTask.id, { status: 'complete' });
    }).not.toThrow();

    expect(() => {
      result.current.removeTaskOptimistically(mockTask.id);
    }).not.toThrow();

    expect(() => {
      result.current.rollbackToData(null);
    }).not.toThrow();
  });
});


import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTaskStatusMutations } from '../useTaskStatusMutations';
import type { Task } from '@/types';

// Mock the task service
vi.mock('@/lib/api/tasks/task.service', () => ({
  TaskService: {
    updateStatus: vi.fn().mockResolvedValue({
      success: true,
      data: { status: 'complete' },
      error: null,
    }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTaskStatusMutations', () => {
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

  it('should provide status mutation functions', () => {
    const { result } = renderHook(() => useTaskStatusMutations(), {
      wrapper: createWrapper(),
    });

    expect(result.current.toggleTaskComplete).toBeDefined();
    expect(result.current.toggleTaskPin).toBeDefined();
    expect(typeof result.current.toggleTaskComplete).toBe('function');
    expect(typeof result.current.toggleTaskPin).toBe('function');
  });

  it('should handle loading states correctly', () => {
    const { result } = renderHook(() => useTaskStatusMutations(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});

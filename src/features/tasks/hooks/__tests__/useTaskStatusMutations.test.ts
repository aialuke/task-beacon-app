
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskStatusMutations } from '../useTaskStatusMutations';
import { renderWithProviders } from '@/lib/testing/context-helpers';
import type { Task } from '@/types';

// Mock the task service
vi.mock('@/lib/api/tasks/task.service', () => ({
  TaskService: {
    updateStatus: vi.fn().mockResolvedValue({
      success: true,
      data: { status: 'complete' },
      error: null,
    }),
    update: vi.fn().mockResolvedValue({
      success: true,
      data: { status: 'complete' },
      error: null,
    }),
  },
}));

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
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('should provide status mutation functions', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const { container } = renderWithProviders(<div>{children}</div>, {});
      return container.firstChild as React.ReactElement;
    };

    const { result } = renderHook(() => useTaskStatusMutations(), {
      wrapper: TestWrapper,
    });

    expect(result.current.markAsComplete).toBeDefined();
    expect(result.current.markAsIncomplete).toBeDefined();
    expect(result.current.togglePin).toBeDefined();
    expect(typeof result.current.markAsComplete).toBe('function');
    expect(typeof result.current.markAsIncomplete).toBe('function');
    expect(typeof result.current.togglePin).toBe('function');
  });

  it('should handle loading states correctly', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const { container } = renderWithProviders(<div>{children}</div>, {});
      return container.firstChild as React.ReactElement;
    };

    const { result } = renderHook(() => useTaskStatusMutations(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});

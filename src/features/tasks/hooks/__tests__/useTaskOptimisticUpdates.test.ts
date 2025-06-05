
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskOptimisticUpdates } from '../useTaskOptimisticUpdates';
import { renderWithProviders } from '@/lib/testing/context-helpers';
import type { Task } from '@/types';

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
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  it('should provide optimistic update functions', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const { container } = renderWithProviders(<div>{children}</div>, {});
      return container.firstChild as React.ReactElement;
    };

    const { result } = renderHook(() => useTaskOptimisticUpdates(), {
      wrapper: TestWrapper,
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
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const { container } = renderWithProviders(<div>{children}</div>, {});
      return container.firstChild as React.ReactElement;
    };

    const { result } = renderHook(() => useTaskOptimisticUpdates(), {
      wrapper: TestWrapper,
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

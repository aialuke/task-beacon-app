
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskSubmission } from './useTaskSubmission';
import { TaskService } from '@/lib/api';
import type { CreateTaskData } from '@/features/tasks/types';

// Mock the TaskService
vi.mock('@/lib/api', () => ({
  TaskService: {
    crud: {
      create: vi.fn(),
    },
  },
}));

// Mock the toast
vi.mock('@/lib/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useTaskSubmission', () => {
  const mockTaskData: CreateTaskData = {
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2024-12-31',
    assignee_id: 'user-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit a task', async () => {
    const mockCreatedTask = {
      id: 'task-123',
      ...mockTaskData,
      owner_id: 'owner-123',
      status: 'pending' as const,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: true,
      data: mockCreatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    await act(async () => {
      const success = await result.current.submitTask(mockTaskData);
      expect(success).toBe(true);
    });

    expect(TaskService.crud.create).toHaveBeenCalledWith(mockTaskData);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle submission errors', async () => {
    const errorMessage = 'Failed to create task';
    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: false,
      data: null,
      error: errorMessage,
    });

    const { result } = renderHook(() => useTaskSubmission());

    await act(async () => {
      const success = await result.current.submitTask(mockTaskData);
      expect(success).toBe(false);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    vi.mocked(TaskService.crud.create).mockRejectedValue(networkError);

    const { result } = renderHook(() => useTaskSubmission());

    await act(async () => {
      const success = await result.current.submitTask(mockTaskData);
      expect(success).toBe(false);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should track submission state correctly', async () => {
    vi.mocked(TaskService.crud.create).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: { id: 'task-123', ...mockTaskData } as any,
        error: null,
      }), 100))
    );

    const { result } = renderHook(() => useTaskSubmission());

    expect(result.current.isSubmitting).toBe(false);

    const submitPromise = act(async () => {
      result.current.submitTask(mockTaskData);
    });

    expect(result.current.isSubmitting).toBe(true);

    await submitPromise;

    expect(result.current.isSubmitting).toBe(false);
  });
});

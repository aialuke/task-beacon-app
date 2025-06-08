
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskMutations } from '../useTaskMutations';
import { TaskService } from '@/lib/api/tasks/task.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the TaskService
vi.mock('@/lib/api/tasks/task.service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTaskMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create task successfully', async () => {
    const mockTaskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'medium' as const,
    };

    const mockCreatedTask = {
      id: '1',
      ...mockTaskData,
      status: 'pending' as const,
    };

    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: true,
      data: mockCreatedTask,
      error: null,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    const createResult = await result.current.createTaskCallback(mockTaskData);

    expect(createResult.success).toBe(true);
    expect(createResult.data).toEqual(mockCreatedTask);
    expect(TaskService.crud.create).toHaveBeenCalledWith(mockTaskData);
  });

  it('should handle create task failure', async () => {
    const mockTaskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'medium' as const,
    };

    const mockError = new Error('Failed to create task');

    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: false,
      data: null,
      error: mockError,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    const createResult = await result.current.createTaskCallback(mockTaskData);

    expect(createResult.success).toBe(false);
    expect(createResult.error).toEqual(mockError);
  });
});

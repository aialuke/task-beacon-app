import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TaskService } from '@/lib/api/tasks';
import type { TaskWithRelations } from '@/types';

import { useTaskSubmission } from './useTaskSubmission';

// Mock the TaskService
vi.mock('@/lib/api/tasks', () => ({
  TaskService: {
    crud: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the standardized-api
vi.mock('@/lib/api/standardized-api', () => ({
  QueryKeys: {
    tasks: ['tasks'],
    task: (id: string) => ['tasks', id],
  },
}));

// Mock the query client and mutations
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
  }),
  useMutation: vi.fn((_config) => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

// Mock optimistic updates
vi.mock('./useTaskOptimisticUpdates', () => ({
  useTaskOptimisticUpdates: () => ({
    updateTaskOptimistically: vi.fn(),
    removeTaskOptimistically: vi.fn(),
    rollbackToData: vi.fn(),
    getPreviousData: vi.fn(),
  }),
}));

// Mock navigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

interface SubmitTaskData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

describe('useTaskSubmission', () => {
  const mockTaskData: SubmitTaskData = {
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-12-31',
    url: '',
    pinned: false,
    assigneeId: 'user-123',
  };

  const mockCreatedTask: TaskWithRelations = {
    id: 'task-123',
    title: mockTaskData.title,
    description: mockTaskData.description,
    owner_id: 'owner-123',
    assignee_id: 'user-123',
    status: 'pending' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    due_date: null,
    parent_task_id: null,
    photo_url: null,
    url_link: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a task', async () => {
    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: true,
      data: mockCreatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask({
        title: mockTaskData.title,
        description: mockTaskData.description,
        due_date: mockTaskData.dueDate,
        assignee_id: mockTaskData.assigneeId,
      });
    });

    expect(submissionResult).toEqual({
      success: true,
      message: 'Task created successfully!',
      task: mockCreatedTask,
    });
  });

  it('should handle creation errors', async () => {
    const errorMessage = 'Failed to create task';
    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: false,
      data: null,
      error: { message: errorMessage },
    });

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask({
        title: mockTaskData.title,
        description: mockTaskData.description,
      });
    });

    expect(submissionResult).toEqual({
      success: false,
      error: errorMessage,
      message: 'Failed to create task',
    });
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    vi.mocked(TaskService.crud.create).mockRejectedValue(networkError);

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask({
        title: mockTaskData.title,
      });
    });

    expect(submissionResult).toEqual({
      success: false,
      error: 'Network error',
      message: 'Failed to create task',
    });
  });

  it('should successfully update a task', async () => {
    const taskId = 'task-123';
    const updates = { title: 'Updated Task' };

    const mockUpdatedTask: TaskWithRelations = {
      ...mockCreatedTask,
      id: taskId,
      title: 'Updated Task',
    };

    vi.mocked(TaskService.crud.update).mockResolvedValue({
      success: true,
      data: mockUpdatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTask(taskId, {
        id: taskId,
        title: updates.title,
      });
    });

    expect(updateResult).toEqual({
      success: true,
      message: 'Task updated successfully!',
      task: mockUpdatedTask,
    });
    expect(TaskService.crud.update).toHaveBeenCalledWith(taskId, {
      id: taskId,
      title: updates.title,
    });
  });

  it('should successfully delete a task', async () => {
    const taskId = 'task-123';

    vi.mocked(TaskService.crud.delete).mockResolvedValue({
      success: true,
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteTask(taskId);
    });

    expect(deleteResult).toEqual({
      success: true,
      message: 'Task deleted successfully!',
    });
    expect(TaskService.crud.delete).toHaveBeenCalledWith(taskId);
  });
});

import { renderHook, act } from '@testing-library/react';
import { AllTheProviders } from '@/test/test-utils.tsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as TaskApi from '@/lib/api/tasks';
import type { TaskWithRelations } from '@/types';
import type { TaskPriority } from '@/types/feature-types/task.types';

import { useTaskSubmission } from './useTaskSubmission';

// Mock the Task API
vi.mock('@/lib/api/tasks');

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the query client
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
      cancelQueries: vi.fn(),
      getQueryData: vi.fn(),
      setQueryData: vi.fn(),
    }),
  };
});

// Mock the validation hook
vi.mock('./useTaskFormValidation', () => ({
  useTaskFormValidation: () => ({
    validateCreateTask: vi.fn(() => ({
      isValid: true,
      errors: [],
    })),
    showValidationErrors: vi.fn(),
  }),
}));

// Mock the auth service
vi.mock('@/lib/api/base', () => ({
  AuthService: {
    getCurrentUserId: vi.fn(),
  },
}));

interface SubmitTaskData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  photoUrl?: string | null;
  priority?: TaskPriority;
}

interface TaskUpdateData {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  url?: string;
  assigneeId?: string;
  priority?: TaskPriority;
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully create a task', async () => {
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

    vi.mocked(TaskApi.TaskService.crud.create).mockResolvedValue({
      success: true,
      data: mockCreatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission(), { wrapper: AllTheProviders });

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: true,
      message: 'Task created successfully!',
      task: expect.objectContaining({
        id: 'task-123',
        title: mockTaskData.title,
        description: mockTaskData.description,
        assignee_id: 'user-123',
      }),
    });
    expect(TaskApi.TaskService.crud.create).toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    const errorMessage = 'Failed to create task';
    vi.mocked(TaskApi.TaskService.crud.create).mockResolvedValue({
      success: false,
      data: null,
      error: { message: errorMessage, name: 'TaskError' },
    });

    const { result } = renderHook(() => useTaskSubmission(), { wrapper: AllTheProviders });

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: false,
      message: 'Failed to create task',
      error: errorMessage,
    });
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    vi.mocked(TaskApi.TaskService.crud.create).mockRejectedValue(networkError);

    const { result } = renderHook(() => useTaskSubmission(), { wrapper: AllTheProviders });

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.createTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: false,
      message: 'Failed to create task',
      error: 'Network error',
    });
  });

  it('should successfully update a task', async () => {
    const taskUpdateData: TaskUpdateData = {
      id: 'task-123',
      title: 'Updated Task',
      priority: 'high' as TaskPriority,
    };

    const mockUpdatedTask: TaskWithRelations = {
      id: 'task-123',
      title: 'Updated Task',
      description: 'Test Description',
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

    vi.mocked(TaskApi.TaskService.crud.update).mockResolvedValue({
      success: true,
      data: mockUpdatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission(), { wrapper: AllTheProviders });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTask(
        'task-123',
        taskUpdateData
      );
    });

    expect(updateResult).toEqual({
      success: true,
      message: 'Task updated successfully!',
      task: expect.objectContaining({
        id: 'task-123',
        title: 'Updated Task',
        assignee_id: 'user-123',
      }),
    });
    expect(TaskApi.TaskService.crud.update).toHaveBeenCalledWith(
      'task-123',
      expect.objectContaining({
        title: taskUpdateData.title,
        priority: taskUpdateData.priority,
      })
    );
  });
});

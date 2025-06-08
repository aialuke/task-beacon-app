
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskSubmission } from './useTaskSubmission';
import { TaskService } from '@/lib/api';
import type { TaskWithRelations } from '@/types';

// Mock the TaskService
vi.mock('@/lib/api', () => ({
  TaskService: {
    crud: {
      create: vi.fn(),
      update: vi.fn(),
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

// Mock the query client
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit a task', async () => {
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

    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: true,
      data: mockCreatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: true,
      taskId: 'task-123',
    });
    expect(TaskService.crud.create).toHaveBeenCalled();
  });

  it('should handle submission errors', async () => {
    const errorMessage = 'Failed to create task';
    vi.mocked(TaskService.crud.create).mockResolvedValue({
      success: false,
      data: null,
      error: { message: errorMessage, name: 'TaskError' },
    });

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: false,
      error: errorMessage,
    });
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    vi.mocked(TaskService.crud.create).mockRejectedValue(networkError);

    const { result } = renderHook(() => useTaskSubmission());

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submitTask(mockTaskData);
    });

    expect(submissionResult).toEqual({
      success: false,
      error: 'Network error',
    });
  });

  it('should successfully update a task', async () => {
    const taskId = 'task-123';
    const updates = { title: 'Updated Task' };

    const mockUpdatedTask: TaskWithRelations = {
      id: taskId,
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

    vi.mocked(TaskService.crud.update).mockResolvedValue({
      success: true,
      data: mockUpdatedTask,
      error: null,
    });

    const { result } = renderHook(() => useTaskSubmission());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTask(taskId, updates);
    });

    expect(updateResult).toEqual({
      success: true,
      taskId,
    });
    expect(TaskService.crud.update).toHaveBeenCalledWith(taskId, expect.objectContaining(updates));
  });
});
// CodeRabbit review

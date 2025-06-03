import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTaskSubmission } from './useTaskSubmission';
import { TaskService } from '@/lib/api/tasks/task.service';
import { AuthService } from '@/lib/api/base';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/lib/api/tasks/task.service');
vi.mock('@/lib/api/base');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const wrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
    
  return wrapper;
};

describe('useTaskSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitTask', () => {
    it('successfully submits a new task', async () => {
      const mockTaskId = 'task-123';
      const mockUserId = 'user-123';
      
      vi.mocked(AuthService.getCurrentUserId).mockResolvedValue({
        success: true,
        data: mockUserId,
        error: null,
      });
      
      vi.mocked(TaskService.create).mockResolvedValue({
        success: true,
        data: { id: mockTaskId } as any,
        error: null,
      });

      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31',
        url: 'https://example.com',
        pinned: false,
        assigneeId: '',
      };

      const response = await result.current.submitTask(taskData);

      expect(response.success).toBe(true);
      expect(response.taskId).toBe(mockTaskId);
      expect(toast.success).toHaveBeenCalledWith('Task created successfully');
      
      // Verify service was called with correct data
      expect(TaskService.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31T00:00:00.000Z',
        photoUrl: undefined,
        urlLink: 'https://example.com',
        assigneeId: mockUserId,
        pinned: false,
      });
    });

    it('handles validation errors', async () => {
      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const invalidTaskData = {
        title: '', // Invalid: empty title
        description: 'Test',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
      };

      const response = await result.current.submitTask(invalidTaskData);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Validation failed');
      expect(TaskService.create).not.toHaveBeenCalled();
    });

    it('handles API errors', async () => {
      vi.mocked(AuthService.getCurrentUserId).mockResolvedValue({
        success: true,
        data: 'user-123',
        error: null,
      });
      
      vi.mocked(TaskService.create).mockResolvedValue({
        success: false,
        data: null,
        error: { 
          message: 'Network error', 
          code: 'NETWORK_ERROR',
          name: 'NetworkError'
        },
      });

      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const taskData = {
        title: 'Test Task',
        description: '',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: 'user-123',
      };

      const response = await result.current.submitTask(taskData);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Network error');
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });

    it('handles missing current user', async () => {
      vi.mocked(AuthService.getCurrentUserId).mockResolvedValue({
        success: false,
        data: null,
        error: { 
          message: 'Not authenticated', 
          code: 'AUTH_ERROR',
          name: 'AuthError'
        },
      });

      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const taskData = {
        title: 'Test Task',
        description: '',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '', // No assignee, should get current user
      };

      const response = await result.current.submitTask(taskData);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to get current user');
      expect(TaskService.create).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('successfully updates an existing task', async () => {
      const taskId = 'task-123';
      
      vi.mocked(TaskService.update).mockResolvedValue({
        success: true,
        data: { id: taskId } as any,
        error: null,
      });

      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const updates = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const response = await result.current.updateTask(taskId, updates);

      expect(response.success).toBe(true);
      expect(response.taskId).toBe(taskId);
      expect(toast.success).toHaveBeenCalledWith('Task updated successfully');
      
      expect(TaskService.update).toHaveBeenCalledWith(taskId, {
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: undefined,
        photoUrl: undefined,
        urlLink: undefined,
        pinned: undefined,
        assigneeId: undefined,
      });
    });

    it('handles update errors', async () => {
      const taskId = 'task-123';
      
      vi.mocked(TaskService.update).mockResolvedValue({
        success: false,
        data: null,
        error: { 
          message: 'Update failed', 
          code: 'UPDATE_ERROR',
          name: 'UpdateError'
        },
      });

      const { result } = renderHook(() => useTaskSubmission(), {
        wrapper: createWrapper(),
      });

      const updates = {
        title: 'Updated Task',
      };

      const response = await result.current.updateTask(taskId, updates);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Update failed');
      expect(toast.error).toHaveBeenCalledWith('Update failed');
    });
  });
}); 
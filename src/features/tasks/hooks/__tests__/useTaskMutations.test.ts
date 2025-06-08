
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskMutations } from '../useTaskMutations';
import { TaskService } from '@/lib/api/tasks/task.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the TaskService
vi.mock('@/lib/api/tasks/task.service', () => ({
  TaskService: {
    crud: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    status: {
      updateStatus: vi.fn(),
    },
  },
}));

// Mock validation schemas
vi.mock('@/schemas', () => ({
  validateTaskCreation: vi.fn(),
  validateTaskUpdate: vi.fn(),
}));

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

describe('useTaskMutations Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Task Creation', () => {
    it('should provide createTask functionality', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      expect(result.current).toHaveProperty('createTask');
      expect(result.current).toHaveProperty('createTaskCallback');
      expect(typeof result.current.createTask).toBe('object');
      expect(typeof result.current.createTaskCallback).toBe('function');
    });

    it('should handle task creation with proper data', async () => {
      const mockTaskData = {
        title: 'Test Task',
        description: 'Test Description',
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
  });

  describe('Task Updates', () => {
    it('should provide updateTask functionality', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      expect(result.current).toHaveProperty('updateTask');
      expect(result.current).toHaveProperty('updateTaskCallback');
      expect(typeof result.current.updateTask).toBe('object');
      expect(typeof result.current.updateTaskCallback).toBe('function');
    });

    it('should handle task updates correctly', async () => {
      const mockUpdates = { title: 'Updated Task' };
      const mockUpdatedTask = {
        id: '1',
        title: 'Updated Task',
        status: 'pending' as const,
      };

      vi.mocked(TaskService.crud.update).mockResolvedValue({
        success: true,
        data: mockUpdatedTask,
        error: null,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      const updateResult = await result.current.updateTaskCallback('1', mockUpdates);

      expect(updateResult.success).toBe(true);
      expect(updateResult.data).toEqual(mockUpdatedTask);
      expect(TaskService.crud.update).toHaveBeenCalledWith('1', mockUpdates);
    });
  });

  describe('Task Deletion', () => {
    it('should provide deleteTask functionality', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      expect(result.current).toHaveProperty('deleteTask');
      expect(result.current).toHaveProperty('deleteTaskCallback');
      expect(typeof result.current.deleteTask).toBe('object');
      expect(typeof result.current.deleteTaskCallback).toBe('function');
    });

    it('should handle task deletion correctly', async () => {
      vi.mocked(TaskService.crud.delete).mockResolvedValue({
        success: true,
        data: null,
        error: null,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      const deleteResult = await result.current.deleteTaskCallback('1');

      expect(deleteResult.success).toBe(true);
      expect(TaskService.crud.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Task Status Operations', () => {
    it('should provide status toggle functionality', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      expect(result.current).toHaveProperty('toggleTaskComplete');
      expect(result.current).toHaveProperty('toggleTaskCompleteCallback');
      expect(result.current).toHaveProperty('markAsComplete');
      expect(result.current).toHaveProperty('markAsIncomplete');
    });

    it('should handle task status toggle correctly', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        status: 'pending' as const,
      };

      const mockUpdatedTask = {
        ...mockTask,
        status: 'complete' as const,
      };

      vi.mocked(TaskService.status.updateStatus).mockResolvedValue({
        success: true,
        data: mockUpdatedTask,
        error: null,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      const toggleResult = await result.current.toggleTaskCompleteCallback(mockTask);

      expect(toggleResult.success).toBe(true);
      expect(TaskService.status.updateStatus).toHaveBeenCalledWith('1', 'complete');
    });
  });

  describe('Loading States', () => {
    it('should properly track loading states', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      expect(result.current).toHaveProperty('isLoading');
      expect(typeof result.current.isLoading).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      vi.mocked(TaskService.crud.create).mockResolvedValue({
        success: false,
        data: null,
        error: mockError,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      const createResult = await result.current.createTaskCallback({
        title: 'Test Task',
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toEqual(mockError);
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility for legacy usage patterns', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      // Check that all expected methods are available
      expect(result.current).toHaveProperty('createTask');
      expect(result.current).toHaveProperty('updateTask');
      expect(result.current).toHaveProperty('deleteTask');
      expect(result.current).toHaveProperty('toggleTaskComplete');
      expect(result.current).toHaveProperty('markAsComplete');
      expect(result.current).toHaveProperty('markAsIncomplete');
      expect(result.current).toHaveProperty('isLoading');
    });
  });
});

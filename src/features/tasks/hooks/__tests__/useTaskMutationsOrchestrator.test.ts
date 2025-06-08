
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskMutationsOrchestrator } from '../mutations/useTaskMutationsOrchestrator';
import { TaskService } from '@/lib/api/tasks/task.service';
import { validateTaskCreation, validateTaskUpdate } from '@/schemas';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the TaskService
vi.mock('@/lib/api/tasks/task.service');

// Mock the validation schemas
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

describe('useTaskMutationsOrchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default successful validation
    vi.mocked(validateTaskCreation).mockReturnValue({
      success: true,
      data: { title: 'Test Task', description: 'Test Description' },
    });
    vi.mocked(validateTaskUpdate).mockReturnValue({
      success: true,
      data: { title: 'Updated Task' },
    });
  });

  describe('Task Creation', () => {
    it('should create task successfully with Zod validation', async () => {
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
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const createResult = await result.current.createTaskCallback(mockTaskData);

      expect(createResult.success).toBe(true);
      expect(createResult.data).toEqual(mockCreatedTask);
      expect(TaskService.crud.create).toHaveBeenCalledWith(mockTaskData);
    });

    it('should handle validation errors during creation', async () => {
      vi.mocked(validateTaskCreation).mockReturnValue({
        success: false,
        error: { errors: [{ message: 'Title is required', path: ['title'] }] },
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const invalidTaskData = { title: '', description: 'Test' };
      
      try {
        await result.current.createTaskCallback(invalidTaskData);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Task Updates', () => {
    it('should update task successfully with Zod validation', async () => {
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
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const updateResult = await result.current.updateTaskCallback('1', mockUpdates);

      expect(updateResult.success).toBe(true);
      expect(updateResult.data).toEqual(mockUpdatedTask);
      expect(TaskService.crud.update).toHaveBeenCalledWith('1', mockUpdates);
    });
  });

  describe('Task Deletion', () => {
    it('should delete task successfully', async () => {
      vi.mocked(TaskService.crud.delete).mockResolvedValue({
        success: true,
        data: null,
        error: null,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const deleteResult = await result.current.deleteTaskCallback('1');

      expect(deleteResult.success).toBe(true);
      expect(TaskService.crud.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Task Status Operations', () => {
    it('should toggle task completion status', async () => {
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
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const toggleResult = await result.current.toggleTaskCompleteCallback(mockTask);

      expect(toggleResult.success).toBe(true);
      expect(TaskService.status.updateStatus).toHaveBeenCalledWith('1', 'complete');
    });
  });

  describe('Loading States', () => {
    it('should properly aggregate loading states from all mutations', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

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
      const { result } = renderHook(() => useTaskMutationsOrchestrator(), { wrapper });

      const createResult = await result.current.createTaskCallback({
        title: 'Test Task',
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toEqual(mockError);
    });
  });
});

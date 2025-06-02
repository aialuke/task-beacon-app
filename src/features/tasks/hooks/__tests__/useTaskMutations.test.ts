import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useTaskMutations,
  useTaskStatusMutations,
  useTaskPinMutations,
  useTaskDeleteMutations 
} from '../useTaskMutations';
import { TaskService } from '@/lib/api/tasks.service';
import { handleApiError } from '@/lib/utils/error';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// Mock the API functions
vi.mock('@/lib/api/tasks.service');
vi.mock('@/lib/utils/error');

// Mock data
const mockTask: Task = {
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending' as TaskStatus,
  priority: 'medium' as TaskPriority,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  due_date: '2024-12-31T23:59:59Z',
  pinned: false,
  owner_id: 'test-user-id',
  assignee_id: null,
  parent_task_id: null,
  parent_task: null,
  url_link: null,
  photo_url: null,
};

describe('Task Mutation Hooks', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Create wrapper with QueryClient using createElement
    wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);
  });

  describe('useTaskStatusMutations', () => {
    it('should successfully toggle task completion', async () => {
      // Mock successful API response
      vi.mocked(TaskService.updateStatus).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskComplete(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task marked complete',
        status: 'complete',
        task: { ...mockTask, status: 'complete' },
      });

      expect(TaskService.updateStatus).toHaveBeenCalledWith(mockTask.id, 'complete');
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it('should handle API errors correctly', async () => {
      vi.mocked(TaskService.updateStatus).mockResolvedValue({
        data: null,
        error: { message: 'Failed to update task status', name: 'Error' },
        success: false,
      });

      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskComplete(mockTask);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: 'Failed to update task status',
        message: 'Failed to update task: Failed to update task status',
        status: 'pending',
        task: mockTask,
      });

      expect(handleApiError).toHaveBeenCalled();
    });

    it('should not toggle if task is already in target state', async () => {
      const completedTask = { ...mockTask, status: 'complete' as TaskStatus };

      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.markTaskComplete(completedTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task is already complete',
        status: 'complete',
        task: completedTask,
      });

      expect(TaskService.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('useTaskPinMutations', () => {
    it('should successfully toggle task pin status', async () => {
      vi.mocked(TaskService.togglePin).mockResolvedValue({
        data: { ...mockTask, pinned: true },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskPinMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskPin(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task pinned',
        pinned: true,
        task: { ...mockTask, pinned: true },
      });

      expect(TaskService.togglePin).toHaveBeenCalledWith(mockTask.id, true);
    });

    it('should handle errors when toggling pin status', async () => {
      vi.mocked(TaskService.togglePin).mockResolvedValue({
        data: null,
        error: { message: 'Failed to toggle pin', name: 'Error' },
        success: false,
      });

      const { result } = renderHook(() => useTaskPinMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskPin(mockTask);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: 'Failed to toggle pin',
        message: 'Failed to pin task: Failed to toggle pin',
        pinned: false,
        task: mockTask,
      });
    });
  });

  describe('useTaskDeleteMutations', () => {
    it('should successfully delete a task', async () => {
      vi.mocked(TaskService.delete).mockResolvedValue({
        data: undefined,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.deleteTask(mockTask.id);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task deleted successfully',
        taskId: mockTask.id,
      });

      expect(TaskService.delete).toHaveBeenCalledWith(mockTask.id);
    });

    it('should handle errors when deleting task', async () => {
      vi.mocked(TaskService.delete).mockResolvedValue({
        data: null,
        error: { message: 'Failed to delete task', name: 'Error' },
        success: false,
      });

      const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.deleteTask(mockTask.id);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: 'Failed to delete task',
        message: 'Failed to delete task: Failed to delete task',
        taskId: mockTask.id,
      });
    });

    it('should delete multiple tasks', async () => {
      const taskIds = ['task-1', 'task-2', 'task-3'];
      
      vi.mocked(TaskService.delete).mockImplementation((taskId) =>
        Promise.resolve({
          data: undefined,
          error: null,
          success: true,
        })
      );

      const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

      let mutationResults;
      await act(async () => {
        mutationResults = await result.current.deleteMultipleTasks(taskIds);
      });

      expect(mutationResults).toHaveLength(3);
      expect(mutationResults.every(result => result.success)).toBe(true);
      expect(TaskService.delete).toHaveBeenCalledTimes(3);
    });
  });

  describe('useTaskMutations (Composed Hook)', () => {
    it('should provide all mutation functions', () => {
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      // Status mutations
      expect(result.current.toggleTaskComplete).toBeDefined();
      expect(result.current.markTaskComplete).toBeDefined();
      expect(result.current.markTaskPending).toBeDefined();

      // Pin mutations
      expect(result.current.toggleTaskPin).toBeDefined();
      expect(result.current.pinTask).toBeDefined();
      expect(result.current.unpinTask).toBeDefined();

      // Delete mutations
      expect(result.current.deleteTask).toBeDefined();
      expect(result.current.deleteMultipleTasks).toBeDefined();

      // Optimistic updates
      expect(result.current.updateTaskOptimistically).toBeDefined();
    });

    it('should maintain backward compatibility', async () => {
      vi.mocked(TaskService.updateStatus).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskComplete(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task marked complete',
        status: 'complete',
        task: { ...mockTask, status: 'complete' },
      });
    });
  });
}); 
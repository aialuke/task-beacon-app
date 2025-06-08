
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useTaskMutations,
  useTaskStatusMutations,
  useTaskDeleteMutations 
} from '../useTaskMutations';
import { TaskService } from '@/lib/api/tasks/task.service';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// Mock the API functions
vi.mock('@/lib/api/tasks/task.service');

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
    it('should provide status mutation functions', () => {
      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      expect(result.current.markAsComplete).toBeDefined();
      expect(result.current.markAsIncomplete).toBeDefined();
      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should call markAsComplete correctly', () => {
      vi.mocked(TaskService.status.updateStatus).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      act(() => {
        result.current.markAsComplete(mockTask.id);
      });

      expect(TaskService.status.updateStatus).toHaveBeenCalledWith(mockTask.id, 'complete');
    });

    it('should call markAsIncomplete correctly', () => {
      vi.mocked(TaskService.status.updateStatus).mockResolvedValue({
        data: { ...mockTask, status: 'pending' },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

      act(() => {
        result.current.markAsIncomplete(mockTask.id);
      });

      expect(TaskService.status.updateStatus).toHaveBeenCalledWith(mockTask.id, 'pending');
    });
  });

  describe('useTaskDeleteMutations', () => {
    it('should provide delete mutation functions', () => {
      const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

      expect(result.current.deleteTask).toBeDefined();
      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should call deleteTask correctly', () => {
      vi.mocked(TaskService.crud.delete).mockResolvedValue({
        data: undefined,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

      act(() => {
        result.current.deleteTask(mockTask.id);
      });

      expect(TaskService.crud.delete).toHaveBeenCalledWith(mockTask.id);
    });
  });

  describe('useTaskMutations (Composed Hook)', () => {
    it('should provide all mutation functions', () => {
      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      // Status mutations
      expect(result.current.markAsComplete).toBeDefined();
      expect(result.current.markAsIncomplete).toBeDefined();

      // Delete mutations
      expect(result.current.deleteTaskCallback).toBeDefined();

      // Follow-up task creation
      expect(result.current.createFollowUpTask).toBeDefined();

      // Optimistic updates
      expect(result.current.updateTaskOptimistically).toBeDefined();

      // Backward compatibility methods
      expect(result.current.toggleTaskCompleteCallback).toBeDefined();
      expect(result.current.deleteTaskCallback).toBeDefined();
    });

    it('should maintain backward compatibility for toggleTaskCompleteCallback', async () => {
      vi.mocked(TaskService.status.updateStatus).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult: unknown;
      await act(async () => {
        mutationResult = await result.current.toggleTaskCompleteCallback(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        message: 'Task completed successfully',
      });
    });

    it('should maintain backward compatibility for deleteTaskCallback', async () => {
      vi.mocked(TaskService.crud.delete).mockResolvedValue({
        data: undefined,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult: any;
      await act(async () => {
        mutationResult = await result.current.deleteTaskCallback(mockTask.id);
      });

      expect(mutationResult).toEqual({
        success: true,
        message: 'Task deleted successfully',
      });
    });

    it('should handle createFollowUpTask correctly', async () => {
      const taskData = {
        title: 'Follow-up Task',
        description: 'Follow-up Description',
      };

      vi.mocked(TaskService.hierarchy.createFollowUp).mockResolvedValue({
        data: { ...mockTask, title: taskData.title, parent_task_id: mockTask.id },
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult: any;
      await act(async () => {
        mutationResult = await result.current.createFollowUpTask(mockTask, taskData);
      });

      expect(mutationResult).toEqual({
        success: true,
        message: 'Follow-up task created successfully',
      });

      expect(TaskService.hierarchy.createFollowUp).toHaveBeenCalledWith(mockTask.id, taskData);
    });
  });
});
// CodeRabbit review

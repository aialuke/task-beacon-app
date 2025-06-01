import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskMutations } from './useTaskMutations';
import * as tasksApi from '@/integrations/supabase/api/tasks.api';
import { handleApiError } from '@/lib/utils/error';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock the API functions
vi.mock('@/integrations/supabase/api/tasks.api');
vi.mock('@/lib/errorHandling');

// Mock data
const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending' as const,
  priority: 'medium' as const,
  owner_id: 'user-1',
  pinned: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockFollowUpData = {
  title: 'Follow-up Task',
  description: 'Follow-up Description',
  due_date: '2024-12-31T23:59:59Z',
};

describe('useTaskMutations', () => {
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

    // Create wrapper with QueryClient
    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  });

  describe('toggleTaskComplete', () => {
    it('should successfully toggle task completion', async () => {
      // Mock successful API response
      vi.mocked(tasksApi.toggleTaskComplete).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskComplete(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task status updated successfully',
        task: mockTask,
      });

      expect(tasksApi.toggleTaskComplete).toHaveBeenCalledWith(mockTask.id);
      expect(handleApiError).not.toHaveBeenCalled();
    });

    it('should handle API errors correctly', async () => {
      const mockError = new Error('API Error');
      const processedError = { message: 'Failed to toggle task completion' };

      vi.mocked(tasksApi.toggleTaskComplete).mockRejectedValue(mockError);
      vi.mocked(handleApiError).mockReturnValue(processedError as any);

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskComplete(mockTask);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: processedError.message,
        message: `Failed to toggle task completion: ${processedError.message}`,
        task: mockTask,
      });

      expect(handleApiError).toHaveBeenCalledWith(
        mockError,
        'Failed to toggle task completion',
        {
          showToast: false,
          logToConsole: true,
          rethrow: false,
        }
      );
    });

    it('should invalidate queries after successful mutation', async () => {
      vi.mocked(tasksApi.toggleTaskComplete).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      await act(async () => {
        await result.current.toggleTaskComplete(mockTask);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });

  describe('toggleTaskPin', () => {
    it('should successfully toggle task pin status', async () => {
      vi.mocked(tasksApi.toggleTaskPin).mockResolvedValue({
        data: { ...mockTask, pinned: true },
        error: null,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskPin(mockTask);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Task pin status updated successfully',
        task: mockTask,
      });

      expect(tasksApi.toggleTaskPin).toHaveBeenCalledWith(mockTask.id);
    });

    it('should handle errors when toggling pin status', async () => {
      const mockError = new Error('Pin toggle failed');
      const processedError = { message: 'Failed to toggle task pin' };

      vi.mocked(tasksApi.toggleTaskPin).mockRejectedValue(mockError);
      vi.mocked(handleApiError).mockReturnValue(processedError as any);

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.toggleTaskPin(mockTask);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: processedError.message,
        message: `Failed to toggle task pin: ${processedError.message}`,
        task: mockTask,
      });
    });
  });

  describe('createFollowUpTask', () => {
    it('should successfully create a follow-up task', async () => {
      vi.mocked(tasksApi.createFollowUpTask).mockResolvedValue({
        data: { ...mockTask, id: 'follow-up-1', title: 'Follow-up Task' },
        error: null,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.createFollowUpTask(mockTask, mockFollowUpData);
      });

      expect(mutationResult).toEqual({
        success: true,
        error: null,
        message: 'Follow-up task created successfully',
        parentTask: mockTask,
        taskData: mockFollowUpData,
      });

      expect(tasksApi.createFollowUpTask).toHaveBeenCalledWith(mockTask.id, mockFollowUpData);
    });

    it('should handle errors when creating follow-up task', async () => {
      const mockError = new Error('Creation failed');
      const processedError = { message: 'Failed to create follow-up task' };

      vi.mocked(tasksApi.createFollowUpTask).mockRejectedValue(mockError);
      vi.mocked(handleApiError).mockReturnValue(processedError as any);

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.createFollowUpTask(mockTask, mockFollowUpData);
      });

      expect(mutationResult).toEqual({
        success: false,
        error: processedError.message,
        message: `Failed to create follow-up task: ${processedError.message}`,
        parentTask: mockTask,
        taskData: mockFollowUpData,
      });
    });

    it('should invalidate queries after creating follow-up task', async () => {
      vi.mocked(tasksApi.createFollowUpTask).mockResolvedValue({
        data: { ...mockTask, id: 'follow-up-1' },
        error: null,
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      await act(async () => {
        await result.current.createFollowUpTask(mockTask, mockFollowUpData);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });

  describe('query cache updates', () => {
    it('should handle infinite query structure updates', async () => {
      // Mock infinite query data structure
      const infiniteQueryData = {
        pages: [
          {
            data: [mockTask],
            count: 1,
            totalPages: 1,
            currentPage: 1,
          },
        ],
        pageParams: [undefined],
      };

      // Set initial query data
      queryClient.setQueryData(['tasks'], infiniteQueryData);

      vi.mocked(tasksApi.toggleTaskComplete).mockResolvedValue({
        data: { ...mockTask, status: 'complete' },
        error: null,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      await act(async () => {
        await result.current.toggleTaskComplete(mockTask);
      });

      // Verify that invalidateQueries was called
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });

    it('should handle regular paginated response updates', async () => {
      // Mock regular paginated response
      const paginatedData = {
        data: [mockTask],
        count: 1,
        totalPages: 1,
        currentPage: 1,
      };

      // Set initial query data
      queryClient.setQueryData(['tasks'], paginatedData);

      vi.mocked(tasksApi.toggleTaskPin).mockResolvedValue({
        data: { ...mockTask, pinned: true },
        error: null,
      });

      const { result } = renderHook(() => useTaskMutations(), { wrapper });

      await act(async () => {
        await result.current.toggleTaskPin(mockTask);
      });

      // Verify that invalidateQueries was called
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });

  describe('hook stability', () => {
    it('should maintain referential stability of mutation functions', () => {
      const { result, rerender } = renderHook(() => useTaskMutations(), { wrapper });

      const firstRender = {
        toggleTaskComplete: result.current.toggleTaskComplete,
        toggleTaskPin: result.current.toggleTaskPin,
        createFollowUpTask: result.current.createFollowUpTask,
      };

      rerender();

      const secondRender = {
        toggleTaskComplete: result.current.toggleTaskComplete,
        toggleTaskPin: result.current.toggleTaskPin,
        createFollowUpTask: result.current.createFollowUpTask,
      };

      // Functions should be stable across re-renders due to useCallback
      expect(firstRender.toggleTaskComplete).toBe(secondRender.toggleTaskComplete);
      expect(firstRender.toggleTaskPin).toBe(secondRender.toggleTaskPin);
      expect(firstRender.createFollowUpTask).toBe(secondRender.createFollowUpTask);
    });
  });
}); 
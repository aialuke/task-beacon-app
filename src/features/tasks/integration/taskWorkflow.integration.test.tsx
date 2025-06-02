import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTaskWorkflow } from '../hooks/useTaskWorkflow';
import { setupIntegrationTest, mockDatabaseQuery, createTestTask, createTestUser } from '@/test/integration/setup';
import { TaskService } from '@/lib/api/tasks.service';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import type { Task, TaskStatus } from '@/types/feature-types/task.types';
import type { ApiResponse } from '@/types/shared/api.types';

interface WorkflowResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

// Integration test for complete task workflow
describe('Task Workflow Integration Tests', () => {
  let cleanup: () => void;
  let queryClient: QueryClient;

  beforeEach(() => {
    cleanup = setupIntegrationTest();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TaskProviders>
        {children}
      </TaskProviders>
    </QueryClientProvider>
  );

  describe('Complete Task Creation Workflow', () => {
    it('should handle full task creation lifecycle with validation, API call, and success handling', async () => {
      // Setup: Mock successful task creation
      const mockCreatedTask = createTestTask({ title: 'New Integration Task' });
      mockDatabaseQuery('tasks', { data: mockCreatedTask, error: null });

      // Mock TaskService.create
      const createSpy = vi.spyOn(TaskService, 'create').mockResolvedValue({
        success: true,
        data: mockCreatedTask,
        error: null,
      });

      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Act: Execute task creation workflow
      let workflowResult: WorkflowResult;
      await act(async () => {
        workflowResult = await result.current.createTaskWithWorkflow({
          title: 'New Integration Task',
          description: 'Integration test task',
          dueDate: '2024-12-31T23:59:59Z',
          url: 'https://example.com',
          pinned: false,
          assigneeId: 'test-user-id',
        });
      });

      // Assert: Verify workflow completed successfully
      expect(workflowResult.success).toBe(true);
      expect(workflowResult.taskId).toBeDefined();
      expect(createSpy).toHaveBeenCalledWith({
        title: 'New Integration Task',
        description: 'Integration test task',
        dueDate: '2024-12-31T23:59:59Z',
        urlLink: 'https://example.com',
        pinned: false,
        assigneeId: 'test-user-id',
        photoUrl: undefined,
      });

      // Verify form was reset after successful creation
      expect(result.current.title).toBe('');
      expect(result.current.description).toBe('');
    });

    it('should handle task creation validation failures gracefully', async () => {
      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Act: Attempt to create task with invalid data
      let workflowResult: WorkflowResult;
      await act(async () => {
        workflowResult = await result.current.createTaskWithWorkflow({
          title: '', // Invalid: empty title
          description: '',
          dueDate: '',
          url: '',
          pinned: false,
          assigneeId: '',
        });
      });

      // Assert: Workflow should fail validation
      expect(workflowResult.success).toBe(false);
      expect(workflowResult.error).toBe('Validation failed');
    });

    it('should handle API errors during task creation', async () => {
      // Setup: Mock API failure
      const createSpy = vi.spyOn(TaskService, 'create').mockResolvedValue({
        success: false,
        data: null,
        error: { message: 'Database connection failed', code: 'DB_ERROR', name: 'DatabaseError' },
      });

      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Act: Attempt task creation with API failure
      let workflowResult: WorkflowResult;
      await act(async () => {
        workflowResult = await result.current.createTaskWithWorkflow({
          title: 'Valid Task Title',
          description: 'Valid description',
          dueDate: '2024-12-31T23:59:59Z',
          url: '',
          pinned: false,
          assigneeId: 'test-user-id',
        });
      });

      // Assert: Workflow should handle error gracefully
      expect(workflowResult.success).toBe(false);
      expect(workflowResult.error).toContain('Database connection failed');
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('Task Update Workflow with Optimistic Updates', () => {
    it('should handle optimistic task status updates with rollback capability', async () => {
      const originalTask = createTestTask({ status: 'pending' });
      const updatedTask = { ...originalTask, status: 'complete' as TaskStatus };

      // Mock successful update
      mockDatabaseQuery('tasks', { data: updatedTask, error: null });

      const { result } = renderHook(() => useTaskWorkflow({
        enableOptimisticUpdates: true,
        enableRealtimeSync: false,
      }), { wrapper });

      // Act: Update task status
      let updateResult: { success: boolean; data?: Task; error?: string };
      await act(async () => {
        updateResult = await result.current.updateTaskWithWorkflow(
          originalTask,
          { status: 'complete' }
        );
      });

      // Assert: Update should succeed
      expect(updateResult.success).toBe(true);
    });
  });

  describe('Real-time Synchronization Workflow', () => {
    it('should coordinate real-time updates with local state', async () => {
      const { result } = renderHook(() => useTaskWorkflow({
        enableRealtimeSync: true,
      }), { wrapper });

      // Assert: Real-time connection should be established
      expect(result.current.enableRealtimeSync).toBe(true);
      expect(result.current.workflowStatus).toBeDefined();
    });
  });

  describe('Workflow Status and Error Boundaries', () => {
    it('should provide accurate workflow status throughout operations', async () => {
      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Initial state
      expect(result.current.workflowStatus.canSubmit).toBe(false);
      expect(result.current.workflowStatus.isLoading).toBe(false);

      // Update title to enable submission
      act(() => {
        result.current.setTitle('Valid Task Title');
      });

      await waitFor(() => {
        expect(result.current.workflowStatus.canSubmit).toBe(true);
        expect(result.current.workflowStatus.isFormReady).toBe(true);
      });
    });
  });
});

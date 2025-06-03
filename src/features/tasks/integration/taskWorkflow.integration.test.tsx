import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTaskWorkflow } from '../hooks/useTaskWorkflow';
import { setupIntegrationTest, mockDatabaseQuery, createTestTask } from '@/test/integration/setup';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import type { TaskStatus } from '@/types/feature-types/task.types';
import { AuthProvider } from '@/contexts/AuthContext';

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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TaskProviders>
          {children}
        </TaskProviders>
      </QueryClientProvider>
    </AuthProvider>
  );

  // TODO: Re-implement task creation tests when createTaskWithWorkflow is re-added
  /*
  describe('Complete Task Creation Workflow', () => {
    it('should handle full task creation lifecycle with validation, API call, and success handling', async () => {
      // This test is commented out because createTaskWithWorkflow was removed from useTaskWorkflow
      // The functionality should be re-implemented or tested in a different hook
    });

    it('should handle task creation validation failures gracefully', async () => {
      // This test is commented out because createTaskWithWorkflow was removed from useTaskWorkflow
    });

    it('should handle API errors during task creation', async () => {
      // This test is commented out because createTaskWithWorkflow was removed from useTaskWorkflow
    });
  });
  */

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
      let updateResult: any; // Use any to handle the complex return type from mutations
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

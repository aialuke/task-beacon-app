
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

  describe('Task Update Workflow with Optimistic Updates', () => {
    it('should handle optimistic task status updates with rollback capability', async () => {
      const originalTask = createTestTask({ status: 'pending' });
      const updatedTask = { ...originalTask, status: 'complete' as TaskStatus };

      // Mock successful update
      mockDatabaseQuery('tasks', { data: updatedTask, error: null });

      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Act: Update task status
      let updateResult: any;
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

  describe('Workflow Status and Error Boundaries', () => {
    it('should provide accurate workflow status throughout operations', async () => {
      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Initial state
      expect(result.current.workflowStatus.canSubmit).toBe(false);
      expect(result.current.workflowStatus.isBusy).toBe(false);

      // Update title to enable submission
      act(() => {
        result.current.setTitle('Valid Task Title');
      });

      await waitFor(() => {
        expect(result.current.workflowStatus.canSubmit).toBe(true);
        expect(result.current.workflowStatus.isReady).toBe(true);
      });
    });

    it('should handle form validation correctly', async () => {
      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      // Test empty title validation
      act(() => {
        result.current.setTitle('');
      });

      await waitFor(() => {
        expect(result.current.workflowStatus.canSubmit).toBe(false);
      });

      // Test valid title
      act(() => {
        result.current.setTitle('Valid Task Title');
      });

      await waitFor(() => {
        expect(result.current.workflowStatus.canSubmit).toBe(true);
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle API errors gracefully', async () => {
      const originalTask = createTestTask({ status: 'pending' });

      // Mock API error
      mockDatabaseQuery('tasks', { 
        data: null, 
        error: { message: 'Network error', code: 'NETWORK_ERROR' } 
      });

      const { result } = renderHook(() => useTaskWorkflow(), { wrapper });

      let updateResult: any;
      await act(async () => {
        try {
          updateResult = await result.current.updateTaskWithWorkflow(
            originalTask,
            { status: 'complete' }
          );
        } catch (error) {
          // Error should be handled gracefully
          expect(error).toBeDefined();
        }
      });

      // Workflow should handle errors and maintain state
      expect(result.current.workflowStatus.isBusy).toBe(false);
    });
  });
});

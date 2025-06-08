
import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskMutations, useTaskStatusMutations, useTaskDeleteMutations } from '../useTaskMutations';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the orchestrator
vi.mock('../mutations/useTaskMutationsOrchestrator', () => ({
  useTaskMutationsOrchestrator: vi.fn(() => ({
    createTask: vi.fn(),
    createTaskCallback: vi.fn(),
    updateTask: vi.fn(),
    updateTaskCallback: vi.fn(),
    deleteTask: vi.fn(),
    deleteTaskCallback: vi.fn(),
    toggleTaskComplete: vi.fn(),
    toggleTaskCompleteCallback: vi.fn(),
    markAsComplete: vi.fn(),
    markAsIncomplete: vi.fn(),
    isLoading: false,
  })),
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

describe('useTaskMutations (Backward Compatibility)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export useTaskMutations as orchestrator', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    expect(result.current).toHaveProperty('createTask');
    expect(result.current).toHaveProperty('updateTask');
    expect(result.current).toHaveProperty('deleteTask');
    expect(result.current).toHaveProperty('toggleTaskComplete');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('should provide backward compatible status mutations', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTaskStatusMutations(), { wrapper });

    expect(result.current).toHaveProperty('markAsComplete');
    expect(result.current).toHaveProperty('markAsIncomplete');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('should provide backward compatible delete mutations', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTaskDeleteMutations(), { wrapper });

    expect(result.current).toHaveProperty('deleteTask');
    expect(result.current).toHaveProperty('isLoading');
  });
});

import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { TaskUIContextProvider } from '../../context/TaskUIContext';
import { useTaskAnimation } from '../useTaskAnimation';

// Test wrapper with context provider
function TestWrapper({ children }: { children: ReactNode }) {
  return <TaskUIContextProvider>{children}</TaskUIContextProvider>;
}

describe('useTaskAnimation', () => {
  it('should initialize with collapsed state', () => {
    const { result } = renderHook(() => useTaskAnimation('task-1'), {
      wrapper: TestWrapper,
    });

    expect(result.current.isExpanded).toBe(false);
    expect(result.current.animationPhase).toBe('exit');
  });

  it('should expand when toggleExpanded is called', () => {
    const { result } = renderHook(() => useTaskAnimation('task-1'), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.toggleExpanded();
    });

    expect(result.current.isExpanded).toBe(true);
    expect(result.current.animationPhase).toBe('enter');
  });

  it('should collapse when toggleExpanded is called on expanded task', () => {
    const { result } = renderHook(() => useTaskAnimation('task-1'), {
      wrapper: TestWrapper,
    });

    // First expand
    act(() => {
      result.current.toggleExpanded();
    });

    expect(result.current.isExpanded).toBe(true);

    // Then collapse
    act(() => {
      result.current.toggleExpanded();
    });

    expect(result.current.isExpanded).toBe(false);
    expect(result.current.animationPhase).toBe('exit');
  });

  it('should only allow one task to be expanded at a time', () => {
    // Create a component that uses both hooks to ensure they share context
    function TestComponent() {
      const task1 = useTaskAnimation('task-1');
      const task2 = useTaskAnimation('task-2');
      
      return {
        task1,
        task2,
      };
    }

    const { result } = renderHook(() => TestComponent(), {
      wrapper: TestWrapper,
    });

    // Expand task 1
    act(() => {
      result.current.task1.toggleExpanded();
    });

    expect(result.current.task1.isExpanded).toBe(true);
    expect(result.current.task2.isExpanded).toBe(false);

    // Expand task 2 - should collapse task 1
    act(() => {
      result.current.task2.toggleExpanded();
    });

    expect(result.current.task1.isExpanded).toBe(false);
    expect(result.current.task2.isExpanded).toBe(true);
  });

  it('should handle undefined taskId gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useTaskAnimation(undefined as any), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.toggleExpanded();
    });

    expect(consoleSpy).toHaveBeenCalledWith('toggleExpanded called with undefined taskId');
    expect(result.current.isExpanded).toBe(false);

    consoleSpy.mockRestore();
  });
});

import { useTaskFormBase } from './useTaskFormBase';
import { useTasksNavigate } from './useTasksNavigate';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Phase 4 Cleanup: Simplified create task hook using shared base
 * Eliminates duplicate code while maintaining exact same functionality
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const { navigateToDashboard } = useTasksNavigate();
  
  // Use shared base hook functionality
  const baseHook = useTaskFormBase({
    onClose: onClose ?? navigateToDashboard,
  });

  // Return the same interface as before - no breaking changes
  return useOptimizedMemo(
    () => ({
      ...baseHook,
    }),
    [baseHook],
    { name: 'create-task-return' }
  );
}

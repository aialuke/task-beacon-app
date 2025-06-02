
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Clean imports from organized type system
import type { Task } from '@/types';
import { useRealtimeEntity } from '@/hooks/useRealtimeEntity';
import { toast, triggerHapticFeedback } from '@/lib/utils/notification';
import { useAuth } from '@/hooks/useAuth';

/**
 * Task-specific real-time updates using the generalized entity hook
 */
export function useTaskRealtime() {
  const { user } = useAuth();

  const handleTaskStatusChange = useCallback((newTask: Task) => {
    // Notify about status changes for assigned tasks
    if (newTask.assignee_id === user?.id && newTask.owner_id !== user?.id) {
      const statusMessage = newTask.status === 'complete' 
        ? 'Task completed' 
        : `Task status changed to ${newTask.status}`;
      
      toast.info(`${statusMessage}: "${newTask.title}"`);
      triggerHapticFeedback();
    }
  }, [user?.id]);

  const { isSubscribed } = useRealtimeEntity<Task>({
    table: 'tasks',
    queryKey: ['tasks'],
    entityId: user?.id || '',
    fetchFn: async (id) => {
      // This is a placeholder - in practice you'd fetch the specific task
      // For now, return a default task structure
      return {} as Task;
    },
    enabled: !!user,
    onEntityUpdated: handleTaskStatusChange,
  });

  return {
    isSubscribed,
  };
}

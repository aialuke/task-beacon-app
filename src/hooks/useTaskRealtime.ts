
import { useCallback } from 'react';
import { useRealtimeEntity } from './useRealtimeEntity';
import { toast, triggerHapticFeedback } from '@/lib/notification';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types/shared.types';

/**
 * Task-specific real-time updates using the generalized entity hook
 */
export function useTaskRealtime() {
  const { user } = useAuth();

  const handleTaskStatusChange = useCallback((oldTask: Task, newTask: Task, isForCurrentUser: boolean) => {
    // Notify about status changes for assigned tasks
    if (oldTask.status !== newTask.status && isForCurrentUser && newTask.owner_id !== user?.id) {
      const statusMessage = newTask.status === 'complete' 
        ? 'Task completed' 
        : `Task status changed to ${newTask.status}`;
      
      toast.info(`${statusMessage}: "${newTask.title}"`);
      triggerHapticFeedback();
    }
  }, [user?.id]);

  const { isSubscribed } = useRealtimeEntity<Task>({
    table: 'tasks',
    entityName: 'task',
    getUserId: (task) => task.assignee_id,
    getOwnerId: (task) => task.owner_id,
    getTitle: (task) => task.title,
    onUpdateNotification: handleTaskStatusChange,
  });

  return {
    isSubscribed,
  };
}

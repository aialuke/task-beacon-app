
import { useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { toast } from '@/lib/toast';
import { showBrowserNotification, triggerHapticFeedback } from '@/lib/notification';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types/shared.types';

/**
 * Hook for real-time task updates with notifications
 */
export function useTaskRealtime() {
  const { user } = useAuth();

  const handleTaskInsert = useCallback((payload: any) => {
    const newTask = payload.new as Task;
    
    // Show notification for task assignments
    if (newTask.assignee_id === user?.id && newTask.owner_id !== user?.id) {
      triggerHapticFeedback();
      toast.success(`New task assigned: "${newTask.title}"`);
      showBrowserNotification(
        'Task Assigned',
        `You have been assigned a new task: "${newTask.title}"`
      );
    }
    
    console.log('📝 New task created:', newTask);
  }, [user?.id]);

  const handleTaskUpdate = useCallback((payload: any) => {
    const updatedTask = payload.new as Task;
    const oldTask = payload.old as Task;
    
    // Notify about status changes
    if (oldTask.status !== updatedTask.status) {
      if (updatedTask.assignee_id === user?.id && updatedTask.owner_id !== user?.id) {
        const statusMessage = updatedTask.status === 'complete' 
          ? 'Task completed' 
          : `Task status changed to ${updatedTask.status}`;
        
        toast.info(`${statusMessage}: "${updatedTask.title}"`);
        triggerHapticFeedback();
      }
    }

    // Notify about assignment changes
    if (oldTask.assignee_id !== updatedTask.assignee_id) {
      if (updatedTask.assignee_id === user?.id) {
        toast.success(`Task assigned to you: "${updatedTask.title}"`);
        showBrowserNotification(
          'Task Assignment',
          `You have been assigned: "${updatedTask.title}"`
        );
        triggerHapticFeedback();
      }
    }
    
    console.log('📝 Task updated:', { old: oldTask, new: updatedTask });
  }, [user?.id]);

  const handleTaskDelete = useCallback((payload: any) => {
    const deletedTask = payload.old as Task;
    console.log('🗑️ Task deleted:', deletedTask);
  }, []);

  const { isSubscribed } = useRealtimeSubscription({
    table: 'tasks',
    onInsert: handleTaskInsert,
    onUpdate: handleTaskUpdate,
    onDelete: handleTaskDelete,
    invalidateQueries: ['tasks'],
  });

  return {
    isSubscribed,
  };
}

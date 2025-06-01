
import { useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { toast } from '@/lib/toast';
import { showBrowserNotification, triggerHapticFeedback } from '@/lib/notification';
import { useAuth } from '@/contexts/AuthContext';

interface RealtimeEntityConfig<T> {
  table: string;
  entityName: string;
  getUserId?: (entity: T) => string | null;
  getOwnerId?: (entity: T) => string | null;
  getTitle?: (entity: T) => string;
  onInsertNotification?: (entity: T, isForCurrentUser: boolean) => void;
  onUpdateNotification?: (oldEntity: T, newEntity: T, isForCurrentUser: boolean) => void;
  onDeleteNotification?: (entity: T, isForCurrentUser: boolean) => void;
}

/**
 * Generalized hook for real-time entity updates with notifications
 */
export function useRealtimeEntity<T>(config: RealtimeEntityConfig<T>) {
  const { user } = useAuth();
  const {
    table,
    entityName,
    getUserId,
    getOwnerId,
    getTitle,
    onInsertNotification,
    onUpdateNotification,
    onDeleteNotification,
  } = config;

  const handleEntityInsert = useCallback((payload: any) => {
    const newEntity = payload.new as T;
    const isForCurrentUser = getUserId ? getUserId(newEntity) === user?.id : false;
    const isOwnedByCurrentUser = getOwnerId ? getOwnerId(newEntity) === user?.id : false;
    
    // Show notification for entities assigned to current user but not owned by them
    if (isForCurrentUser && !isOwnedByCurrentUser) {
      const title = getTitle ? getTitle(newEntity) : 'New item';
      triggerHapticFeedback();
      toast.success(`New ${entityName} assigned: "${title}"`);
      showBrowserNotification(
        `${entityName} Assigned`,
        `You have been assigned a new ${entityName}: "${title}"`
      );
    }
    
    onInsertNotification?.(newEntity, isForCurrentUser);
    console.log(`📝 New ${entityName} created:`, newEntity);
  }, [user?.id, entityName, getUserId, getOwnerId, getTitle, onInsertNotification]);

  const handleEntityUpdate = useCallback((payload: any) => {
    const updatedEntity = payload.new as T;
    const oldEntity = payload.old as T;
    const isForCurrentUser = getUserId ? getUserId(updatedEntity) === user?.id : false;
    const isOwnedByCurrentUser = getOwnerId ? getOwnerId(updatedEntity) === user?.id : false;

    // Handle assignment changes
    if (getUserId && getOwnerId) {
      const oldUserId = getUserId(oldEntity);
      const newUserId = getUserId(updatedEntity);
      
      if (oldUserId !== newUserId && newUserId === user?.id) {
        const title = getTitle ? getTitle(updatedEntity) : 'Item';
        toast.success(`${entityName} assigned to you: "${title}"`);
        showBrowserNotification(
          `${entityName} Assignment`,
          `You have been assigned: "${title}"`
        );
        triggerHapticFeedback();
      }
    }
    
    onUpdateNotification?.(oldEntity, updatedEntity, isForCurrentUser);
    console.log(`📝 ${entityName} updated:`, { old: oldEntity, new: updatedEntity });
  }, [user?.id, entityName, getUserId, getOwnerId, getTitle, onUpdateNotification]);

  const handleEntityDelete = useCallback((payload: any) => {
    const deletedEntity = payload.old as T;
    const isForCurrentUser = getUserId ? getUserId(deletedEntity) === user?.id : false;
    
    onDeleteNotification?.(deletedEntity, isForCurrentUser);
    console.log(`🗑️ ${entityName} deleted:`, deletedEntity);
  }, [entityName, getUserId, onDeleteNotification]);

  const { isSubscribed } = useRealtimeSubscription({
    table,
    onInsert: handleEntityInsert,
    onUpdate: handleEntityUpdate,
    onDelete: handleEntityDelete,
    invalidateQueries: [table],
  });

  return {
    isSubscribed,
  };
}

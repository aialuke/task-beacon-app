import { useEffect, useCallback, useState } from 'react';
import { useOptimizedMemo, useOptimizedCallback } from './useOptimizedMemo';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { realtimeLogger } from '@/lib/logger';

interface EntityWithId {
  id: string;
}

interface UseRealtimeEntityOptions<T extends EntityWithId> {
  table: string;
  queryKey: string[];
  onEntityCreated?: (entity: T) => void;
  onEntityUpdated?: (entity: T) => void;
  onEntityDeleted?: (entity: T) => void;
  entityId: string;
  fetchFn: (id: string) => Promise<T>;
  enabled?: boolean;
  refetchInterval?: number;
}

interface RealtimeEntityState {
  isConnected: boolean;
  lastUpdate: Date | null;
}

/**
 * Entity state management hook
 */
function useEntityState(): [RealtimeEntityState, (updates: Partial<RealtimeEntityState>) => void] {
  const [state, setState] = useState<RealtimeEntityState>({
    isConnected: false,
    lastUpdate: null,
  });

  const updateState = useOptimizedCallback(
    (updates: Partial<RealtimeEntityState>) => {
      setState(prev => ({ ...prev, ...updates }));
    },
    [],
    { name: 'updateEntityState' }
  );

  return [state, updateState];
}

/**
 * Entity event handlers hook
 */
function useEntityEventHandlers<T extends EntityWithId>(
  entityId: string,
  table: string,
  callbacks: {
    onEntityCreated?: (entity: T) => void;
    onEntityUpdated?: (entity: T) => void;
    onEntityDeleted?: (entity: T) => void;
  },
  updateState: (updates: Partial<RealtimeEntityState>) => void
) {
  return useOptimizedCallback(
    (payload: any) => {
      const { eventType, new: updatedEntity, old: deletedEntity } = payload;

      switch (eventType) {
        case 'INSERT':
          if (updatedEntity?.id === entityId) {
            realtimeLogger.debug(`New ${table} entity`, {
              entityId: updatedEntity.id,
              table
            });
            
            callbacks.onEntityCreated?.(updatedEntity);
            updateState({ lastUpdate: new Date() });
          }
          break;

        case 'UPDATE':
          if (updatedEntity?.id === entityId) {
            realtimeLogger.debug(`Updated ${table} entity`, {
              entityId: updatedEntity.id,
              table,
              hasChanges: JSON.stringify(updatedEntity) !== JSON.stringify(deletedEntity)
            });
            
            callbacks.onEntityUpdated?.(updatedEntity);
            updateState({ lastUpdate: new Date() });
          }
          break;

        case 'DELETE':
          if (deletedEntity?.id === entityId) {
            realtimeLogger.debug(`Deleted ${table} entity`, {
              entityId: deletedEntity.id,
              table
            });
            
            callbacks.onEntityDeleted?.(deletedEntity);
            updateState({ lastUpdate: new Date() });
          }
          break;

        default:
          realtimeLogger.warn(`Unknown event type for ${table}`, { eventType, table });
          break;
      }
    },
    [entityId, table, callbacks, updateState],
    { name: 'entityEventHandler' }
  );
}

/**
 * Optimized hook for managing real-time entity updates
 * 
 * Now with better performance through hook composition and memoization.
 */
export function useRealtimeEntity<T extends EntityWithId>({
  table,
  queryKey,
  onEntityCreated,
  onEntityUpdated,
  onEntityDeleted,
  entityId,
  fetchFn,
  enabled = true,
  refetchInterval,
}: UseRealtimeEntityOptions<T>) {
  const queryClient = useQueryClient();
  const [entityState, updateEntityState] = useEntityState();

  // Memoize callbacks to prevent unnecessary re-renders
  const callbacks = useOptimizedMemo(
    () => ({ onEntityCreated, onEntityUpdated, onEntityDeleted }),
    [onEntityCreated, onEntityUpdated, onEntityDeleted],
    { name: 'entity-callbacks' }
  );

  // Memoize query configuration
  const queryConfig = useOptimizedMemo(
    () => ({
      queryKey: [...queryKey, entityId],
      queryFn: () => fetchFn(entityId),
      enabled: enabled && !!entityId,
      refetchInterval,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }),
    [queryKey, entityId, fetchFn, enabled, refetchInterval],
    { name: 'query-config' }
  );

  // Entity data query
  const {
    data: entity,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery(queryConfig);

  // Optimized query invalidation
  const invalidateQueries = useOptimizedCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey], { name: 'invalidateQueries' });

  // Event handler
  const handleRealtimeUpdate = useEntityEventHandlers(
    entityId,
    table,
    callbacks,
    updateEntityState
  );

  // Real-time subscription
  const { isSubscribed } = useRealtimeSubscription({
    table,
    event: '*',
    onInsert: handleRealtimeUpdate,
    onUpdate: handleRealtimeUpdate,
    onDelete: handleRealtimeUpdate,
    invalidateQueries: queryKey,
  });

  // Update connection status
  useEffect(() => {
    updateEntityState({ isConnected: isSubscribed });
  }, [isSubscribed, updateEntityState]);

  // Memoize return object for stable references
  return useOptimizedMemo(
    () => ({
      entity,
      isLoading,
      error,
      refetch,
      isRefetching,
      isConnected: entityState.isConnected,
      isSubscribed,
      lastUpdate: entityState.lastUpdate,
      invalidateQueries,
    }),
    [
      entity,
      isLoading,
      error,
      refetch,
      isRefetching,
      entityState.isConnected,
      isSubscribed,
      entityState.lastUpdate,
      invalidateQueries,
    ],
    { name: 'realtime-entity-return' }
  );
}

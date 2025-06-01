import { useCallback, useRef, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { realtimeLogger } from '@/lib/logger';

interface ConflictResolutionStrategy {
  onConflict: 'client-wins' | 'server-wins' | 'merge' | 'prompt-user';
  mergeStrategy?: (client: any, server: any) => any;
  onUserPrompt?: (client: any, server: any) => Promise<any>;
}

interface RealtimeSyncOptions<T> {
  /** Database table to synchronize */
  table: string;
  /** Query key for cache management */
  queryKey: string[];
  /** Conflict resolution strategy */
  conflictResolution?: ConflictResolutionStrategy;
  /** Enable optimistic updates */
  enableOptimistic?: boolean;
  /** Debounce time for batch updates (ms) */
  debounceMs?: number;
  /** Custom entity transformer */
  transformEntity?: (entity: T) => T;
  /** Validation function before applying updates */
  validateUpdate?: (entity: T) => boolean;
}

interface SyncState {
  isConnected: boolean;
  conflictsCount: number;
  lastSyncTime: Date | null;
  pendingOperations: number;
}

/**
 * Enhanced real-time synchronization hook with conflict resolution
 * 
 * Provides automatic bidirectional sync between local cache and server state
 * with configurable conflict resolution strategies and optimistic updates.
 * 
 * @template T - Entity type being synchronized
 * @param options - Configuration options for sync behavior
 * @returns Sync state and control functions
 */
export function useRealtimeSync<T extends { id: string; updated_at?: string }>(
  options: RealtimeSyncOptions<T>
) {
  const {
    table,
    queryKey,
    conflictResolution = { onConflict: 'server-wins' },
    enableOptimistic = true,
    debounceMs = 500,
    transformEntity,
    validateUpdate,
  } = options;

  const queryClient = useQueryClient();
  const [syncState, setSyncState] = useState<SyncState>({
    isConnected: false,
    conflictsCount: 0,
    lastSyncTime: null,
    pendingOperations: 0,
  });

  // Refs for managing debounced operations
  const pendingUpdatesRef = useRef<Map<string, T>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const optimisticUpdatesRef = useRef<Map<string, T>>(new Map());

  /**
   * Apply entity update to cache with optional optimistic handling
   */
  const applyEntityUpdate = useCallback((entity: T, isOptimistic = false) => {
    if (validateUpdate && !validateUpdate(entity)) {
      realtimeLogger.warn('Entity update failed validation', { entityId: entity.id, table });
      return false;
    }

    const transformedEntity = transformEntity ? transformEntity(entity) : entity;

    if (isOptimistic) {
      optimisticUpdatesRef.current.set(entity.id, transformedEntity);
    }

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;

      // Handle different query data structures
      if (Array.isArray(oldData)) {
        return oldData.map(item => 
          item.id === entity.id ? transformedEntity : item
        );
      } else if (oldData.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: oldData.data.map(item => 
            item.id === entity.id ? transformedEntity : item
          )
        };
      } else if (oldData.pages) {
        // Handle infinite query structure
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.map(item => 
              item.id === entity.id ? transformedEntity : item
            )
          }))
        };
      }

      return oldData;
    });

    return true;
  }, [queryKey, queryClient, transformEntity, validateUpdate, table]);

  /**
   * Handle conflict resolution between client and server versions
   */
  const resolveConflict = useCallback(async (clientEntity: T, serverEntity: T) => {
    setSyncState(prev => ({ ...prev, conflictsCount: prev.conflictsCount + 1 }));

    switch (conflictResolution.onConflict) {
      case 'client-wins':
        realtimeLogger.debug('Conflict resolved: client wins', { entityId: clientEntity.id });
        return clientEntity;
      
      case 'server-wins':
        realtimeLogger.debug('Conflict resolved: server wins', { entityId: serverEntity.id });
        return serverEntity;
      
      case 'merge':
        if (conflictResolution.mergeStrategy) {
          const merged = conflictResolution.mergeStrategy(clientEntity, serverEntity);
          realtimeLogger.debug('Conflict resolved: merged', { entityId: merged.id });
          return merged;
        }
        // Fallback to server wins if no merge strategy
        return serverEntity;
      
      case 'prompt-user':
        if (conflictResolution.onUserPrompt) {
          const resolved = await conflictResolution.onUserPrompt(clientEntity, serverEntity);
          realtimeLogger.debug('Conflict resolved: user choice', { entityId: resolved.id });
          return resolved;
        }
        // Fallback to server wins if no prompt handler
        return serverEntity;
      
      default:
        return serverEntity;
    }
  }, [conflictResolution]);

  /**
   * Process incoming real-time update
   */
  const handleIncomingUpdate = useCallback(async (serverEntity: T) => {
    const optimisticEntity = optimisticUpdatesRef.current.get(serverEntity.id);
    
    if (optimisticEntity) {
      // Check for conflicts between optimistic update and server update
      const hasConflict = optimisticEntity.updated_at !== serverEntity.updated_at;
      
      if (hasConflict) {
        const resolvedEntity = await resolveConflict(optimisticEntity, serverEntity);
        applyEntityUpdate(resolvedEntity, false);
      } else {
        // No conflict, server update matches optimistic update
        applyEntityUpdate(serverEntity, false);
      }
      
      // Clear optimistic update
      optimisticUpdatesRef.current.delete(serverEntity.id);
    } else {
      // No local changes, apply server update directly
      applyEntityUpdate(serverEntity, false);
    }

    setSyncState(prev => ({ ...prev, lastSyncTime: new Date() }));
  }, [applyEntityUpdate, resolveConflict]);

  /**
   * Flush pending updates with debouncing
   */
  const flushPendingUpdates = useCallback(() => {
    const updates = Array.from(pendingUpdatesRef.current.values());
    pendingUpdatesRef.current.clear();

    setSyncState(prev => ({ 
      ...prev, 
      pendingOperations: prev.pendingOperations - updates.length 
    }));

    // Process each update
    updates.forEach(entity => applyEntityUpdate(entity, false));
  }, [applyEntityUpdate]);

  /**
   * Queue an update for processing
   */
  const queueUpdate = useCallback((entity: T) => {
    pendingUpdatesRef.current.set(entity.id, entity);
    
    setSyncState(prev => ({ 
      ...prev, 
      pendingOperations: prev.pendingOperations + 1 
    }));

    // Debounce the flush operation
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(flushPendingUpdates, debounceMs);
  }, [flushPendingUpdates, debounceMs]);

  /**
   * Perform optimistic update
   */
  const optimisticUpdate = useCallback((entity: T) => {
    if (!enableOptimistic) return false;
    
    return applyEntityUpdate(entity, true);
  }, [applyEntityUpdate, enableOptimistic]);

  /**
   * Rollback optimistic update
   */
  const rollbackOptimistic = useCallback((entityId: string) => {
    optimisticUpdatesRef.current.delete(entityId);
    
    // Trigger cache invalidation to get fresh data
    queryClient.invalidateQueries({ queryKey });
    
    realtimeLogger.debug('Optimistic update rolled back', { entityId, table });
  }, [queryClient, queryKey, table]);

  // Set up real-time subscription
  const { isSubscribed } = useRealtimeSubscription({
    table,
    event: '*',
    onUpdate: (payload) => {
      if (payload.new) {
        handleIncomingUpdate(payload.new as T);
      }
    },
    onInsert: (payload) => {
      if (payload.new) {
        queueUpdate(payload.new as T);
      }
    },
    onDelete: (payload) => {
      if (payload.old) {
        // Handle deletions by removing from cache
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData;
          
          const deletedId = (payload.old as T).id;
          
          if (Array.isArray(oldData)) {
            return oldData.filter(item => item.id !== deletedId);
          } else if (oldData.data && Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: oldData.data.filter(item => item.id !== deletedId)
            };
          }
          
          return oldData;
        });
      }
    },
  });

  // Update connection state
  useEffect(() => {
    setSyncState(prev => ({ ...prev, isConnected: isSubscribed }));
  }, [isSubscribed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    syncState,
    optimisticUpdate,
    rollbackOptimistic,
    queueUpdate,
    flushPendingUpdates,
  };
} 
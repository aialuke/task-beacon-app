import { useEffect, useCallback, useState } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { realtimeLogger } from '@/lib/logger';

interface EntityWithId {
  id: string;
}

/**
 * Configuration options for the useRealtimeEntity hook
 */
interface UseRealtimeEntityOptions<T extends EntityWithId> {
  /** The database table to subscribe to */
  table: string;
  /** The query key used by React Query for caching */
  queryKey: string[];
  /** 
   * Callback fired when a new entity is inserted
   * @param payload - The realtime payload containing the new entity data
   */
  onEntityCreated?: (entity: T) => void;
  /** 
   * Callback fired when an entity is updated
   * @param payload - The realtime payload containing old and new entity data
   */
  onEntityUpdated?: (entity: T) => void;
  /** 
   * Callback fired when an entity is deleted
   * @param payload - The realtime payload containing the deleted entity data
   */
  onEntityDeleted?: (entity: T) => void;
  /** The entity ID to track */
  entityId: string;
  /** The function to fetch the entity */
  fetchFn: (id: string) => Promise<T>;
  /** Whether the entity is enabled */
  enabled?: boolean;
  /** The refetch interval for the entity */
  refetchInterval?: number;
}

/**
 * Hook for managing real-time entity updates with automatic query invalidation
 * 
 * This hook provides a high-level abstraction over Supabase real-time subscriptions,
 * automatically handling query cache invalidation and providing type-safe callbacks
 * for database changes.
 * 
 * @template T - The TypeScript type of the entity being tracked
 * @param options - Configuration options for the real-time subscription
 * @returns Object containing subscription status and manual invalidation function
 * 
 * @example
 * ```typescript
 * // Track task updates with custom handlers
 * const { isSubscribed } = useRealtimeEntity<Task>({
 *   table: 'tasks',
 *   queryKey: ['tasks', taskId],
 *   onEntityUpdated: ({ old, new: updated }) => {
 *     if (old.status !== updated.status) {
 *       toast.success('Task status updated!');
 *     }
 *   },
 *   onEntityDeleted: ({ old }) => {
 *     toast.info(`Task "${old.title}" was deleted`);
 *   },
 *   entityId: taskId,
 *   fetchFn: getTask,
 *   enabled: true,
 *   refetchInterval: 5000
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Simple subscription without custom handlers
 * const { isSubscribed, invalidateQueries } = useRealtimeEntity<User>({
 *   table: 'profiles',
 *   queryKey: ['users'],
 *   entityId: user.id,
 *   fetchFn: getUser,
 *   enabled: true,
 *   refetchInterval: 5000
 * });
 * 
 * // Manually refresh cache when needed
 * const handleRefresh = () => {
 *   invalidateQueries();
 * };
 * ```
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
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Invalidates React Query cache for the specified query key
   * This triggers a refetch of the data from the server
   */
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  }, [queryClient, queryKey]);

  // Fetch entity data with React Query
  const {
    data: entity,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [...queryKey, entityId],
    queryFn: () => fetchFn(entityId),
    enabled: enabled && !!entityId,
    refetchInterval,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const eventType = payload.eventType;
    const updatedEntity = payload.new;
    const deletedEntity = payload.old;

    switch (eventType) {
      case 'INSERT':
        if (updatedEntity && updatedEntity.id === entityId) {
          realtimeLogger.debug(`New ${table} entity`, {
            entityId: updatedEntity.id,
            table
          });
          
          onEntityCreated?.(updatedEntity);
          setLastUpdate(new Date());
        }
        break;

      case 'UPDATE':
        if (updatedEntity && updatedEntity.id === entityId) {
          realtimeLogger.debug(`Updated ${table} entity`, {
            entityId: updatedEntity.id,
            table,
            hasChanges: JSON.stringify(updatedEntity) !== JSON.stringify(deletedEntity)
          });
          
          onEntityUpdated?.(updatedEntity);
          setLastUpdate(new Date());
        }
        break;

      case 'DELETE':
        if (deletedEntity && deletedEntity.id === entityId) {
          realtimeLogger.debug(`Deleted ${table} entity`, {
            entityId: deletedEntity.id,
            table
          });
          
          onEntityDeleted?.(deletedEntity);
          setLastUpdate(new Date());
        }
        break;

      default:
        realtimeLogger.warn(`Unknown event type for ${table}`, { eventType, table });
        break;
    }
  }, [entityId, table, onEntityCreated, onEntityUpdated, onEntityDeleted]);

  // Set up real-time subscription
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
    setIsConnected(isSubscribed);
  }, [isSubscribed]);

  return {
    entity,
    isLoading,
    error,
    refetch,
    isRefetching,
    isConnected,
    isSubscribed,
    lastUpdate,
  };
}

import { useEffect, useRef, useState } from 'react';
import { RealtimeService } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { realtimeLogger } from '@/lib/logger';

interface RealtimeSubscriptionOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void;
  invalidateQueries?: string[];
}

/**
 * Optimized hook for managing real-time subscriptions with proper cleanup
 * 
 * This hook manages Supabase real-time subscriptions for database changes,
 * providing automatic cleanup and query invalidation.
 * 
 * @param options - Configuration options for the real-time subscription
 * @returns Object containing subscription status and channel reference
 * 
 * @example
 * ```typescript
 * const { isSubscribed } = useRealtimeSubscription({
 *   table: 'tasks',
 *   event: '*',
 *   onUpdate: (payload) => {
 *     realtimeLogger.info('Task updated:', payload.new);
 *   },
 *   invalidateQueries: ['tasks']
 * });
 * ```
 */
export function useRealtimeSubscription({
  table,
  schema = 'public',
  event = '*',
  onInsert,
  onUpdate,
  onDelete,
  invalidateQueries = [],
}: RealtimeSubscriptionOptions) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!user) {
      setIsSubscribed(false);
      return;
    }

    realtimeLogger.info(`Setting up real-time subscription for ${table}`);

    try {
      const handleRealtimeChange = (payload: any) => {
        realtimeLogger.debug(`Real-time update received for ${table}`, {
          eventType: payload.eventType,
          table: payload.table,
          hasNew: !!payload.new,
          hasOld: !!payload.old
        });
        
        // Handle different event types with proper typing
        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload);
            break;
          case 'UPDATE':
            onUpdate?.(payload);
            break;
          case 'DELETE':
            onDelete?.(payload);
            break;
        }

        // Invalidate specified queries to refresh data
        if (invalidateQueries.length > 0) {
          invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
        }
      };

      const channel = RealtimeService.subscribe(table, handleRealtimeChange, event);
      channelRef.current = channel;
      setIsSubscribed(true);
      
      realtimeLogger.info(`Successfully subscribed to ${table} changes`);
    } catch (error) {
      realtimeLogger.error(`Failed to set up real-time subscription for ${table}`, error as Error);
      setIsSubscribed(false);
    }

    // Cleanup function
    return () => {
      realtimeLogger.debug(`Cleaning up real-time subscription for ${table}`);
      
      if (channelRef.current) {
        RealtimeService.unsubscribe(channelRef.current)
          .then(() => {
            setIsSubscribed(false);
            realtimeLogger.debug(`Successfully cleaned up subscription for ${table}`);
          })
          .catch((error) => {
            realtimeLogger.error('Error cleaning up channel', error as Error, { table });
          });
      }
    };
  }, [user, table, schema, event, onInsert, onUpdate, onDelete, queryClient, invalidateQueries]);

  return {
    /** Whether the subscription is currently active */
    isSubscribed,
    /** Reference to the Supabase realtime channel */
    channel: channelRef.current,
  };
}

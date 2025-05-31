
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { showBrowserNotification, triggerHapticFeedback } from '@/lib/notification';
import { useAuth } from '@/contexts/AuthContext';

interface RealtimeSubscriptionOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  invalidateQueries?: string[];
}

/**
 * Hook for managing real-time subscriptions with proper cleanup
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
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!user) return;

    // Create unique channel name
    const channelName = `realtime-${table}-${user.id}-${Date.now()}`;
    
    console.log(`🔄 Setting up real-time subscription for ${table}`);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: event as any,
          schema,
          table,
        },
        (payload) => {
          console.log(`📡 Real-time update received for ${table}:`, payload);
          
          // Handle different event types
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
        }
      )
      .subscribe((status) => {
        console.log(`🎯 Subscription status for ${table}:`, status);
        
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
          console.log(`✅ Successfully subscribed to ${table} changes`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Subscription error for ${table}`);
          isSubscribedRef.current = false;
        }
      });

    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up real-time subscription for ${table}`);
      
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        isSubscribedRef.current = false;
      }
    };
  }, [user?.id, table, schema, event, onInsert, onUpdate, onDelete, queryClient, invalidateQueries]);

  return {
    isSubscribed: isSubscribedRef.current,
    channel: channelRef.current,
  };
}

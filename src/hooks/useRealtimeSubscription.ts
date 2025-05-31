
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
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
 * Optimized hook for managing real-time subscriptions with proper cleanup
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
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!user) {
      setIsSubscribed(false);
      return;
    }

    // Create unique channel name
    const channelName = `realtime-${table}-${user.id}-${Date.now()}`;
    
    console.log(`🔄 Setting up real-time subscription for ${table}`);

    try {
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
            setIsSubscribed(true);
            console.log(`✅ Successfully subscribed to ${table} changes`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Subscription error for ${table}`);
            setIsSubscribed(false);
          } else if (status === 'CLOSED') {
            setIsSubscribed(false);
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error(`❌ Failed to set up real-time subscription for ${table}:`, error);
      setIsSubscribed(false);
    }

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up real-time subscription for ${table}`);
      
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
          setIsSubscribed(false);
        } catch (error) {
          console.error('Error cleaning up channel:', error);
        }
      }
    };
  }, [user?.id, table, schema, event, onInsert, onUpdate, onDelete, queryClient, invalidateQueries]);

  return {
    isSubscribed,
    channel: channelRef.current,
  };
}

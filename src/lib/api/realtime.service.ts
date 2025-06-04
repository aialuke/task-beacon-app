/**
 * Realtime Service
 * 
 * Provides real-time subscription utilities abstracted from Supabase.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Real-time utilities abstracted from Supabase
 */
export class RealtimeService {
  /**
   * Subscribe to real-time updates
   */
  static subscribe(
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ) {
    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes' as any, {
        event,
        schema: 'public',
        table,
      }, callback)
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from real-time updates
   */
  static async unsubscribe(channel: any) {
    return supabase.removeChannel(channel);
  }
}

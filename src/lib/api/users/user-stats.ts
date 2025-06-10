/**
 * User Statistics Operations
 * 
 * Handles user analytics and statistics queries.
 */

import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types';

import { apiRequest } from '../error-handling';

/**
 * User statistics interface
 */
export interface UserStats {
  total: number;
  admins: number;
  managers: number;
  users: number;
}

/**
 * Get user statistics
 */
export async function getStats(): Promise<ApiResponse<UserStats>> {
  return apiRequest('users.getStats', async () => {
    const [totalResult, adminResult, managerResult, userResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'manager'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    ]);

    return {
      total: totalResult.count || 0,
      admins: adminResult.count || 0,
      managers: managerResult.count || 0,
      users: userResult.count || 0,
    };
  });
} 
/**
 * Task Analytics Service - Handles statistics and search operations
 */

import { apiRequest } from '../../error-handling';
import { AuthService } from '../../auth.service';
import { supabase } from '@/integrations/supabase/client';
import { TaskQueryService, type TaskQueryOptions } from '../core/task-query.service';
import type { Task, ApiResponse } from '@/types';

export class TaskAnalyticsService {
  /**
   * Get task statistics for a user
   */
  static async getStats(userId?: string): Promise<ApiResponse<{
    total: number;
    pending: number;
    complete: number;
    overdue: number;
  }>> {
    return apiRequest('tasks.getStats', async () => {
      let targetUserId = userId;
      if (!targetUserId) {
        const userResponse = await AuthService.getCurrentUserId();
        if (!userResponse.success || !userResponse.data) {
          throw new Error('User not authenticated');
        }
        targetUserId = userResponse.data;
      }

      const [totalResult, pendingResult, completeResult, overdueResult] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'pending'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'complete'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('owner_id', targetUserId).eq('status', 'overdue'),
      ]);

      return {
        total: totalResult.count || 0,
        pending: pendingResult.count || 0,
        complete: completeResult.count || 0,
        overdue: overdueResult.count || 0,
      };
    });
  }

  /**
   * Search tasks by title or description
   */
  static async search(query: string, options: Omit<TaskQueryOptions, 'search'> = {}): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.search', async () => {
      const response = await TaskQueryService.getMany({ ...options, search: query });
      if (!response.success) {
        throw new Error(response.error?.message || 'Search failed');
      }
      return response.data?.data || [];
    });
  }
} // CodeRabbit review
// CodeRabbit review

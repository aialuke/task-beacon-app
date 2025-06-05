
/**
 * Optimized Task Query Service - Phase 1 Database Optimizations
 * 
 * Uses the new database indexes and eliminates N+1 query patterns
 */

import { apiRequest } from '../../error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, PaginatedResponse } from '@/types';
import type { Task } from '@/types';

export interface OptimizedTaskQueryOptions {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'complete' | 'overdue' | 'all';
  includeCompleted?: boolean;
  sortBy?: 'created_at' | 'due_date' | 'title' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  assignedToMe?: boolean;
  userId?: string;
}

/**
 * Optimized Task Query Service leveraging new database indexes
 */
export class OptimizedTaskQueryService {
  /**
   * Get paginated tasks with optimized queries using new indexes
   */
  static async getMany(options: OptimizedTaskQueryOptions = {}): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return apiRequest('optimized-tasks.getMany', async () => {
      const {
        page = 1,
        pageSize = 10,
        status = 'all',
        includeCompleted = false,
        sortBy = 'created_at',
        sortOrder = 'desc',
        search,
        assignedToMe = false,
        userId,
      } = options;

      // Build optimized query that uses our new composite indexes
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          photo_url,
          url_link,
          status,
          created_at,
          updated_at,
          parent_task_id,
          owner_id,
          assignee_id,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url)
        `, { count: 'exact' });

      // Apply filters in order of index efficiency
      // 1. Status filter first (uses idx_tasks_status_created_at)
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (!includeCompleted) {
        query = query.neq('status', 'complete');
      }

      // 2. User-specific filters (uses idx_tasks_assignee_id_status or idx_tasks_owner_id_status)
      if (assignedToMe && userId) {
        query = query.eq('assignee_id', userId);
      } else if (userId) {
        query = query.eq('owner_id', userId);
      }

      // 3. Search filter (applied after indexed filters)
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply optimal sorting using our indexes
      if (sortBy === 'created_at') {
        // Uses idx_tasks_status_created_at when combined with status filter
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'updated_at') {
        // Uses idx_tasks_status_updated_at when combined with status filter
        query = query.order('updated_at', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'due_date') {
        // Uses idx_tasks_due_date_status when combined with status filter
        query = query.order('due_date', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        pagination: {
          currentPage: page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          hasNextPage: page < Math.ceil((count || 0) / pageSize),
          hasPreviousPage: page > 1,
        },
      };
    });
  }

  /**
   * Get single task with optimized relation loading
   */
  static async getById(taskId: string): Promise<ApiResponse<Task>> {
    return apiRequest('optimized-tasks.getById', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          photo_url,
          url_link,
          status,
          created_at,
          updated_at,
          parent_task_id,
          owner_id,
          assignee_id,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url)
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Task not found');

      return data;
    });
  }

  /**
   * Optimized task counts using new indexes
   */
  static async getTaskCounts(userId?: string): Promise<ApiResponse<{
    pending: number;
    complete: number;
    overdue: number;
    total: number;
  }>> {
    return apiRequest('optimized-tasks.getTaskCounts', async () => {
      // Use efficient counting with our new composite indexes
      const countQueries = [
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'complete'),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'overdue'),
      ];

      // Add user filter if specified (uses idx_tasks_owner_id_status)
      if (userId) {
        countQueries.forEach(query => query.eq('owner_id', userId));
      }

      const [pendingResult, completeResult, overdueResult] = await Promise.all(countQueries);

      const pending = pendingResult.count || 0;
      const complete = completeResult.count || 0;
      const overdue = overdueResult.count || 0;

      return {
        pending,
        complete,
        overdue,
        total: pending + complete + overdue,
      };
    });
  }

  /**
   * Batch query for user validation using email index
   */
  static async validateUsersExist(emails: string[]): Promise<ApiResponse<boolean[]>> {
    return apiRequest('optimized-tasks.validateUsersExist', async () => {
      if (emails.length === 0) return [];

      // Uses idx_profiles_email for efficient lookup
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .in('email', emails);

      if (error) throw error;

      const existingEmails = new Set(data.map(profile => profile.email));
      return emails.map(email => existingEmails.has(email));
    });
  }

  /**
   * Get overdue tasks efficiently using new index
   */
  static async getOverdueTasks(userId?: string): Promise<ApiResponse<Task[]>> {
    return apiRequest('optimized-tasks.getOverdueTasks', async () => {
      // Uses idx_tasks_due_date_status for efficient overdue detection
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          photo_url,
          url_link,
          status,
          created_at,
          updated_at,
          parent_task_id,
          owner_id,
          assignee_id,
          owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar_url)
        `)
        .eq('status', 'overdue')
        .order('due_date', { ascending: true });

      if (userId) {
        // Uses idx_tasks_owner_id_status
        query = query.eq('owner_id', userId);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data || [];
    });
  }
}

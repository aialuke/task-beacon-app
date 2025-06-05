
/**
 * Task Query Service - Updated to use optimized database queries
 */

import { apiRequest } from '../../error-handling';
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, PaginatedResponse } from '@/types';
import type { Task } from '@/types';

export interface TaskQueryOptions {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'complete' | 'overdue' | 'all';
  includeCompleted?: boolean;
  sortBy?: 'created_at' | 'due_date' | 'title' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  assignedToMe?: boolean;
}

/**
 * Task Query Service - Optimized for performance with selective field loading
 */
export class TaskQueryService {
  /**
   * Get paginated tasks with optimized queries and selective field loading
   */
  static async getMany(options: TaskQueryOptions = {}): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return apiRequest('tasks.getMany', async () => {
      const {
        page = 1,
        pageSize = 10,
        status = 'all',
        includeCompleted = false,
        sortBy = 'created_at',
        sortOrder = 'desc',
        search,
        assignedToMe = false,
      } = options;

      // Optimized query - only select necessary fields and use indexes
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

      // Apply filters using indexed columns first for optimal performance
      if (status !== 'all') {
        // Uses idx_tasks_status_created_at index
        query = query.eq('status', status);
      }

      if (!includeCompleted) {
        // Uses idx_tasks_status_created_at index
        query = query.neq('status', 'complete');
      }

      if (assignedToMe) {
        // Uses idx_tasks_assignee_id_status index
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('assignee_id', user.id);
        }
      }

      // Search filter (applied after indexed filters for better performance)
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply sorting using indexed columns
      if (sortBy === 'created_at') {
        // Uses idx_tasks_status_created_at composite index for optimal performance
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'due_date') {
        // Uses idx_tasks_due_date_status index
        query = query.order('due_date', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else if (sortBy === 'updated_at') {
        // Uses idx_tasks_status_updated_at index
        query = query.order('updated_at', { ascending: sortOrder === 'asc' });
      } else {
        // Fallback for other sort fields
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
   * Get a single task by ID with minimal data fetching
   */
  static async getById(taskId: string): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.getById', async () => {
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
   * Optimized search with proper index usage
   */
  static async search(query: string, options: Omit<TaskQueryOptions, 'search'> = {}): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.search', async () => {
      // Use the optimized getMany method for search
      const searchOptions: TaskQueryOptions = {
        ...options,
        search: query,
        pageSize: 50, // Limit search results
      };
      
      const result = await this.getMany(searchOptions);
      if (!result.success) {
        throw new Error(result.error?.message || 'Search failed');
      }
      
      return result.data.data;
    });
  }

  /**
   * Get tasks by status using optimized index
   */
  static async getByStatus(status: 'pending' | 'complete' | 'overdue'): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.getByStatus', async () => {
      // Uses idx_tasks_status_created_at composite index for optimal performance
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
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(100); // Reasonable limit to prevent large data fetches

      if (error) throw error;

      return data || [];
    });
  }

  /**
   * Get user's assigned tasks with optimized query
   */
  static async getAssignedTasks(userId: string, options: Omit<TaskQueryOptions, 'assignedToMe'> = {}): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.getAssignedTasks', async () => {
      // Uses idx_tasks_assignee_id_status index
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
          owner:profiles!tasks_owner_id_fkey(id, name, email, avatar_url)
        `)
        .eq('assignee_id', userId)
        .order(options.sortBy || 'created_at', { ascending: options.sortOrder === 'asc' })
        .limit(options.pageSize || 50);

      if (error) throw error;

      return data || [];
    });
  }

  /**
   * Get tasks count by status (optimized for dashboard stats)
   */
  static async getTaskCounts(userId?: string): Promise<ApiResponse<{
    pending: number;
    complete: number;
    overdue: number;
    total: number;
  }>> {
    return apiRequest('tasks.getTaskCounts', async () => {
      // Build base queries with proper filtering using our new indexes
      let pendingQuery = supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending');
      let completeQuery = supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'complete');
      let overdueQuery = supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'overdue');
      
      if (userId) {
        // Uses idx_tasks_owner_id_status index
        pendingQuery = pendingQuery.eq('owner_id', userId);
        completeQuery = completeQuery.eq('owner_id', userId);
        overdueQuery = overdueQuery.eq('owner_id', userId);
      }

      // Use indexes for efficient counting
      const [pendingCount, completeCount, overdueCount] = await Promise.all([
        pendingQuery,
        completeQuery,
        overdueQuery,
      ]);

      const pending = pendingCount.count || 0;
      const complete = completeCount.count || 0;
      const overdue = overdueCount.count || 0;

      return {
        pending,
        complete,
        overdue,
        total: pending + complete + overdue,
      };
    });
  }
}

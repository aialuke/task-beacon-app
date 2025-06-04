
/**
 * Task Query Service - Handles all task retrieval operations
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
  pinnedOnly?: boolean;
}

/**
 * Task Query Service - Specialized service for task retrieval operations
 */
export class TaskQueryService {
  /**
   * Get paginated tasks with filtering and sorting
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
        pinnedOnly = false,
      } = options;

      // Start building the query - make sure to select ALL fields including photo_url
      let query = supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:owner_id(id, name, email),
          assignee:assignee_id(id, name, email)
        `);

      // Apply filters
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (!includeCompleted) {
        query = query.neq('status', 'complete');
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (pinnedOnly) {
        query = query.eq('pinned', true);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Debug logging for API response
      console.log('TaskQueryService - Raw data from API:', data);
      console.log('TaskQueryService - First task photo_url:', data?.[0]?.photo_url);

      return {
        data: data || [],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    });
  }

  /**
   * Get a single task by ID
   */
  static async getById(taskId: string): Promise<ApiResponse<Task>> {
    return apiRequest('tasks.getById', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:owner_id(id, name, email),
          assignee:assignee_id(id, name, email)
        `)
        .eq('id', taskId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Task not found');

      // Debug logging for single task retrieval
      console.log('TaskQueryService.getById - Task data:', data);
      console.log('TaskQueryService.getById - photo_url:', data.photo_url);

      return data;
    });
  }

  /**
   * Search tasks by title or description
   */
  static async search(query: string, options: Omit<TaskQueryOptions, 'search'> = {}): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.search', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:owner_id(id, name, email),
          assignee:assignee_id(id, name, email)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order(options.sortBy || 'created_at', { 
          ascending: options.sortOrder === 'asc' 
        });

      if (error) throw error;

      return data || [];
    });
  }

  /**
   * Get tasks by status
   */
  static async getByStatus(status: 'pending' | 'complete' | 'overdue'): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.getByStatus', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:owner_id(id, name, email),
          assignee:assignee_id(id, name, email)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    });
  }

  /**
   * Get pinned tasks for the current user
   */
  static async getPinned(): Promise<ApiResponse<Task[]>> {
    return apiRequest('tasks.getPinned', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          parent_task:parent_task_id(id, title, description, photo_url, url_link),
          owner:owner_id(id, name, email),
          assignee:assignee_id(id, name, email)
        `)
        .eq('pinned', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    });
  }
}
